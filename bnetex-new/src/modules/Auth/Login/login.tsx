import { Button, Input } from 'lib/ui-kit';
import { emailValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useForm } from 'react-hook-form';
import FormCard from '../FormCard/formCard';

interface LoginFormData{
    email: string,
    password: string
}

const Login = () => {

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

    const onSubmit = (data: LoginFormData) => {
        console.log(data);
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
