import { Eye, EyeSlash } from 'assets/images/icons';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useToast } from 'lib/hooks/useToast';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import { loginUser } from 'store/action-creators/auth';
import FormCard from '../../components/FormCard/formCard';
import styles from './login.module.scss';

interface LoginFormData {
    email: string,
    password: string
}

const Login = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const { bakeToast } = useToast();
    const { loading } = useTypedSelector(state => state.auth);
    const { goToState } = useGoToState();
    const { AUTH, DASHBOARD, VERIFY_EMAIL, REGISTRATION } = AppLinksEnum;
    const dispatch = useAppDispatch();

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

    const onSubmit = (data: LoginFormData) => {
        dispatch(loginUser(data.email, data.password))
            // .then(() => {
            //     setTimeout(() => goToState(DASHBOARD), 2000);
            //     })
            .then(() => {
                location.assign(`${location.origin}/dashboard`);
            })
            .catch((error: Error) => {
                error.message === 'USER_NOT_ACTIVATED' && 
                    goToState(`${AUTH}/${VERIFY_EMAIL}`);
                bakeToast.error(error.message);
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
                        isLoading={loading}
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
                                onClick={() => goToState(REGISTRATION, null, true)}
                            />
                        </div>
                    </>
                }
            />
        </>
    );
};

export default Login;
