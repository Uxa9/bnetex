import styles from './startAlgorythm.module.scss';
import clsx from 'clsx';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Button } from 'lib/ui-kit';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';

interface StartAlgorythmModalProps{ 
    amountToSend: number;
    onSubmit: (value: any) => void; //Костыль, нужно отправлять запрос на бек, получать статус и изменять его в useEffect
}

const StartAlgorythmModal = (props: StartAlgorythmModalProps & BaseModalProps) => {

    const { amountToSend, onSubmit, onClose } = props;

    const handleSubmit = () => {
        onSubmit(amountToSend);
        onClose();
    };

    return(
        <Modal
            title={'Начало работы с алгоритмом'}
            onClose={onClose}
            className={clsx(
                styles['content'],
                'text'
            )}
        >
            <div className={styles['disclaimer']}>
                <p>
                    Вы собираетесь передать в управление инвестиционному алгоритму <strong>{amountToSend} USDT</strong>.
                </p>
                <p>
                    Вы можете остановить работу алгоритма в любой момент воспользовавшись кнопкой “Остановить работу”.
                </p>
                <p>
                    При остановке работы алгоритма все открытые им позиции будут закрыты по рыночной цене. Будьте осторожны, и обращайте внимание на текущий PNL вашего кошелька инвестора.
                </p>
            </div>
            <Button 
                text={'Подтвердить'}
                onClick={handleSubmit}
                fillContainer
            />
        </Modal>
    );
};

export default StartAlgorythmModal;
