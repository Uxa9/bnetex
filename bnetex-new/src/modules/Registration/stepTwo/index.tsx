import classNames from "classnames";
import { useActions } from "lib/hooks/useActionCreators";
import { Button, Input } from "lib/ui-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import confirmEmail from "services/confirmEmail";
import { login } from "store/action-creators/auth";
import RegistrationTemplate from "../registrationTemplate"

import styles from './stepTwo.module.scss';

const StepTwo = () => {

    const [loading, isLoading] = useState(false);
    const [activationCode, setActivationCode] = useState('');

    const { login } = useActions();
    const navigate = useNavigate();

    const email = localStorage.getItem('email') || '';

    const sendActivationCode = async () => {
        if ( activationCode !== '' ) {
            isLoading(true);

            const response = await confirmEmail({email, activationCode});
    
            if (response?.status === 500) {
                alert('pizdec');
            }
    
            if (response?.status === 201) {
                localStorage.removeItem('email');

                // login(response?.data.token);
                navigate('../success');
            }
    
            isLoading(false);
        }
    }

    return (
        <RegistrationTemplate>
            <div
                className={classNames('block', styles['content-wrapper'])}
            >
                <p
                    className="text-primary"
                >
                    Шаг 2/2
                </p>
                <h2
                    className={classNames('text-main', styles['container-header'])}
                >
                    Верификация email
                </h2>
                <div
                    className={classNames("text-main", styles['container-text'])}
                >
                    <p>
                        Пожалуйста, введите код подтверждения, 
                        отправленный на {email}.
                    </p>
                    <p>
                        Код действителен в течение m минут.
                    </p>
                </div>
                <Input
                    label="Код подтверждения *"
                    hasBackground={false}
                    onChange={(e) => setActivationCode(e.target.value)}
                />
                <div
                    className={styles['button-wrapper']}
                >
                    <Button
                        form="signupForm"
                        buttonStyle="primary"
                        text="Далее"
                        onClick={() => sendActivationCode()}
                    />
                </div>
            </div>
        </RegistrationTemplate>
    )
}

export default StepTwo;