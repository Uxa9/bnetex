import styles from './futuresWallet.module.scss';
import classNames from 'classnames';

// toDo
// сделать нормальные кнопки

const FuturesWallet = () => {

    return(
        <div className={styles.wallet}>
            <div className={styles['wallet-header']}>
                <h3>Фьючерсный кошелек</h3>
                <div className={styles['wallet-header__btns']}>
                    <p>Перевод</p>
                    <p>Купить криптовалюту</p>
                </div>
            </div>

            <div className={classNames(styles['wallet-card'], 'card')}>

                <div className={classNames(styles['balance-item'], styles['balance-item--big'])}>
                    <p className={styles['balance-item__label']}>
                        Баланс (USD-M)
                    </p>
                    <div className={styles['balance-item--big__values']}>
                        <p className={styles['balance-item__value']}>
                        41.4231 
                        </p>
                        <p className={styles['balance-item__RUB']}>
                        3 354.31
                        </p>
                    </div>

                </div>

                <div className={styles['wallet-items']}>
                    <div className={styles['balance-item']}>
                        <p className={styles['balance-item__label']}>
                            Баланс маржи
                        </p>
                        <p className={styles['balance-item__value']}>
                            41.4231 
                        </p>
                        <p className={styles['balance-item__RUB']}>
                            3 354.31
                        </p>
                    </div>
                    <div className={styles['balance-item']}>
                        <p className={styles['balance-item__label']}>
                            Баланс кошелька
                        </p>
                        <p className={styles['balance-item__value']}>
                            41.4231 
                        </p>
                        <p className={styles['balance-item__RUB']}>
                            3 354.31
                        </p>
                    </div>
                    <div className={styles['balance-item']}>
                        <p className={styles['balance-item__label']}>
                            Нереализованный PnL
                        </p>
                        <p className={styles['balance-item__value']}>
                            41.4231 
                        </p>
                        <p className={styles['balance-item__RUB']}>
                            3 354.31
                        </p>
                    </div>
                    <div className={styles['balance-item']}>
                        <p className={styles['balance-item__label']}>
                            Всего занято
                        </p>
                        <p className={styles['balance-item__value']}>
                            41.4231 
                        </p>
                        <p className={styles['balance-item__RUB']}>
                            3 354.31
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuturesWallet;
