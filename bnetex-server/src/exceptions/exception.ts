import { NotFoundException } from "@nestjs/common"
import { UserNotFoundException } from "./userNotFound.exception";


interface ErrorStructure {
    status: number;
    message: string;
}

const exception = (error: ErrorStructure) => {

    if (error.status === 400) {
        if (error.message === "USER_NOT_FOUND") throw new UserNotFoundException;
    }

}

export default exception;