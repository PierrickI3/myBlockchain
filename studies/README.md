# Blockchain Ticketing

## Get Started

### Prequisites

- Install [git](https://git-scm.com/downloads)
- Install [curl](https://curl.haxx.se/download.html)
- Install [minikube](https://minikube.sigs.k8s.io/docs/)

### Get Hyperledger binaries

- Clone this repository and cd to the `network` folder
- Get the latest Hyperledger binaries: `curl -sSL https://bit.ly/2ysbOFE | bash -s -- -s -d`
- Add the new bin folder to your PATH: `export PATH=${PWD}/bin:$PATH`
- To make this change permanent, add this change to your `~/.bash_profile`
  - `nano ~/.bash_profile`
  - Add `export PATH=<path to the folder you are working from>/bin:$PATH`, save the file and exit
  - Run `source ~/.bash_profile` to refresh your current terminal settings

### Create the Hyperledger network

- Start minikube: `minikube start --cpus 6 --disk-size 400g --memory 8192 --vm=true --driver=hyperkit`
  - To stop minikube later on, run: `minikube stop`
  - To get rid of the minikube cluster completely, run `minikube delete`
- Enable the minikue ingress addon: `minikube addons enable ingress`
- In a separate terminal window, run `minikube dashboard` to be able to access the Kubernetes dashboard
- Mount multiple folders (each command will require a separate terminal window):
  - `minikube mount /Users/pierrick/Documents/Blockchain/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp:/var/hyperledger/orderer/msp`
  - `minikube mount /Users/pierrick/Documents/Blockchain/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls:/var/hyperledger/orderer/tls`
- Run `./network.sh up` to deploy containers in kubernetes and create the network
- In a separate terminal, run `kubectl port-forward service/orderer0 7053:7053 -n hyperledger` to expose the orderer's port to localhost
- Run `./network.sh createChannel` to create a channel

TODO: Create peers



- Run `minikube mount /Users/pierrick/Documents/Blockchain/network/system-genesis-block/genesis.block:/var/hyperledger/orderer/orderer.genesis.block`


Zeeve
admin
AdminHyper123!