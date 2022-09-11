import classNames from "classnames";
import Blur from "components/blurredBackgroundItem";
import { Button, Input } from "lib/ui-kit";
import Check from "lib/ui-kit/cutom-icons/check";
import Cross from "lib/ui-kit/cutom-icons/cross";
import { useEffect, useState } from "react";
import signup from "services/signup";

import styles from './registration.module.scss';


const Registration = () => {

    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const [passwordReq, setPasswordReq] = useState({
        eightSymbols : false,
        digit : false,
        uppercase : false
    });

    useEffect(() => {
        passwordRequirementChecker(userData.password)
    }, [userData.password]);

    const [isFormSent, setIsFormSent] = useState(false);

    const passwordRequirementChecker = (value: string) => {
        setPasswordReq({
            eightSymbols : value.match(/^[0-9a-zA-Z]{8,}$/) !== null,
            digit : value.match(/(?=.*\d)/) !== null,
            uppercase : value.match(/(?=.*[A-Z])/) != null,
        });
    }

    const passwordReqRowRender = (type: string) => {
        const passwordReqRowValue = passwordReq[type as keyof typeof passwordReq];

        const textColorRender = () => {
            if ( isFormSent ) {
                if ( !passwordReqRowValue ) {
                    return styles['password-check-popup-row-text-red'];
                } else return styles['password-check-popup-row-text-green'];
            } else {
                if ( passwordReqRowValue ) {
                    return styles['password-check-popup-row-text-green'];
                }
            }
        }
    
        const renderIcon = () => {
            if ( isFormSent ) {
                if ( !passwordReqRowValue ) {
                    return (<Cross />);
                } else return (<Check />);
            } else {
                if ( passwordReqRowValue ) {
                    return (<Check />);
                } else return (<></>)
            }        
        }

        const textRender = (type: string) => {
            switch (type) {
                case 'eightSymbols':
                    return 'Минимум 8 символов'
                case 'digit':
                    return 'Хотя бы 1 цифра'
                case 'uppercase':
                    return 'Хотя бы 1 заглавная буква'
                default:
                    return '';
            }
        }

        return (
            <div
                className={styles['password-check-popup-row']}
            >
                {renderIcon()}
                <p
                    className={textColorRender()}
                >
                    {textRender(type)}
                </p>
            </div>
        )
    }

    return (
        <div>
            <div
                className="background-blur"
            >
                <Blur 
                    color={'purple'}
                    top={'0'}
                    left={'0'} 
                    type={'ellipse'}
                    rotate={-165}
                />
                <Blur 
                    color={'blue'}
                    top={'-10%'}
                    left={'30%'} 
                    type={'ellipse'}
                />
                <Blur 
                    color={'green'}
                    top={'-30%'}
                    left={'-10%'} 
                    type={'circle'}
                />        
            </div>
            <div
                className={styles['reg-container']}
            >
                <div
                    className="block"
                >
                    <p>
                        Шаг 1/4
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
                            onClick={() => signup(userData)}
                        />
                    </div>
                </div>
            </div>
            <div
                className={classNames('block', styles['password-check-popup'])}
            >
                {passwordReqRowRender('eightSymbols')}
                {passwordReqRowRender('digit')}
                {passwordReqRowRender('uppercase')}
            </div>
        </div>
    )
}

export default Registration;