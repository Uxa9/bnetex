import axios from "axios";

interface UserItemProps {
    email: string,
    password: string
}

const signup = async (userData: UserItemProps) => {
    try {
        const response = await axios.post(
            'http://localhost:5000/auth/registration',
            userData
        )
    } catch (error) {
        console.log(error);
    }
}

export default signup;