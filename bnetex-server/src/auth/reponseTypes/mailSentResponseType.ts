import { ApiProperty } from "@nestjs/swagger";


export class MailSentResponse {
    @ApiProperty({
        example: "SUCCESS"
    })
    status: string;

    @ApiProperty({
        example: "MAIL_SENT"
    })
    message: string;
}