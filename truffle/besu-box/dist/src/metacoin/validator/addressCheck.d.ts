import { ValidatorConstraintInterface } from "class-validator";
export declare class IsValiEthAddress implements ValidatorConstraintInterface {
    validate(address: string): Promise<boolean>;
}
