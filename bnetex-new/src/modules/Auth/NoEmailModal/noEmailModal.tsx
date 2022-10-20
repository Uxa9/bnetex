import classNames from 'classnames';
import { Modal } from 'components/ModalSpawn/Modal/modal';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Button } from 'lib/ui-kit';
import styles from './noEmailModal.module.scss';

const NoEmailModal = (props: {userEmail: string} & BaseModalProps) => {

    const { userEmail, onClose } = props;

    return(
        <Modal
            title={'Не получили письмо?'}
            onClose={onClose}
            className={classNames(
                styles['content'],
                'text'
            )}
        >
            <p
                className={styles['subtitle']}
            >
                Код отправлен на вашу электронную почту. Если вы не получили код, попробуйте:
            </p>
            <ol className={styles['list']}>
                <li> Проверьте папку «спам».</li>
                <li> Проверить, что вы указали верный адрес электронной почты: {userEmail}.</li>
                <li> Подождать несколько минут. Код может прийти не сразу.</li>
            </ol>
            <Button 
                text={'Ок'}
                onClick={onClose}
                fillContainer
            />
        </Modal>
    );
};

export default NoEmailModal;
