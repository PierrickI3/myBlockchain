# Ticketing

A ticketing system with approval/review process

## Requirements

- Docker & docker-compose
- Git
- Node & npm
- Postman
- [Metamask](https://metamask.io): Chrome Extension used to connect to the blockchain network
- XCode (needs to be started at least once to agree to the license terms)
- VSCode
  - LiveServer addon?
  - HTTP requests addon?
  - IBM Blockchain Platform addon

## Getting started

### Using IBM Blockchain Platform VSCode addon



### Using Hyperledger Fabric

Based on [https://medium.com/permchain/setting-up-your-mac-to-use-hyperledger-fabric-2-x-and-start-your-first-test-network-117c74a85c60](https://medium.com/permchain/setting-up-your-mac-to-use-hyperledger-fabric-2-x-and-start-your-first-test-network-117c74a85c60)

- Bootstrap Hyperledger Fabric: `curl -sSL https://bit.ly/2ysbOFE | bash -s`
- Update PATH (update with your absolute path): `export PATH=/Users/pierrick/Documents/truffle/hyperledger-fabric/fabric-samples/bin:$PATH`
- Test your PATH by running `configtxlator version`. If it returns some version info, then you are ready to set up your first network.
- Go to the `fabric-samples/test-network` folder and run `./network.sh up createChannel -ca`
- Run `docker ps -a` to see all running containers: 2 orgs (each running with a peer), a CouchDB, a certification authority, a chaincode container and an orderer
- Deploy a basic smart contract: `./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript`
- Wait until the smart contract is deployed on all peers/nodes
- In the `asset-transfer-basic` folder, run `npm i` then `node app.js`

TODO: Change to ticket. Basic app: [https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html)

- After updating code, do the following to upgrade the chaincode from the `test-network` folder:
  - Run `export PATH=${PWD}/../bin:$PATH`
  - Run `export FABRIC_CFG_PATH=$PWD/../config/`
  - Run `export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`
  - Run `peer lifecycle chaincode package basic_2.tar.gz --path ../asset-transfer-basic/chaincode-javascript/ --lang node --label basic_2.0`
  - Run `export CORE_PEER_TLS_ENABLED=true`
  - for org1
    - Run `export CORE_PEER_LOCALMSPID="Org1MSP"`
    - Run `export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt`
    - Run `export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp`
    - Run `export CORE_PEER_ADDRESS=localhost:7051`
    - Run `peer lifecycle chaincode install basic_2.tar.gz`
    - Get the new package id by running: `peer lifecycle chaincode queryinstalled`
    - Set the new package id in an environment variable by running `export NEW_CC_PACKAGE_ID=basic_2.0:<PACKAGE ID>`
    - Have org1 approve the new chaincode: `peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 2.0 --package-id $NEW_CC_PACKAGE_ID --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`
  - for org2
    - Run `export CORE_PEER_LOCALMSPID="Org2MSP"`
    - Run `export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`
    - Run `export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt`
    - Run `export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp`
    - Run `export CORE_PEER_ADDRESS=localhost:9051`
    - Run `peer lifecycle chaincode install basic_2.tar.gz`
    - Have org2 approve the new chaincode: `peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 2.0 --package-id $NEW_CC_PACKAGE_ID --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"`
  - Check that both orgs are ready to upgrade to the new chaincode: `peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name basic --version 2.0 --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json`. It should return `true` for both orgs.
  - Commit the changes: `peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 2.0 --sequence 2 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"`
  - The new chaincode is now in place. If the chaincode definition changed the endorsement policy, the new policy would be put in effect.
  - Run `docker ps` to check that the new version is in place
  - Run this command to get all tickets: `peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllTickets"]}'`

- To monitor a network, run `./networkmonitor.sh <NETWORK NAME>` (e.g. `./networkmonitor.sh net_test`)

- To turn off the network, run `./network.sh down`
- If you want to run the `asset-transfer-basic` application again after taking down the network, you need to delete the `asset-transfer-basic/wallet` folder first

Optional: [Setup logspout](https://hyperledger-fabric.readthedocs.io/en/latest/deploy_chaincode.html#setup-logspout-optional)

### Items below are for main Ethereum development

#### Using Quorum

- Open a terminal window
- Create a new folder to host your network (e.g. `network`) and cd to it
- Run `npx quorum-dev-quickstart`
  - Select the `Hyperledger Besu` option
  - Select `n` for the `Codefi Orchestra` option
  - Select `y` for `private transactions` support
  - Select `y` for `EFK`
  - Use the default `directory` for the config files
- Cd into the `quorum-test-network` folder
- Run the network: `./run.sh`. This might take a while as it needs to download docker images, build them and create 4 containers with enough peers to synchronize
  - To stop the network later on, run `./stop.sh`
  - To delete the network and the associated docker images, run `./remove.sh`
- When the process ends, you should see something like:

```console
----------------------------------
List endpoints and services
----------------------------------
JSON-RPC HTTP service endpoint      : http://localhost:8545
JSON-RPC WebSocket service endpoint : ws://localhost:8546
Web block explorer address          : http://localhost:25000/
Prometheus address                  : http://localhost:9090/graph
Grafana address                     : http://localhost:3000/d/XE4V0WGZz/besu-overview?orgId=1&refresh=10s&from=now-30m&to=now&var-system=All
Collated logs using Kibana endpoint : http://localhost:5601/app/kibana#/discover
```

- Endpoints (use `./list.sh` to view these endpoints again later on)
  - JSON-RPC HTTP service endpoint: use this to access the RPC node service from your Dapp or from cryptocurrency wallets such as MetaMask.
  - JSON-RPC WebSocket service endpoint: use this to access the Web socket node service from your Dapp.
  - Web block explorer address: use this to display the block explorer Web application. View the block explorer by entering the URL in your Web browser.
  - Prometheus address: use this to access the Prometheus dashboard.
  - Grafana address: use this to access the Grafana dashboard.
  - Collated logs using Kibana endpoint: use this to access the logs in Kibana.
- To get the list of all RPC requests in Postman, open [https://app.getpostman.com/run-collection/a50bfb3e105fc3d24402](https://app.getpostman.com/run-collection/a50bfb3e105fc3d24402)
  - After Postman has loaded the `Hyperledger Besu JSON-RPC API` collection, open it and open the `web/web3_clientversion` and click on `Send`. You should see this:

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "besu/v20.10.0/linux-x86_64/oracle_openjdk-java-11"
}
```

- Now, run the `net/net_peerCount` and you should see this:

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x7"
}
```

- This means that there are 7 nodes running at the moment
- Import metamask accounts?

#### Using Quorum #2

[https://www.trufflesuite.com/tutorials/building-dapps-for-quorum-private-enterprise-blockchains](https://www.trufflesuite.com/tutorials/building-dapps-for-quorum-private-enterprise-blockchains)
[https://www.trufflesuite.com/docs/truffle/distributed-ledger-support/working-with-quorum](https://www.trufflesuite.com/docs/truffle/distributed-ledger-support/working-with-quorum)

#### Using Truffle

- Create a new folder (e.g. `truffle`) and cd to it
- Run `npm i -g truffle`
  - If you get some `Access Denied` errors, follow these instructions
    - Run `mkdir ~/.npm-global`
    - Run `npm config set prefix '~/.npm-global'`
    - Run `export PATH=~/.npm-global/bin:$PATH` (to make this change permanent, add this line to your `~/.bash_profile` file)
    - Run `npm i -g truffle` again
- Create a `frontend` folder, cd to it and run `truffle unbox react` to install a ready-to-use react app
  - Errors occurred on my side but did not affect the project so far
- In a separate terminal window, run `truffle develop` from the `frontend` folder to start the developer console
- Run `migrate` to deploy the default smart contract (will need to be executed every time you make changes to the smart contract)
- Go back to your previous terminal window, from the `frontend/client` folder, run `yarn start`
- Connect your metamask account and follow the instructions

#### Using truffle #2

##### Setup

[video](https://www.youtube.com/watch?v=coQ5dg8wM2o)

- Install [Ganache](https://www.trufflesuite.com/ganache) and start it
- Click on `Quickstart`
- Run `npm i -g truffle`
  - If you get some `Access Denied` errors, follow these instructions
    - Run `mkdir ~/.npm-global`
    - Run `npm config set prefix '~/.npm-global'`
    - Run `export PATH=~/.npm-global/bin:$PATH` (to make this change permanent, add this line to your `~/.bash_profile` file)
    - Run `npm i -g truffle` again
- cd to the `todoList` folder
- Run `truffle migrate` to push the smart contracts to the blockchain network (similar to a DB migration phase). Use the `--reset` parameter option if you want to overwrite an existing smart contract
  - You will probably notice that this had a cost (check if balance is now less than 100 ETH in `ganache`). Deploying contracts to ethereum has a gas price
- To test if everything was deployed correctly, follow these steps:
  - Run `truffle console`
    - Run `todoList = await TodoList.deployed()`
    - Run `todoList.taskCount()`. You should see this: `BN { negative: 0, words: [ 1, <1 empty item> ], length: 1, red: null }`


TODO: Use API? [https://github.com/vigneshkb7/purchase](https://github.com/vigneshkb7/purchase)
- In `todoList/src/service`, run `npm start` to start the service
- In `todoList/src/web`, use VSCode's LiveServer addon by opening the `index.html` and clicking on `Go Live` on the bottom-right of the window


#### Using besu-box

- Run `npm install -g @nestjs/cli`
- Create a folder called `besu-box`
- Run `truffle unbox illuzzig/besu-box`
- Create temp folders: `mkdir -p /tmp/besu/dev/`
- Run a miner: `npm run besu:docker`
- Open another terminal and go to the `besu-box` folder
- Run `truffle migrate --network besu` to deploy the smart contracts
- Run `npm run start:dev` to start the frontend
- Go to [http://localhost:3000/balance/0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73](http://localhost:3000/balance/0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73) to view the current balance for your account
-


##### Deploy

[https://www.youtube.com/watch?v=DqnKNy7br4I](https://www.youtube.com/watch?v=DqnKNy7br4I)