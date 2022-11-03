import { IsNotEmpty, IsString } from "class-validator";

export class TokenVerify {
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsNotEmpty({})
    readonly token: string;
}