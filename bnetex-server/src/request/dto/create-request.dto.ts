import { IsNumber, IsString, Min } from "class-validator";

export class CreateRequest {

    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;

    @IsNumber({}, {
        message : "Amount must be a number"
    })
    @Min(0, {
        message : "Value must be more than 0"
    })
    readonly amount : number;

    @IsString({
        message: "walletAddress must be a string"
    })
    readonly walletAddress : string;

    @IsString({
        message: "type must be a string"
    })
    readonly type : string;
}