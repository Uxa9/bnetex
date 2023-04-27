import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailDto {
    @ApiProperty({
        example: "bnetex@bne.tex",
        description: "user e-mail"
    })
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsEmail({}, {
        message : 'E-mail is not valid'
    })
    @IsNotEmpty({})
    readonly email: string;
}