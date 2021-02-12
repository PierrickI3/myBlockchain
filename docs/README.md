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

Windows only:

- Download [OpenSSL](https://web.archive.org/web/20191113082429/http://slproweb.com/download/Win64OpenSSL-1_0_2t.exe) and install it in the `C:\OpenSSL-Win64` directory

### Getting Started

#### Create local network

- Open the workspace file in vscode
- Open the IBM Blockchain Platform addon (square icon in the left-side toolbar)
- Click on `+ Add local or remote environment`
- Select the `Create new from template` option
- Choose the first configuration `1 Org template (1 CA, 1 peer, 1 channel)`
- Enter `ccTickets` for the environment name
- Select the `V2_0` channel version and wait for the network to be created
- Download the connection file
  - In the `IBM Blockchain Platform` sidebar section, right click on the `Org1 Gateway` item and select `Export Connection Profile`
  - Save it to the `apis/config/connection-org1.json` (overwrite the existing file if there is one)

#### Deploy the smart contract

- Press `CMD+SHIFT+P` and select the `IBM Blockchain Platform: Deploy Smart Contract` option
- Select the `ccTickets` environment
- In the new window, select the `asset (open project)` option from the `Select smart contract` list
- Click on `Package open project`. Later on, to re-deploy, you will need to update the version in your `package.json` file
- Click on `Next` on the top-right
- Leave the default values and click on `Next` again
- Click on `Deploy`

#### APIs

- Open a terminal
- Run `npm i` from the following folders:

  - `apis/libs`
  - `apis/assets`
  - `apis/users`
  - `apis/auth`

- Set a new environment variable: `export SECRET=<WHATEVER YOU WANT HERE>`. This will be used to encrypt tokens.
- Start all APIs by running `npm start` from the `apis` folder

#### Test the smart contract

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

### Ticketing notes

- What now? Ticketing system should process tickets as follows
  - Tickets contain user info
  - Tickets can contain one more more `requests`
  - Each field should be tagged for PII
  - Routing should occur via 3rd party (GC generic objects?)
  - Each action should be logged/tracked
  - Request types
    - CC request
    - Free Trial
    - Cloud Attach Offer
  - Tickets go through specific flows
    - Requester creates a ticket and adds one or more requests
    - Requester references a Salesforce account or opportunity (automatically assigns SC & AE)
    - Approver(s) review the ticket and approves or rejects it
    - Approver(s) assign program manager and agents (team members)
    - All assigned are notified via email
  - Access Permissions
    - Admins: full read/write access
    - Approvers: full read/write access
    - Program Managers: full read/write access to tickets they are assigned to
    - Assigned SCs: full read/write access to tickets they are assigned to
    - AEs: read access to tickets they are assigned to
    - External: read access to all tickets
  - How to deal with regions?

### Dev Help

[https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.html](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.html)

Use `fabric-network` to interact with Smart Contracts (Chaincodes)
Use `fabric-common` to install and start Smart Contracts

#### Fabric-Network

- Entry point is a [Gateway](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.Gateway.html). Once instantiated, it provides a reusable connection to a peer within the blockchain network.
- A `gateway` gives access to [Networks](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.Network.html) (channels) for which that peer is a member.
- A `network` gives access to Smart [Contracts](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.Contract.html) running within that blockchain network.
- Use [Transactions](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.Transaction.html) to submit a `transaction` or to evaluate queries.
- To work with private data, use [Transient](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.Transaction.html#setTransient) data
- Client applications can use [Events Listeners](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.Contract.html)
- All updates to the ledger can be observed using [Block Event Listeners](https://hyperledger.github.io/fabric-sdk-node/release-2.2/module-fabric-network.Network.html)

## Ticketing Fields

Use a form builder? [example](https://github.com/kiho/react-form-builder#readme)

Tickets are the main item and contain data common to all tasks.
A task can be of one type only (e.g. cc request, trial, cloud attach). A ticket can contain multiple tasks.
Each task type contains the field necessary to fulfill the task.

### Ticket

- id
- active
- status (open/closed)
- createdAt
- updatedAt
- title
- description
- email
- phoneNumber
- assigneeName
- assigneeEmail
- assigneePhopneNumber
- priority
- company

### Task

- id
- ticketId: parent id
- userIds: Users assigned to this task
- status: open, waiting for additional information, on hold, closed
- typeId (see TaskTypes below)
- programManager

### TaskTypes

- id
- name: e.g. Competence Center Request
- description
- priority

### CC Request

- region
- subRegion
- segment
- product
- needCompletedBy
- ...

### Trial/POC

- region
- subRegion
- validationType
- existingTelephonyUsage
- ...

### Cloud Attach

- TODO
