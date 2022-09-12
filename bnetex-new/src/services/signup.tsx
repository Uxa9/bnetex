import axios, { AxiosError } from "axios";

interface UserItemProps {
    email: string,
    password: string
}

const signup = async (userData: UserItemProps) => {

    const response = await axios.post(
        'http://localhost:5000/auth/registration',
        userData
    )
    .catch((error: Error | AxiosError) => {

        if (axios.isAxiosError(error)) {
            return error.response;
        } else {
            return {
                status: 500
            }
        }
    });

    return response;
}

export default signup;