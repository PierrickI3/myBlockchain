# ccTickets

Using the IBM Blockchain Platform to create a blockchain-based Competence Center ticketing system

## How to use

### Requirements

- MacOS
- Git
- VSCode
- Docker
- IBM Blockchain Platform vscode extension
- REST Client vscode extension

### Knowledge Requirements

- Blockchain
- Hyperledger Fabric
- Docker

### Getting Started

- Clone this repo and run `npm i` in the `apis` and `asset` folders
- Open the workspace in vscode
- Create a local Hyperledger Fabric network
  - Open the IBM Blockchain Platform addon (square icon in the left-side toolbar)
  - Click on `+ Add local or remote environment`
  - Select the `Create new from template` option
  - Choose the first configuration `1 Org template (1 CA, 1 peer, 1 channel)`
  - Enter `ccTickets` for the environment name
  - Select the `V2_0` channel version and wait for the network to be created
- Deploy the smart contract
  - Press `CMD+SHIFT+P` and select the `IBM Blockchain Platform: Deploy Smart Contract` option
  - Select the `ccTickets` environment
  - In the new window, select the `asset (open project)` option from the `Select smart contract` list
  - Click on `Package open project`. Later on, to re-deploy, you will need to update the version in your `package.json` file
  - Click on `Next` on the top-right
  - Leave the default values and click on `Next` again
  - Click on `Deploy`
- Test the smart contract

  - Press `CMD+SHIFT+P` and select the `IBM Blockchain Platform: Transact with Smart Contract` option
  - Select the `Org1 Gateway`
  - Select the `MyAsset` smart contract
  - In the new window, select the `createMyAsset` transaction
  - In the `Transaction arguments` textbox, enter:
    ```json
    {
      "myAssetId": "001",
      "value": "Test asset 001 "
    }
    ```
  - Click on `Submit transaction` (use `Evaluate transaction` when the operation does not require a change in the blockchain). This will output `No value returned from createMyAsset`
  - Select the `readMyAsset`, set the following `Transaction arguments` and click on `Evaluate transaction`
    ```json
    {
      "myAssetId": "001"
    }
    ```
  - You should see the following output
    ```console
    Returned value from readMyAsset: {"value":"Test asset 001"}
    ```

- Test with the serverless API
  - Open the terminal in the `apis/assets` folder
  - Run `npm i` in case you haven't done it previously
  - Run `npm start` to start the API using `serverless offline`
  - Wait until the API is started and open the `apis/assets/requests/request.http` in vscode
  - Click on each API to test them
