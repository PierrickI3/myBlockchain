const os = require('os');
const path = require('path');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const { disconnect } = require('process');

let gateway;
let homedir;
let walletPath;

class Asset {
  constructor() {
    homedir = os.homedir();
    walletPath = path.join(homedir, '.fabric-vscode', 'v2', 'environments', 'ccTickets', 'wallets', 'Org1');

    gateway = new fabricNetwork.Gateway();
  }

  async init() {
    const identityName = 'Org1 Admin';
    let connectionProfile = await SmartContractUtil.getConnectionProfile();
    let wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

    const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
    const discoveryEnabled = true;

    const options = {
      wallet: wallet,
      identity: identityName,
      discovery: {
        asLocalhost: discoveryAsLocalhost,
        enabled: discoveryEnabled,
      },
    };

    await gateway.connect(connectionProfile, options);
  }

  async disconnect() {
    await gateway.disconnect();
  }

  async get(id) {
    const args = [id];

    await this.init();

    const response = await SmartContractUtil.submitTransaction('MyAssetContract', 'readMyAsset', args, gateway);
    return JSON.parse(response.toString());
  }

  async create(myAssetId, value) {
    const args = [myAssetId, value];

    await this.init();

    const response = await SmartContractUtil.submitTransaction('MyAssetContract', 'createMyAsset', args, gateway);
    return response;
  }

  async update(myAssetId, value) {
    const args = [myAssetId, value];

    await this.init();

    const response = await SmartContractUtil.submitTransaction('MyAssetContract', 'updateMyAsset', args, gateway);
    return response;
  }

  async delete(myAssetId) {
    const args = [myAssetId];

    await this.init();

    const response = await SmartContractUtil.submitTransaction('MyAssetContract', 'deleteMyAsset', args, gateway);
    return response;
  }
}

module.exports = Asset;
