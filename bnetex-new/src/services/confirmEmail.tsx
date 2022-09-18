import axios, { AxiosError } from "axios";

interface ConfirmEmailProps {
    activationCode : string,
    email          : string
}

const confirmEmail = async (userData: ConfirmEmailProps) => {

    const response = await axios.post(
        'http://localhost:5000/auth/confirm-email',
        userData
    )
    .catch((error: Error | AxiosError) => {

        if (axios.isAxiosError(error)) {
            return error.response;
        } else {
            return {
                status: 500,
                data: []
            }
        }
    });

    return response;
}

export default confirmEmail;