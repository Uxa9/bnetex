import styles from './investorWallet.module.scss';
import classNames from 'classnames';
import AreaChart from 'modules/terminal/investor/chart/areaChart';
import { Button } from 'lib/ui-kit';

// toDo
// сделать нормальные кнопки

const InvestorWallet = () => {

    const values: number[] = [124.55, 431.42, 324.54, 432.43, 543.76];
    
    const balance = JSON.parse(localStorage.getItem('investWallet') || '{}') || 0.00;

    return (
        <div className={styles.wallet}>
            <div className={styles['wallet-header']}>
                <h3>Инвестиционный кошелек</h3>
                <div className={styles['wallet-header__btns']}>
                    <Button 
                        text={'Перевод'}
                        buttonStyle={'thin'}                    
                    />
                </div>
            </div>

            <div className={styles['wallet-data']}>
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

                <AreaChart
                    dates={['0', '1', '2', '3', '4']}
                    values={values}
                    title="PnL"
                />
                <AreaChart
                    dates={['0', '1', '2', '3', '4']}
                    values={values}
                    title="RoE"
                />
            </div>

        </div>
    );
};

export default InvestorWallet;
