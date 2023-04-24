import { InternalServerError } from "../internalError.exception";
import { UserAlreadyExist } from "./userAlreadyExist.exception";
import { UserNotActivated } from "./userNotActivated.exception";


const authException = (errorCode: number) => {

    switch (errorCode) {
        case 302: throw new UserNotActivated;
        case 400: throw new UserAlreadyExist;
        default:  throw new InternalServerError;
    }
}

export default authException;