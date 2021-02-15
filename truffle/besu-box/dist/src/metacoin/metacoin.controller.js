"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const metacoin_service_1 = require("./metacoin.service");
const token_transfer_dto_1 = require("./dto/token-transfer.dto");
let MetaCoinController = class MetaCoinController {
    constructor(metaCoinService) {
        this.metaCoinService = metaCoinService;
    }
    async getBalance(id) {
        return await this.metaCoinService.getBalance(id);
    }
    async getBalanceInEth(id) {
        return await this.metaCoinService.getBalanceInEth(id);
    }
    async sendSignedTransaction(tokenTransferDto) {
        return await this.metaCoinService.sendSignedTransaction(tokenTransferDto);
    }
    async getContractAddress() {
        return await this.metaCoinService.getContractAddress();
    }
};
__decorate([
    common_1.Get('/balance/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetaCoinController.prototype, "getBalance", null);
__decorate([
    common_1.Get('/eth-converter/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetaCoinController.prototype, "getBalanceInEth", null);
__decorate([
    common_1.Post('/transfer'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_transfer_dto_1.TokenTransferDto]),
    __metadata("design:returntype", Promise)
], MetaCoinController.prototype, "sendSignedTransaction", null);
__decorate([
    common_1.Get('/contractAddress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetaCoinController.prototype, "getContractAddress", null);
MetaCoinController = __decorate([
    common_1.Controller('/'),
    __metadata("design:paramtypes", [metacoin_service_1.MetaCoinService])
], MetaCoinController);
exports.MetaCoinController = MetaCoinController;
//# sourceMappingURL=metacoin.controller.js.map