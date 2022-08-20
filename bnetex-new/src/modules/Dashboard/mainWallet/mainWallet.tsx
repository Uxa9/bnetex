import styles from './mainWallet.module.scss';
import classNames from 'classnames';
import { Button } from 'lib/ui-kit';

// toDo
// сделать нормальные кнопки

const MainWallet = () => {

    return(
        <div className={styles.wallet}>
            <div className={styles['wallet-header']}>
                <h3>Фьючерсный кошелек</h3>
                <div className={styles['btns']}>
                    <Button
                        text='Ввод'
                    />
                    <Button
                        className={styles['outlined-btn']}
                        text='Вывод'
                    />
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

                <div className={styles['balance-item']}>
                    <p className={styles['balance-item__label']}>
                            Спотовый баланс
                    </p>
                    <p className={styles['balance-item__value']}>
                            0.0040543
                    </p>
                    <p className={styles['balance-item__RUB']}>
                            24 354.31
                    </p>
                </div>
                <div className={styles['balance-item']}>
                    <p className={styles['balance-item__label']}>
                            Фиатный баланс
                    </p>
                    <p className={styles['balance-item__value']}>
                            0.0040543
                    </p>
                    <p className={styles['balance-item__RUB']}>
                            24 354.31
                    </p>
                </div>
            </div>

            <div className={classNames(styles['assets'], 'card')}>
                <p className={styles['assets__title']}>
                    Активы
                </p>

                <table>
                    <thead>
                        <th>Криптовалюта</th>
                        <th>Всего</th>
                        <th>Доступно</th>
                        <th>В ордере</th>
                        <th>Стоимость в BTC</th>
                        <th>Действия</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>USDT</td>
                            <td>124.54500314</td>
                            <td>124.54500314</td>
                            <td>0.00000000</td>
                            <td>0.00042314 <span className={styles.RUB}>24 354.31</span></td>
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
