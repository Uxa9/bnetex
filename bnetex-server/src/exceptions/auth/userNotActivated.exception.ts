import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotActivated extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "USER_FOUND_BUT_NOT_ACTIVATED"
            },
            HttpStatus.FOUND
        );
    }
}