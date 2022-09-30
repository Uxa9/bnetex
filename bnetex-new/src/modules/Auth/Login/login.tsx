import { Eye, EyeSlash } from 'assets/images/icons';
import { useGoToState } from 'lib/hooks/useGoToState';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import login from 'services/login';
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
    const {goToState} = useGoToState();

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


    // toDo сделать нормальные запросы на сервер
    // придумать как можно чисто делать установку стейта isAuth!!!

    const onSubmit = async (data: LoginFormData) => {
        promiseWithLoading(login(data.email, data.password))
            .then(() => goToState(AppLinksEnum.DASHBOARD))
            .catch((error) => bakeToast.error(error.response?.data.message));
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
                    <div className={styles.actions}>
                        <Button 
                            text='Забыли пароль?'
                            buttonStyle={'thin'}
                            type={'button'}
                            key={'forgot-password'}
                        />
                        <div 
                            className={styles['register-action']}
                            key={'register-action'}
                        >
                            <span className='body-1'>Нет аккаунта?</span>
                            <Button 
                                text={'Зарегистрироваться'}
                                buttonStyle={'thin'}
                                type={'button'}
                                onClick={() => goToState(`${AppLinksEnum.AUTH}/${AppLinksEnum.REGISTRATION}`)}
                            />
                        </div>
                    </div>
                }
            />
        </>
    );
};

export default Login;
