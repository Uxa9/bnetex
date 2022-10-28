import { useGoToState } from 'lib/hooks/useGoToState';
import { useModal } from 'lib/hooks/useModal';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { requiredValidation } from 'lib/utils/hookFormValidation';
import NoEmailModal from 'modules/Auth/components/NoEmailModal/noEmailModal';
import ResendCodeAction from 'modules/Auth/components/ResendCodeAction/resendCodeAction';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import useAuthActions from 'services/auth';
import { loginUser } from 'store/action-creators/auth';
import FormCard from '../../components/FormCard/formCard';

interface EmailValidationData {
    activationCode: string,
}

const EmailValidation = () => {

    const { bakeToast } = useToast();
    const { isLoading, promiseWithLoading } = usePromiseWithLoading();
    const { goToState } = useGoToState();
    const { confirmEmail } = useAuthActions();
    const { open: OpenNoEmailModal } = useModal(NoEmailModal);

    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        email ? setUserEmail(email) : goToState(`${AppLinksEnum.AUTH}/${AppLinksEnum.LOGIN}`);;
    }, []);

    useEffect(() => {
        
    }, []);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<EmailValidationData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: EmailValidationData) => {
        promiseWithLoading(confirmEmail(userEmail, data.activationCode))
            .then(() => {
                loginUser();
                goToState(`${AppLinksEnum.AUTH}/${AppLinksEnum.REGISTRATION_FINALIZE}`);
            })
            .catch((error) => bakeToast.error(error.response?.data.message));
    };

    return(
        <>
            <FormCard 
                title={'Верификация email!'}
                subtitle={`Пожалуйста, введите код подтверждения, отправленный на ${userEmail}.`}
                onSubmit={handleSubmit(onSubmit)}
                step={'2/2'}
                inputs={[
                    <Input
                        label={'Код подтверждения'}
                        inputControl={register('activationCode', requiredValidation)}
                        errorText={errors.activationCode?.message}
                        key={'activationCode'} //Тут костыль, надо бы сделать React.Children.map, но у меня возникли с ним трудности
                        autoComplete={'one-time-code'}
                        helperText={
                            <ResendCodeAction userEmail={userEmail} />
                        }
                    />,
                ]} 
                button={
                    <Button 
                        text={'Далее'}
                        type={'submit'}
                        disabled={!isValid}
                        isLoading={isLoading}
                    />
                }
                actions={
                    <Button 
                        text='Не получили код?'
                        buttonStyle={'flat'}
                        type={'button'}
                        key={'did-not-get-code'}
                        mini
                        onClick={() => OpenNoEmailModal({userEmail: userEmail})}
                    />
                }
            />
        </>
    );
};

export default EmailValidation;
