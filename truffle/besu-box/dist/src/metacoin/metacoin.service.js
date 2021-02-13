"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const truffleContract = require("truffle-contract");
const metacoinArtifact = require("../../build/contracts/MetaCoin.json");
const utility_1 = require("../config/utility");
const MetaCoin = truffleContract(metacoinArtifact);
MetaCoin.setProvider(utility_1.default.currentProvider);
let MetaCoinService = class MetaCoinService {
    async getBalance(account) {
        try {
            const instance = await MetaCoin.deployed();
            const value = await instance.getBalance.call(account, { from: account });
            const balance = value.toString();
            return JSON.stringify({
                address: account,
                balance: balance
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException({ description: 'Unable to get balance of account: ' + account });
        }
    }
    async getBalanceInEth(account) {
        try {
            const instance = await MetaCoin.deployed();
            const value = await instance.getBalanceInEth.call(account, { from: account });
            const balance = value.toString();
            return JSON.stringify({
                address: account,
                balance: balance
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException({ description: 'Unable to get balance of account: ' + account });
        }
    }
    async getContractAddress() {
        const instance = await MetaCoin.deployed();
        return JSON.stringify({
            contractAddress: instance.address
        });
    }
    async sendSignedTransaction(tokenTransferDto) {
        const { tx } = tokenTransferDto;
        let resp;
        try {
            await utility_1.default.eth.sendSignedTransaction(tx).on('receipt', receipt => {
                const { transactionHash, status, to, blockNumber } = receipt;
                resp = {
                    transactionHash: transactionHash,
                    status: status,
                    to: to,
                    blockNumber: blockNumber
                };
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException({ description: error.message });
        }
        return resp;
    }
};
MetaCoinService = __decorate([
    common_1.Injectable()
], MetaCoinService);
exports.MetaCoinService = MetaCoinService;
//# sourceMappingURL=metacoin.service.js.map