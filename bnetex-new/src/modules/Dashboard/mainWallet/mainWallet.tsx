import styles from './mainWallet.module.scss';
import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';

// toDo
// сделать нормальные кнопки

const MainWallet = () => {
    
    const { goToState } = useGoToState();
    // const [balance, setBalance] = useState(0);

    // useEffect(() => {
    //     setBalance(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.mainWallet || 0.00);
    // }, []);

    const balance = JSON.parse(localStorage.getItem('mainWallet') || '{}') || 0.00;

    return(
        <div className={styles.wallet}>
            <div className={styles['wallet-header']}>
                <h3>Основной кошелек</h3>
                <div className={styles['btns']}>
                    <Button
                        text='Ввод'
                        onClick={() => goToState(AppLinksEnum.DEPOSIT)}
                    />
                    <Button
                        text='Вывод'
                        onClick={() => goToState(AppLinksEnum.WITHDRAW)}
                    />
                    <Button
                        text='Перевод'
                        buttonStyle={'thin'}
                        onClick={() => goToState(AppLinksEnum.TRANSFER)}
                    />
                </div>
            </div>

            <div className={classNames(styles['wallet-card'], 'card')}>
                <div className={styles['balance-item']}>
                    <p 
                        className={classNames(
                            styles['balance-item__label'],
                            'caption',
                        )}
                    >
                            Баланс
                    </p>
                    <h6 className={styles['balance-item__value']}>
                        {balance}
                    </h6>
                </div>
            </div>
        </div>
    );
};

export default MainWallet;
