import { IsNumber, IsString, Min } from "class-validator";

export class TransferMoney {

    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;

    @IsString({
        message : "Value must be a string"
    })
    readonly firstWallet : string;

    @IsString({
        message : "Value must be a string"
    })
    readonly secondWallet : string;

    @IsNumber({}, {
        message : "Id must be a number"
    })
    @Min(0, {
        message : "Value must be more than 0"
    })
    readonly amount : number;
}