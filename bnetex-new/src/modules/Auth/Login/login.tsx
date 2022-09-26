import { Eye, EyeSlash } from 'assets/images/icons';
import { useActions } from 'lib/hooks/useActionCreators';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import signin from 'services/signin';
import FormCard from '../FormCard/formCard';
import styles from './login.module.scss';

interface LoginFormData{
    email: string,
    password: string
}

const Login = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const { login } = useActions();
    const { bakeToast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
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
        login(data.email, data.password);
        
        if (isValid) {
            const response = await signin(data);

            if (response?.status === 500) {
                alert('pizdec');
            }
    
            if (response?.status === 201) {
                localStorage.removeItem('email');

                // login(response?.data.token);
                navigate('../../dashboard/wallet/main');
            }
        }

        reset();
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
                    />
                }
                actions={
                    <div className={styles.actions}>
                        <Button 
                            text='Забыли пароль?'
                            buttonStyle={'thin'}
                            type={'button'}
                            key={'forgot-password'}
                            onClick={() => bakeToast({type: 'success', text:'Тут что то приятное'})
                            }
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
                            />
                        </div>
                    </div>
                }
            />
        </>
    );
};

export default Login;
