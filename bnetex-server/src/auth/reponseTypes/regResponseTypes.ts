import { ApiProperty } from "@nestjs/swagger";


export class RegSuccess {
    @ApiProperty({
        example: "SUCCESS"
    })
    status: string;

    @ApiProperty({
        example: "REG_SUCCESS"
    })
    message: string;
}