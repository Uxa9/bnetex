import { HttpException, HttpStatus } from "@nestjs/common";

export class MailNotSend extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "ERROR_WHILE_SEND_MAIL_CHECK_EMAIL_ADDRESS"
            },
            HttpStatus.FORBIDDEN
        );
    }
}