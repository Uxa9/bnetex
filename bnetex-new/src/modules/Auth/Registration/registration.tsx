import { Eye, EyeSlash } from 'assets/images/icons';
import { AxiosError, AxiosResponse } from 'axios';
import useApi from 'lib/hooks/useApi';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FormCard from '../FormCard/formCard';
import styles from './registration.module.scss';

interface RegistrationFormData {
    email: string,
    password: string
}

const Registration = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const { bakeToast } = useToast();
    // const navigate = useNavigate();

    const [api ] = useApi();

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
                })
                .catch((error: AxiosError<any>) => {
                    bakeToast.error(error.response?.data.message);
                });
        }

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
                        inputControl={register('password', requiredValidation)}
                        errorText={errors.password?.message}
                        key={'password'}
                        type={isPasswordVisible ? 'text' : 'password'}
                        autoComplete={'new-password'}
                        postfix={isPasswordVisible ? 
                            <EyeSlash
                                onClick={() => setIsPasswordVisible(false)}
                                className={styles['password-postfix']}
                            /> : 
                            <Eye 
                                onClick={() => setIsPasswordVisible(true)} 
                                className={styles['password-postfix']}
                            />}
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
