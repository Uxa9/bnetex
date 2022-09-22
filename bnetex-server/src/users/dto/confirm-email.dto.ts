import { IsEmail, IsString } from "class-validator";

export class ConfirmEmail {

    @IsEmail()
    @IsString({
        message : "E-mail must be a string"
    })
    readonly email : string;

    @IsString({
        message : "Code must be a string"
    })
    readonly activationCode : string;
}