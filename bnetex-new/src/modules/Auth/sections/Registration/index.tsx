import {  Eye, EyeSlash } from 'assets/images/icons';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useToast } from 'lib/hooks/useToast';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, newPasswordValidation } from 'lib/utils/hookFormValidation';
import PasswordValidator from 'modules/Auth/components/PasswordValidator/passwordValidator';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import { signup } from 'store/action-creators/auth';
import FormCard from '../../components/FormCard/formCard';
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
    const dispatch = useAppDispatch();
    const { loading } = useTypedSelector(state => state.auth);
    const { goToState } = useGoToState();
    const { AUTH, VERIFY_EMAIL } = AppLinksEnum;
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<RegistrationFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: RegistrationFormData) => {
        dispatch(signup(data.email, data.password))
            .then(() => {
                goToState(`${AUTH}/${VERIFY_EMAIL}`);
            })
            .catch((error: Error) => bakeToast.error(error.message));
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
                step={'1/2'}
                inputs={[
                    <Input
                        label={'Email'}
                        inputControl={register('email', emailValidation)}
                        errorText={errors.email?.message}
                        key={'email'}
                        autoComplete={'email'}
                    />,
                    // toDo: вынести эту хуйню в отдельный компонент
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
                            <>
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
                            </>
                        }
                    />,
                ]} 
                button={
                    <Button 
                        text={'Далее'}
                        type={'submit'}
                        disabled={!isValid}
                        isLoading={loading}
                    />
                }
            />
        </>
    );
};

export default Registration;
