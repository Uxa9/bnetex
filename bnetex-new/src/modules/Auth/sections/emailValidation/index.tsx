import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useModal } from 'lib/hooks/useModal';
import { useToast } from 'lib/hooks/useToast';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button, Input } from 'lib/ui-kit';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { requiredValidation } from 'lib/utils/hookFormValidation';
import NoEmailModal from 'modules/Auth/components/NoEmailModal/noEmailModal';
import ResendCodeAction from 'modules/Auth/components/ResendCodeAction/resendCodeAction';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import { confirmEmail } from 'store/action-creators/auth';
import FormCard from '../../components/FormCard/formCard';

interface EmailValidationData {
    activationCode: string,
}

const EmailValidation = () => {

    const { bakeToast } = useToast();
    const { goToState } = useGoToState();
    const { open: OpenNoEmailModal } = useModal(NoEmailModal);
    const { AUTH, LOGIN, REGISTRATION_FINALIZE } = AppLinksEnum;
    const dispatch = useAppDispatch();
    const { loading } = useTypedSelector(state => state.auth);

    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        const email = getUserInfo().email;
        email ? setUserEmail(email) : goToState(`${AUTH}/${LOGIN}`);
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
        dispatch(confirmEmail(userEmail, data.activationCode))
            .then(() => {
                goToState(`${AUTH}/${REGISTRATION_FINALIZE}`);
            })
            .catch((error) => bakeToast.error(error.response?.data.message));
    };

    return(
        <>
            <FormCard 
                title={'Верификация email'}
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
                        isLoading={loading}
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
