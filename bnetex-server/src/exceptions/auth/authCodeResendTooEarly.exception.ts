import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthCodeResendTooEarly extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "AUTH_CODE_REQUIRED_TOO_MANY_TIMES"
            },
            HttpStatus.TOO_MANY_REQUESTS
        );
    }
}