import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TokenVerify {
    @ApiProperty({
        example: "aboba.aboba.aboba",
        description: "user e-mail"
    })
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsNotEmpty({})
    readonly token: string;
}