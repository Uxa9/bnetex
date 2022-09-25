import { useActions } from 'lib/hooks/useActionCreators';
import { Button, Input } from 'lib/ui-kit';
import { emailValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import signin from 'services/signin';
import FormCard from '../FormCard/formCard';

interface LoginFormData{
    email: string,
    password: string
}

const Login = () => {

    const navigate = useNavigate();
    const { login } = useActions();

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
        
        if (isValid) {
            const response = await signin(data);

            if (response?.status === 500) {
                alert('pizdec');
            }
    
            if (response?.status === 201) {
                localStorage.removeItem('email');

                login(response?.data.token);
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
                        type={'password'}
                        autoComplete={'current-password'}
                    />,
                ]} 
                button={
                    <Button 
                        text={'Войти'}
                        type={'submit'}
                        disabled={!isValid}
                    />
                }
            />
        </>
    );
};

export default Login;
