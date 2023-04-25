import { IsNumber, IsString } from "class-validator";

export class ChangePasswordDto {

    @IsString({
        message : "Previous password must be a string"
    })
    readonly prevPassword : string;

    @IsString({
        message : "New password must be a string"
    })
    readonly newPassword : string;

}