import { ApiProperty } from "@nestjs/swagger";


export class ResponseFailure {
    @ApiProperty({
        example: "ERROR"
    })
    status: string;

    @ApiProperty({
        example: "ERROR_REASON"
    })
    message: string;
}