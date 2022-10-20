import { Eye, EyeSlash } from 'assets/images/icons';
import { useActions } from 'lib/hooks/useActionCreators';
import { useGoToState } from 'lib/hooks/useGoToState';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import useAuthActions from 'services/auth';
import FormCard from '../FormCard/formCard';
import styles from './login.module.scss';

interface LoginFormData{
    email: string,
    password: string
}

const Login = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const { bakeToast } = useToast();
    const { isLoading, promiseWithLoading } = usePromiseWithLoading();
    const { goToState } = useGoToState();
    const { loginUser } = useActions();

    const { login } = useAuthActions();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<LoginFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });


    const onSubmit = async (data: LoginFormData) => {
        promiseWithLoading(login(data.email, data.password))
            .then(() => {
                loginUser();
                goToState(AppLinksEnum.DASHBOARD);
            })
            .catch((error) => {
                error.response.data.message === 'USER_NOT_ACTIVATED' && 
                    goToState(`${AppLinksEnum.AUTH}/${AppLinksEnum.VERIFY_EMAIL}`);
                bakeToast.error(error.response?.data.message);
            });
    };


    return(
        <>
            <FormCard 
                title={'Добро пожаловать!'}
                subtitle={'Войдите, чтобы получить доступ к торговле на бирже BNETEX.'}
                onSubmit={handleSubmit(onSubmit)}
                inputs={[
                    <Input
                        label={'Email'}
                        inputControl={register('email', emailValidation)}
                        errorText={errors.email?.message}
                        key={'email'} //Тут костыль, надо бы сделать React.Children.map, но у меня возникли с ним трудности
                        autoComplete={'email'}
                    />,
                    <Input
                        label={'Пароль'}
                        inputControl={register('password', requiredValidation)}
                        errorText={errors.password?.message}
                        key={'password'}
                        type={isPasswordVisible ? 'text' : 'password'}
                        autoComplete={'current-password'}
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
                        text={'Войти'}
                        type={'submit'}
                        disabled={!isValid}
                        isLoading={isLoading}
                    />
                }
                actions={
                    <>
                        {/* <Button 
                            text='Забыли пароль?'
                            buttonStyle={'flat'}
                            type={'button'}
                            key={'forgot-password'}
                            mini
                        /> */} 
                        <div 
                            className={styles['register-action']}
                            key={'register-action'}
                        >
                            <span className='text'>Нет аккаунта?</span>
                            <Button 
                                text={'Зарегистрироваться'}
                                buttonStyle={'flat'}
                                type={'button'}
                                mini
                                onClick={() => goToState(`${AppLinksEnum.AUTH}/${AppLinksEnum.REGISTRATION}`)}
                            />
                        </div>
                    </>
                }
            />
        </>
    );
};

export default Login;
