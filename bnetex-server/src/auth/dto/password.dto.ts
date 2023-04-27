import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PasswordDto {
    @ApiProperty({
        example: "aboba228",
        description: "user password"
    })
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsNotEmpty({})
    readonly password: string;
}