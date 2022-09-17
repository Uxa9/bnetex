import { Button, Input } from "lib/ui-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import confirmEmail from "services/confirmEmail";
import { login } from "store/action-creators/auth";
import RegistrationTemplate from "../registrationTemplate"

import styles from './stepTwo.module.scss';

const StepTwo = () => {

    const [loading, isLoading] = useState(false);
    const [activationLink, setActivationLink] = useState('');

    const navigate = useNavigate();

    const email = localStorage.getItem('email') || '';

    const sendActivationLink = async () => {
        if ( activationLink !== '' ) {
            isLoading(true);

            const response = await confirmEmail({email, activationLink});
    
            if (response?.status === 500) {
                alert('pizdec');
            }
    
            if (response?.status === 201) {
                localStorage.removeItem('email');
                login(response?.data.token);
                navigate('/signup/success');
            }
    
            isLoading(false);
        }
    }

    return (
        <RegistrationTemplate>
            <div
                className="block"
            >
                <p>
                    Шаг 2/2
                </p>
                <h2>
                    Верификация email
                </h2>
                <p>
                    Пожалуйста, введите код подтверждения, 
                    отправленный на {email}.
                </p>
                <p>
                    Код действителен в течение m минут.
                </p>
                <Input
                    label="Код подтверждения *"
                    hasBackground={false}
                    onChange={(e) => setActivationLink(e.target.value)}
                />
                <div
                    className={styles['button-wrapper']}
                >
                    <Button
                        form="signupForm"
                        buttonStyle="primary"
                        text="Далее"
                        onClick={() => sendActivationLink()}
                    />
                </div>
            </div>
        </RegistrationTemplate>
    )
}

export default StepTwo;