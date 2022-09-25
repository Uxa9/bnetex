import axios, { AxiosError } from "axios";

interface UserItemProps {
    email: string,
    password: string
}

const signin = async (userData: UserItemProps) => {

    const response = await axios.post(
        'https://api.bnetex.com/auth/login',
        userData
    )
        .catch((error: Error | AxiosError) => {

            if (axios.isAxiosError(error)) {
                return error.response;
            } else {
                return {
                    status: 500,
                    data: [],
                };
            }
        });

    return response;
};

export default signin;
