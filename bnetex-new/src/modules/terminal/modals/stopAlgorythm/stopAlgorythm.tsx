import styles from './stopAlgorythm.module.scss';
import clsx from 'clsx';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Button } from 'lib/ui-kit';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';
import { useEffect, useState } from 'react';
import { getInvestInfo } from 'services/user';

interface StopAlgorythmModalProps { 
    onSubmit: (value: boolean) => void; //Костыль, нужно отправлять запрос на бек, получать статус и изменять его в useEffect
}

interface CloseData {
    currentPositionSum: number,
    closingPNL: number,
    totalPNL: number,
    totalROE: number,
    totalDays: number
}

const StopAlgorythmModal = (props: StopAlgorythmModalProps & BaseModalProps) => {

    const { onSubmit, onClose } = props;
    const [data, setData] = useState<CloseData>({
        currentPositionSum : 0,
        closingPNL : 0,
        totalPNL : 0,
        totalROE : 0,
        totalDays : 0,
    });

    const handleSubmit = () => {
        onSubmit(false);
        onClose();
    };

    useEffect(() => {
        getInvestInfo()
            .then(res => {
                setData({
                    currentPositionSum : res.data.balance,
                    closingPNL : res.data.pnl,
                    totalPNL : res.data.pnl,
                    totalROE : res.data.roe,
                    totalDays : Number(((new Date().getTime() - new Date(res.data.startSessionTime).getTime()) / 1000 / 60 / 60).toFixed(2)),
                })
            });
    }, [])

    // toDo: fetch from backend
    // const currentPositionSum: number = 100;
    // const closingPNL: number = -2.33;
    // const totalPNL: number = 3.12; 
    // const totalROE: number = 4.56;
    // const totalDays: number = 2; //toDo: parse into dd:hh:mm + nouns

    return(
        <Modal
            title={'Завершение работы с алгоритмом'}
            onClose={onClose}
            className={clsx(
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
                        Сумма позиций: <strong>{data.currentPositionSum} USDT</strong>
                    </p>
                    <p>
                        <span>Расчетный PNL: </span>
                        <SignedNumber 
                            value={data.closingPNL} 
                            postfix={'USDT'}
                        />
                    </p>
                </div>
                <p>
                    Результаты <strong>{data.totalDays}</strong> дней работы алгоритма:
                </p>
                <div className={styles['disclaimer__data']}>
                    <p>
                        <span>PNL: </span>
                        <SignedNumber
                            value={data.totalPNL}  
                            postfix={'USDT'}
                        />
                    </p>
                    <p>
                        <span>ROE: </span>
                        <SignedNumber 
                            value={data.totalROE} 
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
