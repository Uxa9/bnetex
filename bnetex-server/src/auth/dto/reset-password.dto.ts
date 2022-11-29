import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsEmail({}, {
        message : 'E-mail is not valid'
    })
    @IsNotEmpty({})
    readonly email: string;

    @IsString({
        message : 'Code must be a string'
    })
    @IsNotEmpty({})
    readonly code: string;

    @IsString({
        message : 'Password must be a string'
    })
    @IsNotEmpty({})
    readonly password: string;
}
