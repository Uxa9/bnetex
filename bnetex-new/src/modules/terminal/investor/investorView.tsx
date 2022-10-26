import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import TradeView   from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import AreaChart from './chart/areaChart';
import styles from './investorView.module.scss';
import ToolTip from 'lib/ui-kit/toolTip';
import classNames from 'classnames';

type InvestorViewType = 'trade' | 'history';

const InvestorView = () => {

    const [viewType, setViewType] = useState<InvestorViewType>('trade');

    return (
        <>
            <div className='terminal-side-block'>
                <div
                    className={classNames(styles['investor-view-card'], 'card')}
                >
                    <div className={styles['investor-view-wrapper__header']}>
                        <ToggleButtonGroup 
                            title={''} 
                            name={'investor_terminal'} 
                            onChange={(value: InvestorViewType) => {
                                setViewType(value);
                            }}
                            value={viewType}
                        >
                            <ToggleButton 
                                text={'Торговля'} 
                                value={'trade'} 
                            />
                            <ToggleButton 
                                text={'История'} 
                                value={'history'} 
                            />
                        </ToggleButtonGroup>

                        <ToolTip 
                            title='Что такое история?'
                            infoText='История или история сделок - это исторические записи фактических транзакций по позициям. 
                        В раздел попадают только исполненные ордера.'
                        />
                    </div>
                    {
                        viewType === 'trade' ? 
                            <TradeView /> :
                            <HistoryView />
                    }
                </div>
                <div
                    className={classNames(
                        styles['investor-view-card'],
                        'card'
                    )}
                >
                    <p
                        className={styles['header']}
                    >
                    Доход инвестора
                    </p>
                    <div
                        className={styles['investor-income']}
                    >
                        <span
                            className={styles['investor-income-amount']}
                        >
                        21 643.35 USDT
                        </span>
                        <span
                            className={styles['investor-income-percent']}
                        >
                        +103.45%
                        </span>
                    </div>
                </div>
                <div className={classNames(styles['investor-view-card'], 'card')}>
                    <AreaChart 
                        dates={[]} 
                        values={[]} 
                        title={
                            <ToolTip 
                                title={'PnL'}
                                infoText={'PNL (Profit and Loss) – это величина, которая показывает разницу между прибылью и убытками в трейдинге.'}
                            />
                        }
                    />
                </div>
            </div>
            <div className={classNames(
                'terminal-side-block',
                styles['investor-view-card'],
                'card',
            )}
            >
                <AreaChart 
                    dates={[]} 
                    values={[]} 
                    title={
                        <ToolTip 
                            title={'ROE'}
                            infoText={'ROE — это та процентная ставка, под которую в компании работают средства акционеров. Этот показатель является ключевым для определения эффективности деятельности компании. Например, показатель ROE = 20% говорит о том, что каждый рубль, вложенный в компанию, ежегодно приносит 20 копеек прибыли.'}
                        />
                    }
                />
            </div>
        </>
    );
};

export default InvestorView;
