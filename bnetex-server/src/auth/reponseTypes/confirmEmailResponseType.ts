import { ApiProperty } from "@nestjs/swagger";


export class ConfirmEmailSuccess {
    @ApiProperty({
        example: "SUCCESS"
    })
    status: string;

    @ApiProperty({
        example: "EMAIL_CONFIRMED"
    })
    message: string;

    @ApiProperty({
        example: "aboba.aboba.aboba"
    })
    token: string;
}