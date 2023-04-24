import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "USER_NOT_FOUND"
            },
            HttpStatus.BAD_REQUEST
        );
    }
}