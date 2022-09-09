import { IsNumber, IsString } from "class-validator";

export class RefreshToken {

    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;

    @IsString({
        message : "Value must be a string"
    })
    readonly refreshToken : string;
}