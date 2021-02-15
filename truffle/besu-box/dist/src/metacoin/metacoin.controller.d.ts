import { MetaCoinService } from './metacoin.service';
import { TokenTransferDto } from './dto/token-transfer.dto';
export declare class MetaCoinController {
    private readonly metaCoinService;
    constructor(metaCoinService: MetaCoinService);
    getBalance(id: string): Promise<string>;
    getBalanceInEth(id: string): Promise<string>;
    sendSignedTransaction(tokenTransferDto: TokenTransferDto): Promise<any>;
    getContractAddress(): Promise<string>;
}
