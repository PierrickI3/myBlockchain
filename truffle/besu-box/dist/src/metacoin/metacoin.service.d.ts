import { TokenTransferDto } from './dto/token-transfer.dto';
export declare class MetaCoinService {
    getBalance(account: string): Promise<string>;
    getBalanceInEth(account: string): Promise<string>;
    getContractAddress(): Promise<string>;
    sendSignedTransaction(tokenTransferDto: TokenTransferDto): Promise<string>;
}
