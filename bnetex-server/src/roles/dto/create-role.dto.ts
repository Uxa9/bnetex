import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {

    @ApiProperty({
        example : 'investor',
        description : 'user role'
    })
    readonly value: string;

    @ApiProperty({
        example : 'investor-huestor',
        description : 'user role description'
    })
    readonly desc: string;
}