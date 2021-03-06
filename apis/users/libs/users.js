'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
const CDBKVS = require('fabric-client/lib/impl/CouchDBKeyValueStore.js');

const getConnectionProfile = async (org) => {
  if (!org) return null;

  console.log('[getConnectionProfile] org:', org);
  let connectionProfilePath = path.resolve(__dirname, '../..', 'config', `connection-${org.toLowerCase()}.json`);
  const connectionProfileJson = (await fs.promises.readFile(connectionProfilePath)).toString();
  const connectionProfile = JSON.parse(connectionProfileJson);

  return connectionProfile;
};

const getCaUrl = async (org, connectionProfile) => {
  if (!org) return null;

  let caURL = connectionProfile.certificateAuthorities[`${org.toLowerCase()}ca-api.127-0-0-1.nip.io:8080`].url;
  console.log('[getCaUrl] caURL:', caURL);

  return caURL;
};

const getWalletPath = async (org) => {
  if (!org) return null;

  let walletPath = path.resolve(__dirname, '../..', 'wallets', `${org.toLowerCase()}-wallet`);
  console.log('[getWalletPath] Wallet path:', walletPath);

  return walletPath;
};

const getAffiliation = (org) => {
  if (!org) return null;

  let affiliation = `${org.toLowerCase()}.department1`;
  console.log('[getAffiliation] Affiliation:', affiliation);

  return `${org.toLowerCase()}.department1`;
};

const getCaInfo = async (org, connectionProfile) => {
  if (!org) return null;

  let caInfo = connectionProfile.certificateAuthorities[`${org.toLowerCase()}ca-api.127-0-0-1.nip.io:8080`];
  console.log('[getCaInfo] caInfo:', caInfo);

  return caInfo;
};

async function isUserRegistered(username, org) {
  const walletPath = await getWalletPath(org);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(`[isUserRegistered] An identity for the user ${username} exists in the wallet`);
    return true;
  }
  console.warn(`[isUserRegistered] No identity for the user ${username} found in the wallet`);
  return false;
}

const enrollAdmin = async (org, ccp) => {
  console.log('calling enroll Admin method');

  try {
    const caInfo = await getCaInfo(org, ccp); //ccp.certificateAuthorities['ca.org1.example.com'];
    console.log('caInfo:', caInfo);

    // Local fabric does not have any tls ca certificates
    //const caTLSCACerts = caInfo.tlsCACerts.pem;
    //const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    const ca = new FabricCAServices(caInfo.url);

    // Create a new file system based wallet for managing identities.
    const walletPath = await getWalletPath(org); //path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get('admin');
    if (identity) {
      console.log('An identity for the admin user "admin" already exists in the wallet');
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    let x509Identity;
    if (org == 'Org1') {
      x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      };
    } else if (org == 'Org2') {
      x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org2MSP',
        type: 'X.509',
      };
    }

    await wallet.put('admin', x509Identity);
    console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    return;
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
  }
};

module.exports.getAll = async (org) => {
  const walletPath = await getWalletPath(org);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  return wallet.list();
};

module.exports.get = async (username, org) => {
  return isUserRegistered(username, org);
};

module.exports.create = async (username, org) => {
  let connectionProfile = await getConnectionProfile(org);
  const caURL = await getCaUrl(org, connectionProfile);
  const ca = new FabricCAServices(caURL);
  const walletPath = await getWalletPath(org);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  // Check if the user exists already
  if (await isUserRegistered(username, org)) {
    console.log(`[create] An identity for the user ${username} already exists in the wallet`);
    var response = {
      success: true,
      message: username + ' already exists',
    };
    return response;
  }

  // Check to see if the admin user is already enrolled
  let adminIdentity = await wallet.get('admin');
  if (!adminIdentity) {
    console.log('[create] An identity for the admin user "admin" does not exist in the wallet');
    await enrollAdmin(org, connectionProfile);
    adminIdentity = await wallet.get('admin');
    console.log('[create] Admin Enrolled Successfully');
  }

  // Act on behalf of the admin user
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, 'admin');

  let affiliation = getAffiliation(org);
  console.log('[create] Affiliation:', affiliation);

  // Register and enroll the user then save to wallet
  let secret;
  try {
    // Register the user
    console.log('[create] Registering user');
    secret = await ca.register(
      {
        affiliation: affiliation,
        enrollmentID: username,
        role: 'client',
        attrs: [
          {
            name: 'role',
            value: 'approver',
            ecert: true,
          },
        ],
      },
      adminUser
    );
    console.log('[create] secret:', secret);

    // Store secret somewhere

    // Enroll the user
    let enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: secret,
    });
    //console.log('[create] User enrolled:', enrollmentResponse);
    console.log('[create] User enrolled');

    // Import the new identity into the wallet
    console.log('[create] Importing new identity into the wallet');
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: org,
      type: 'X.509',
    };
    await wallet.put(username, x509Identity);
  } catch (error) {
    console.error(error);
    return error.message;
  }

  var response = {
    success: true,
    message: username + ' enrolled successfully (final)',
    secret: secret,
  };
  return response;
};

module.exports.delete = async (username, org) => {
  let connectionProfile = await getConnectionProfile(org);
  const caURL = await getCaUrl(org, connectionProfile);
  const ca = new FabricCAServices(caURL);
  const walletPath = await getWalletPath(org);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  // Check if the user exists already
  if (!(await isUserRegistered(username, org))) {
    console.log(`[create] ${username} not found in the wallet`);
    var response = {
      success: true,
      message: username + ' not found',
    };
    return response;
  }

  // Check to see if the admin user is already enrolled
  let adminIdentity = await wallet.get('admin');
  if (!adminIdentity) {
    console.log('[create] An identity for the admin user "admin" does not exist in the wallet');
    await enrollAdmin(org, connectionProfile);
    adminIdentity = await wallet.get('admin');
    console.log('[create] Admin Enrolled Successfully');
  }

  // Act on behalf of the admin user
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, 'admin');

  // Register and enroll the user then save to wallet
  try {
    // Revoke the user's certificate
    console.log('[create] Revoking user certificate');
    await ca.revoke({ enrollmentID: username, reason: 'Unspecified' }, adminUser); // Reasons: https://pkg.go.dev/golang.org/x/crypto/ocsp (search for 'reason')
    console.log('[create] User certificate revoked');

    // Delete the user from the wallet
    console.log('[create] Removing identity from the wallet');
    await wallet.remove(username);
  } catch (error) {
    console.error(error);
    return error.message;
  }

  var response = {
    success: true,
    message: username + '  deleted successfully',
  };
  return response;
};
