import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyActivated extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "USER_ALREADY_ACTIVATED"
            },
            HttpStatus.FORBIDDEN
        );
    }
}