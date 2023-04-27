import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
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

    @ApiProperty({
        example: "1234567890",
        description: "Activation code"
    })
    @IsString({
        message : 'Code must be a string'
    })
    @IsNotEmpty({})
    readonly code: string;

    @ApiProperty({
        example: "aboba228",
        description: "user password"
    })
    @IsString({
        message : 'Password must be a string'
    })
    @IsNotEmpty({})
    readonly password: string;
}
