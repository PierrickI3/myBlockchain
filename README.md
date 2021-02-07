# ccTickets

Using the IBM Blockchain Platform (commercial distribution of [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/key_concepts.html)) to create a blockchain-based Competence Center ticketing system.

## How to use

### Knowledge Requirements

- Blockchain
- [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/key_concepts.html)
- Docker

### Requirements

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- `IBM Blockchain Platform` Visual Studio Code extension
- `REST Client for Visual Studio Code` Visual Studio Code extension

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

- What now? Ticketing system should process tickets as follows
  - Tickets contain user info
  - Tickets can contain one more more `requests`
  - Each field should be tagged for PII
  - Routing should occur via 3rd party (GC generic objects?)
  - Each action should be logged anonymously
  - Request types
    - CC request
    - Free Trial
    - Cloud Attach Offer
  - Tickets go through specific flows
    - Requester create a ticket and add one or more requests
    - Requester references a Salesforce account or opportunity (automatically assigns SC & AE)
    - Approver(s) review the ticket and approves or rejects it
    - Approver(s) assign program manager and agents (team members)
  - Access Permissions
    - Admins: full read/write access
    - Approvers: full read/write access
    - Program Managers: full read/write access to tickets they are assigned to
    - Assigned SCs: full read/write access to tickets they are assigned to
    - AEs: read access to tickets they are assigned to
    - External: read access to all tickets
  - How to deal with regions?