import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

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
    @IsNotEmpty({})
    readonly email: string;

    @ApiProperty({
        example : 'aboba228',
        description : 'user password'
    })
    @IsString({
        message : 'Password must be a string'
    })
    @MinLength(8, {
        message : 'Password must be longer than 8 symbols'
    })
    readonly password: string;

    // @ApiProperty({
    //     example : 'investor',
    //     description : 'user role'
    // })
    // readonly role: string;
}