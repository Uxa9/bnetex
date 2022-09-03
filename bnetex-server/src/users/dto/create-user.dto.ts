import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({
        example : 'bnetex@bne.tex',
        description : 'user e-mail'
    })
    readonly email: string;

    @ApiProperty({
        example : 'aboba228',
        description : 'user password'
    })
    readonly password: string;
}