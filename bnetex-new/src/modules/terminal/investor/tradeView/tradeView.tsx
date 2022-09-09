import { Button, NumInput } from 'lib/ui-kit';
import styles from '../investorView.module.scss';

const TradeView = () => {

    return (
        <>
            <div
                className={styles['investor-balance']}
            >
                <p
                    className={styles['header']}
                >
                    Баланс
                </p>
                <p
                    className={styles['investor-balance-amount']}
                >
                    21 567.34 USDT 
                </p>
            </div>
            <div
                className={styles['investor-invest']}
            >
                <p
                    className={styles['header']}
                >
                    Выберите объем инвестиций (USDT)
                </p>
                <NumInput 
                    prefix="10 000"
                    suffix="Весь баланс"
                />
            </div>
            <div
                className={styles['button-wrapper']}
            >
                <Button
                    buttonStyle="accept"
                    text="Начать работу"
                />
            </div>
        </>
    );
};

export default TradeView;
