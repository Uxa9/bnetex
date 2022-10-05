import styles from './deposit.module.scss';
import { Angle } from 'assets/images/icons';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import CopyButton from 'lib/ui-kit/copyButton/copyButton';
import classNames from 'classnames';

const Deposit = () => {

    const {navigateBack} = useGoToState();

    const WALLET_ADDRESS = 'TQwckR7VpEsrMFCogvjKhiQ1YJBNi5Qbjm';

    return(
        <div className='wrapper'>
            <div className='container'>
                <button 
                    className={styles['back-action']}
                    onClick={() => navigateBack(AppLinksEnum.HOME)}
                >
                    <Angle />
                    <h5>Ввод криптовалюты</h5>
                </button>
                <div className={classNames(styles.card, 'card')}>
                    <div className={styles.address}>
                        <span className='label-1'>Адрес</span>
                        <div className={styles['address__wrapper']}>
                            <p className={styles['address__code']}>{WALLET_ADDRESS}</p>
                            <CopyButton 
                                textToCopy={WALLET_ADDRESS}
                                successText={'Адрес кошелька успешно скопирован!'}
                            />
                        </div>
                    </div>
                    <ul className={styles.disclaimer}>
                        <li className={styles.disclaimer__item}>
                            Отправляйте на этот адрес только <span>USDT</span>
                        </li>
                        <li className={styles.disclaimer__item}>
                            Отправляйте средства через сеть: <span>Tron (TRC20)</span>
                        </li>
                        <li className={styles.disclaimer__item}>
                            Средства будут зачислены на ваш основной кошелек
                        </li>
                        <li className={styles.disclaimer__item}>
                            Минимальная сумма ввода: 0.01 USDT
                        </li>
                    </ul>
                </div> 
            </div>
        </div>
    );
};

export default Deposit;

