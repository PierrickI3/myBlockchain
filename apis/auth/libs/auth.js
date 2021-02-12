'use strict';

const constants = require('../../config/constants.json');
const { Wallets } = require('fabric-network');
const path = require('path');
const jwt = require('jsonwebtoken');

const getWalletPath = async (org) => {
  if (!org) return null;

  console.log(__dirname);
  let walletPath = path.resolve(__dirname, '../..', 'wallets', `${org.toLowerCase()}-wallet`);
  console.log('[getWalletPath] Wallet path:', walletPath);

  return walletPath;
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

module.exports.auth = async (username, org) => {
  // Check if the user exists already
  if (!(await isUserRegistered(username, org))) {
    console.log(`[create] ${username} not found in the wallet`);
    var response = {
      success: true,
      message: username + ' not found',
    };
    return response;
  }

  // Generate new token
  let token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
      username: username,
      org: org,
    },
    process.env.SECRET
  );

  var response = {
    token: token,
  };
  return response;
};
