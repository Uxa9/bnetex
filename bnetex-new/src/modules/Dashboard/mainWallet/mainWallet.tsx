import styles from './mainWallet.module.scss';
import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';

// toDo
// сделать нормальные кнопки

const MainWallet = () => {
    
    const { goToState } = useGoToState();

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
                    />
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
                    </div>
                </div>
            </div>

            <div className={classNames(styles['assets'], 'card')}>
                <p className={styles['assets__title']}>
                    Активы
                </p>

                <table>
                    <thead>
                        <tr>
                            <th>Криптовалюта</th>
                            <th>Всего</th>
                            <th>Доступно</th>
                            <th>Стоимость в BTC</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>USDT</td>
                            <td>124.54500314</td>
                            <td>124.54500314</td>
                            <td>0.00042314</td>
                            <td className={styles.btns}>
                                <p>Купить</p>
                                <p>Ввод</p> 
                                <p>Вывод</p> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MainWallet;
