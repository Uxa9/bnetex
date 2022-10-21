import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GetActivationLinkTime {
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsEmail({}, {
        message : 'E-mail is not valid'
    })
    @IsNotEmpty({})
    readonly email: string;
}