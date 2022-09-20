import classNames from "classnames";
import Check from "lib/ui-kit/cutom-icons/check";
import Cross from "lib/ui-kit/cutom-icons/cross";
import { FC, useEffect, useState } from "react";

import styles from '../stepOne.module.scss';

interface PasswordCheckProps {
    password : string,
    isFormSent : boolean,
    isPasswordValid : (status : boolean) => void
}

const PasswordCheck: FC<PasswordCheckProps> = (props) => {

    const [isFormSent, setIsFormSent] = useState(false);
    const [passwordReq, setPasswordReq] = useState({
        eightSymbols : false,
        digit : false,
        uppercase : false
    });

    useEffect(() => {
        passwordRequirementChecker(props.password);
    }, [props.password]);

    useEffect(() => {
        setIsFormSent(props.isFormSent);
    }, [props.isFormSent]);

    useEffect(() => {
        if (
            passwordReq.eightSymbols &&
            passwordReq.digit &&
            passwordReq.uppercase
        ) {
            props.isPasswordValid(true);
        } else {
            props.isPasswordValid(false);
        }
    }, [passwordReq]);

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
                } else return (<div className={styles['empty-icon']} />)
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
        <div
            className={classNames('block', styles['password-check-popup'])}
        >
            {passwordReqRowRender('eightSymbols')}
            {passwordReqRowRender('digit')}
            {passwordReqRowRender('uppercase')}
        </div>
    )
}

export default PasswordCheck;