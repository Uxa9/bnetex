import { IsNotEmpty, IsString } from "class-validator";

export class PasswordDto {
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsNotEmpty({})
    readonly password: string;
}