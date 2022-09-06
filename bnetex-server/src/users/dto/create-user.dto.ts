import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        example : 'bnetex@bne.tex',
        description : 'user e-mail'
    })
    @IsString({
        message : 'E-mail must be a string'
    })
    @IsEmail({}, {
        message : 'E-mail is not valid'
    })
    readonly email: string;

    @ApiProperty({
        example : 'aboba228',
        description : 'user password'
    })
    @IsString({
        message : 'Password must be a string'
    })
    @Length(4, 16, {
        message : 'Password must be between 4 and 16 length'
    })
    readonly password: string;

    @ApiProperty({
        example : 'investor',
        description : 'user role'
    })
    readonly role: string;
}