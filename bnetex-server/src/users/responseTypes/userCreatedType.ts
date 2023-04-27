import { ApiProperty } from "@nestjs/swagger";


export class UserCreatedSuccess {
    @ApiProperty({
        example: "SUCCESS"
    })
    status: string;

    @ApiProperty({
        example: "USER_CREATED"
    })
    message: string;
}