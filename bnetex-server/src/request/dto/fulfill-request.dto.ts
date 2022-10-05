import { IsNumber, IsString, Min } from "class-validator";

export class FulfillRequest {

    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly requestId : number;

    @IsString({
        message: "code must be a string"
    })
    readonly confirmCode : string;
}