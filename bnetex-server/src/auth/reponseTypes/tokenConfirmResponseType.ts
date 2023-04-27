import { ApiProperty } from "@nestjs/swagger";


export class TokenConfirmResponse {
    @ApiProperty({
        example: true
    })
    valid : boolean;
}