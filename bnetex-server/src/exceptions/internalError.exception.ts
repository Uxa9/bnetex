import { HttpException, HttpStatus } from "@nestjs/common";

export class InternalServerError extends HttpException {
    constructor() {
        super(
            {
                status: "ERROR",
                message: "SERVER_FAILURE"
            },
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}