import { HttpStatus } from "@nestjs/common"
import { UserNotFoundException } from "../userNotFound.exception";
import { UserNotActivated } from "../user/userNotActivated.exception";
import { UserWrongPassword } from "../user/userWrongPassword.exceptions";
import { InternalServerError } from "../internalError.exception";


const userException = (errorCode: number) => {

    switch (errorCode) {
        case HttpStatus.BAD_REQUEST: throw new UserNotFoundException;
        case HttpStatus.UNAUTHORIZED: throw new UserWrongPassword;
        case HttpStatus.FORBIDDEN: throw new UserNotActivated;    
        default: throw new InternalServerError;
    }
}

export default userException;