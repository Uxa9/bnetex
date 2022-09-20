import classNames from 'classnames';
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
            className={classNames(["block", styles['reg-container']])}
        >
            <p
                className='text-primary'
            >
                Шаг 1/2
            </p>
            <h2
                className={classNames('text-main', styles['container-header'])}
            >
                Аккаунт
            </h2>
            <p
                className={classNames('text-main', styles['container-text'])}
            >
                Введите адрес электронной почты и выберите надежный пароль.
            </p>
            <div
                className={styles['input-wrapper']}
            >
                <Input
                    type={'email'}
                    label="Email или телефон*"
                    hasBackground={false}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                />
                <Input
                    type={'text'}
                    label="Пароль*"
                    hasBackground={false}
                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                />
            </div>
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
    )
}

export default RegForm;