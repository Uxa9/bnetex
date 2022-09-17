
import { Button, Input } from 'lib/ui-kit';
import { FC, useEffect, useState } from 'react';
import styles from '../stepOne.module.scss';

interface RegFormProps {
    sendSignupRequest: (userData : any) => void,
    trackPasswordChange: (password : string) => void,
    loading: boolean
}

const RegForm: FC<RegFormProps> = props => {

    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        props.trackPasswordChange(userData.password);
    }, [userData.password]);
    
    return (
        <div
            className={styles['reg-container']}
        >
            <div
                className="block"
            >
                <p>
                    Шаг 1/2
                </p>
                <h2>
                    Аккаунт
                </h2>
                <p>
                    Введите адрес электронной почты и выберите надежный пароль.
                </p>
                <Input
                    label="Email или телефон*"
                    hasBackground={false}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                />
                <Input
                    type={'password'}
                    label="Пароль*"
                    hasBackground={false}
                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                />
                <div
                    className={styles['button-wrapper']}
                >
                    <Button
                        form="signupForm"
                        buttonStyle="primary"
                        text="Далее"
                        onClick={() => props.sendSignupRequest(userData)}
                        disabled={props.loading}
                    />
                </div>
            </div>
        </div>
    )
}

export default RegForm;