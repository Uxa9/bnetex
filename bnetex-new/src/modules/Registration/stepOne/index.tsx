import classNames from "classnames";
import Blur from "components/blurredBackgroundItem";
import { useState } from "react";
import signup from "services/signup";
import RegistrationTemplate from "../registrationTemplate";
import PasswordCheck from "./components/passwordCheck";
import RegForm from "./components/regForm";
import { useNavigate } from "react-router-dom";

import styles from './stepOne.module.scss';


const StepOne = () => {

    const [isFormSent, setIsFormSent] = useState(false);
    const [loading, isLoading] = useState(false);
    const [userPassword, setUserPassword] = useState("");

    const navigate = useNavigate();

    let isPasswordValid = false;

    const sendSignupRequest = async (userData : any) => {

        setIsFormSent(true);
        if ( isPasswordValid && userData?.email !== '' ) {
            isLoading(true);

            const response = await signup(userData);
    
            if (response?.status === 500) {
                alert('pizdec');
            }
    
            if (response?.status === 201) {
                localStorage.setItem('email', userData?.email);

                navigate('./verification');
            }
    
            isLoading(false);
        }
    }

    return (
        <RegistrationTemplate>
            <RegForm 
                sendSignupRequest={(data) => sendSignupRequest(data)} 
                trackPasswordChange={(password) => setUserPassword(password)} 
                loading={loading} 
            />
            <PasswordCheck 
                password={userPassword}
                isFormSent={isFormSent}
                isPasswordValid={(valid) => isPasswordValid = valid}
            />
        </RegistrationTemplate>
    )
}

export default StepOne;