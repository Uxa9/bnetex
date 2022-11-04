import classNames from 'classnames';
import styles from './changePasswordModal.module.scss';
import { Modal } from 'components/ModalSpawn/Modal/modal';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Button, Input } from 'lib/ui-kit';
import FormCard from 'modules/Auth/components/FormCard/formCard';
import { newPasswordValidation } from 'lib/utils/hookFormValidation';
import { changeUserPassword } from 'services/user';
import { useToast } from 'lib/hooks/useToast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';


interface PasswordFormData {
    newPassword: string,
    prevPassword: string
}

const ChangePasswordModal = (props: BaseModalProps) => {
    
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
        changeUserPassword(data.prevPassword, data.newPassword)
            .then(() => {
                bakeToast.success("Пароль изменен!");
                onClose();
            })
            .catch((error) => {
                bakeToast.error(error.response?.data.message);
            });
    };

    return(
        <Modal
            title={'Смена пароля'}
            onClose={onClose}
            className={'text'}
        >
            <FormCard 
                className={styles['form-card']}
                title={''}
                subtitle={'Подтвердите, что вы являетесь владельцем данного аккаунта, введя текущий пароль, а затем введите новый'}
                onSubmit={handleSubmit(onSubmit)}
                inputs={[
                    <Input
                        label={'Текущий пароль'}
                        inputControl={register('prevPassword', newPasswordValidation)}
                        errorText={errors.prevPassword?.message}
                        key={'prevPassword'}
                    />,
                    <Input
                        label={'Новый пароль'}
                        inputControl={register('newPassword', newPasswordValidation)}
                        errorText={errors.newPassword?.message}
                        key={'newPassword'}
                    />
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

export default ChangePasswordModal;
