import { HttpException, HttpStatus } from "@nestjs/common";

export class UserWrongPassword extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "WRONG_PASSWORD"
            },
            HttpStatus.UNAUTHORIZED
        );
    }
}