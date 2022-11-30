import { useState, useEffect, FC } from 'react';
import styles from './marginPopUp.module.scss';
import PopUp from 'lib/ui-kit/popUp';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';
import clsx from 'clsx';

interface MarginPopUpProps {
    type: 'cross' | 'isolated',
    hasOrder: boolean,
    onClose: () => void,
    acceptFunc: (value: any) => void
}

const MarginPopUp: FC<MarginPopUpProps> = props => {

    const { onClose } = props;

    const [switcher, setSwitcher] = useState('cross');

    useEffect(() => {
        setSwitcher(props.type);
    }, []);

    return (
        <Modal
            title={"BTC/USDT бессрочный \nрежим маржи"}
            onClose={onClose}
            className={clsx(
                styles['content'],
                'text'
            )}
        >
            <div
                className='margin-selector'
            >
                <div
                    className={`${switcher === styles['cross'] && styles['active']}`}
                    onClick={() => setSwitcher('cross')}
                >
                    {"Перекрестная"}
                </div>
                <div
                    className={`${switcher === styles['isolated'] && styles['active']}`}
                    onClick={() => setSwitcher('isolated')}
                >
                    {"Изолированная"}
                </div>
            </div>
            <div
                className={styles['margin-text']}
            >
                <p>
                    {"Переключение режима маржи применяется только к выбранному контракту."}
                </p>
                <p>
                    <b>
                        {"Режим кросс-маржи:"}
                    </b>
                    {"все кросс-позиции одного и того же маржинального актива имеют одинаковый баланс кросс-маржинального актива. В случае ликвидации весь баланс маржи ваших активов вместе с любыми оставшимися открытыми позициями актива может быть утрачен."}
                </p>
                <p>
                    <b>
                        {"Режим изолированной маржи:"}
                    </b>
                    {"маржа, установленная по позиции, ограничена определенной суммой. Если маржа опускается ниже уровня поддерживающей маржи, то позиция ликвидируется. В этом режиме вы можете добавлять и удалять маржу."}
                </p>
            </div>
        </Modal>
    );
};

export default MarginPopUp;
