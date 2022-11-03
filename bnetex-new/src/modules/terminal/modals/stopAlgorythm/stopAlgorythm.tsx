import styles from './stopAlgorythm.module.scss';
import classNames from 'classnames';
import { Modal } from 'components/ModalSpawn/Modal/modal';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Button } from 'lib/ui-kit';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';

interface StopAlgorythmModalProps { 
    onSubmit: (value: boolean) => void; //Костыль, нужно отправлять запрос на бек, получать статус и изменять его в useEffect
}

const StopAlgorythmModal = (props: StopAlgorythmModalProps & BaseModalProps) => {

    const { onSubmit, onClose } = props;

    const handleSubmit = () => {
        onSubmit(false);
        onClose();
    };

    // toDo: fetch from backend
    const currentPositionSum: number = 100;
    const closingPNL: number = -2.33;
    const totalPNL: number = 3.12; 
    const totalROE: number = 4.56;
    const totalDays: number = 2; //toDo: parse into dd:hh:mm + nouns

    return(
        <Modal
            title={'Завершение работы с алгоритмом'}
            onClose={onClose}
            className={classNames(
                styles['content'],
                'text'
            )}
        >
            <div className={styles['disclaimer']}>
                <p>
                    Вы собираетесь остановить работу инвестиционного алгоритма и закрыть все текущие позиции:
                </p>
                <div className={styles['disclaimer__data']}>
                    <p>
                        Сумма позиций: <strong>{currentPositionSum} USDT</strong>
                    </p>
                    <p>
                        <span>Расчетный PNL: </span>
                        <SignedNumber 
                            value={closingPNL} 
                            postfix={'USDT'}
                        />
                    </p>
                </div>
                <p>
                    Результаты <strong>{totalDays}</strong> дней работы алгоритма:
                </p>
                <div className={styles['disclaimer__data']}>
                    <p>
                        <span>PNL: </span>
                        <SignedNumber
                            value={totalPNL}  
                            postfix={'USDT'}
                        />
                    </p>
                    <p>
                        <span>ROE: </span>
                        <SignedNumber 
                            value={totalROE} 
                            postfix={'%'}
                        />
                    </p>
                </div>
            </div>
            <Button 
                text={'Подтвердить'}
                onClick={handleSubmit}
                fillContainer
            />
        </Modal>
    );
};

export default StopAlgorythmModal;
