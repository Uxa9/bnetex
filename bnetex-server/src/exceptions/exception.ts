import { HttpException, HttpStatus } from "@nestjs/common";

interface ErrorStructure {
    code: number;
    message: string;
}

export class MyException extends HttpException {
    constructor(error : ErrorStructure) {
        super(
            {
                status: "ERROR",
                message: error.message
            },
            error.code
        );
    }
}