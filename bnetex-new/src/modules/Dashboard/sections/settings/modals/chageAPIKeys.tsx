import styles from './modals.module.scss';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Button, Input } from 'lib/ui-kit';
import FormCard from 'modules/Auth/components/FormCard/formCard';
import { newPasswordValidation } from 'lib/utils/hookFormValidation';
import { changeApiKey, changeUserPassword } from 'services/user';
import { useToast } from 'lib/hooks/useToast';
import { useForm } from 'react-hook-form';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';

interface PasswordFormData {
    api_key: string,
    api_secret: string
}

const ChangeApiKey = (props: BaseModalProps) => {

    const { onClose } = props;
    const { isLoading } = usePromiseWithLoading();
    const { bakeToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<PasswordFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: PasswordFormData) => {        
        changeApiKey(data.api_key, data.api_secret)
            .then(() => {
                bakeToast.success('Ключ изменен!');
                onClose();
            })
            .catch((error) => {
                bakeToast.error(error.response?.data.message);
            });
    };

    return (
        <Modal
            title={'Смена API ключа'}
            onClose={onClose}
            className={'text'}
        >
            <FormCard
                className={styles['form-card']}
                title={''}
                subtitle={'Введите API ключ и секретную строку'}
                onSubmit={handleSubmit(onSubmit)}
                inputs={[
                    <Input
                        label={'API ключ'}
                        inputControl={register('api_key')}
                        key={'api_key'}
                    />,
                    <Input
                        label={'API secret'}
                        inputControl={register('api_secret')}
                        key={'api_secret'}
                    />,
                ]}
                button={
                    <Button
                        text={'Подтвердить'}
                        type={'submit'}
                        disabled={!isValid}
                        isLoading={isLoading}
                    />
                }
            />
        </Modal>
    );
};

export default ChangeApiKey;
