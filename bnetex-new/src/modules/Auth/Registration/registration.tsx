import {  Eye, EyeSlash } from 'assets/images/icons';
import { AxiosError, AxiosResponse } from 'axios';
import useApi from 'lib/hooks/useApi';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, newPasswordValidation } from 'lib/utils/hookFormValidation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormCard from '../FormCard/formCard';
import PasswordValidator from '../PasswordValidator/passwordValidator';
import styles from './registration.module.scss';

interface RegistrationFormData {
    email: string,
    password: string
}

const Registration = () => {

    // toDo - вынести инпут пароля с валидацией и всеми стейтами в отд. компонент
    const [ isPasswordVisible, setIsPasswordVisible ] = useState<boolean>(false);
    const [ passwordValue, setPasswordValue ] = useState<string>('');
    const [ isValidatorVisible, setIsValidatorVisible ] = useState<boolean>(false);
    const { bakeToast } = useToast();
    const [ api ] = useApi();

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isValid,
        },
    } = useForm<RegistrationFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });


    // toDo сделать нормальные запросы на сервер
    // придумать как можно чисто делать установку стейта isAuth

    const onSubmit = async (data: RegistrationFormData) => {
        if (isValid) {
            api.post('/auth/registration', data)
                .then((res: AxiosResponse<any>) => {
                    localStorage.setItem('token', res.data.token);
                    reset();
                })
                .catch((error: AxiosError<any>) => {
                    bakeToast.error(error.response?.data.message);
                });
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.currentTarget.value);
    };

    return(
        <>
            <FormCard 
                title={'Аккаунт'}
                subtitle={'Введите адрес электронной почты и выберите надежный пароль.'}
                onSubmit={handleSubmit(onSubmit)}
                inputs={[
                    <Input
                        label={'Email'}
                        inputControl={register('email', emailValidation)}
                        errorText={errors.email?.message}
                        key={'email'}
                        autoComplete={'new-email'}
                    />,
                    <Input
                        label={'Пароль'}
                        onFocus={() => setIsValidatorVisible(true)}
                        inputControl={register('password',
                            {...newPasswordValidation, 
                                onChange: handlePasswordChange,
                                onBlur: () => setIsValidatorVisible(false),
                            })}
                        errorText={errors.password?.message}
                        key={'password'}
                        type={isPasswordVisible ? 'text' : 'password'}
                        autoComplete={'new-password'}
                        postfix={
                            <div>
                                {
                                    isPasswordVisible ? 
                                        <EyeSlash
                                            onClick={() => setIsPasswordVisible(false)}
                                            className={styles['password-postfix']}
                                        /> : 
                                        <Eye 
                                            onClick={() => setIsPasswordVisible(true)} 
                                            className={styles['password-postfix']}
                                        />
                                }
                                <PasswordValidator 
                                    isVisible={isValidatorVisible}
                                    inputValue={passwordValue}
                                />
                            </div>
                        }
                    />,
                ]} 
                button={
                    <Button 
                        text={'Далее'}
                        type={'submit'}
                        disabled={!isValid}
                    />
                }
            />
        </>
    );
};

export default Registration;
