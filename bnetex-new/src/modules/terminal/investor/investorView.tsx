import { useState } from 'react';

import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';

import TradeView   from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import AreaChart from './chart/areaChart';

import styles from './investorView.module.scss';
import ToolTip from 'lib/ui-kit/toolTip';

const InvestorView = () => {

    type InvestorViewType = 'trade' | 'history';

    const [viewType, setViewType] = useState<InvestorViewType>('trade');

    return (
        <div
            className={styles['investor-view-wrapper']}
        >
            <div
                className='block'
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
                
                {viewType === 'trade' && <TradeView />}
                {viewType === 'history' && <HistoryView />}
            </div>
            <div
                className='block'
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
            <AreaChart 
                dates={[]} 
                values={[]} 
                title={'PNL'}
            />
            <AreaChart 
                dates={[]} 
                values={[]} 
                title={'ROE'}
            />
        </div>
    );
};

export default InvestorView;
