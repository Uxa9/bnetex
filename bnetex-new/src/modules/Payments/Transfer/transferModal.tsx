import { Modal } from 'components/ModalSpawn/Modal/modal';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Button, Input } from 'lib/ui-kit';
import styles from './transferModal.module.scss';

const TransferModal = (props: BaseModalProps) => {

    return(
        <Modal
            title={'Перевод средств'}
            onClose={props.onClose}
            className={styles['transfer-modal']}
        >
            <Input
                label={'Сумма перевода'}
                helperText={'Баланс кошелька 32 USDT'}
            />
            <Button 
                buttonStyle={'primary'}
                text={'Подтвердить'}
                fillContainer
            />
        </Modal>
    );
};

export default TransferModal;
