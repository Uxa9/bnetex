import { IsNumber, IsString } from "class-validator";

export class ChangePasswordDto {

    @IsNumber({}, {
        message : "Id must be a number"
    })
    readonly userId : number;

    @IsString({
        message : "Password must be a string"
    })
    readonly prevPassword : string;

    @IsString({
        message : "Password must be a string"
    })
    readonly newPassword : string;
}