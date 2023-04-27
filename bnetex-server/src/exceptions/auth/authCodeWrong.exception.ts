import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthCodeWrongException extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "WRONG_CODE"
            },
            HttpStatus.FORBIDDEN
        );
    }
}