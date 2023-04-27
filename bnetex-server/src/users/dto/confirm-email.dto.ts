import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ConfirmEmail {
    
    @ApiProperty({
        example: "bnetex@bne.tex"
    })
    @IsEmail()
    @IsString({
        message : "E-mail must be a string"
    })
    readonly email : string;

    @ApiProperty({
        example: "1234567890"
    })
    @IsString({
        message : "Code must be a string"
    })
    readonly activationCode : string;
}