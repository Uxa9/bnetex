import { useState } from 'react';

import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';

import TradeView   from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import AreaChart from './chart/areaChart';

import styles from './investorView.module.scss';

const InvestorView = () => {

    const [value, setValue] = useState("trade");

    return (
        <div
            className={styles['investor-view-wrapper']}
        >
            <div
                className='block'
            >
                <ToggleButtonGroup 
                    title={""} 
                    name={""} 
                    onChange={(value) => {
                        setValue(value);
                    }}
                    value={value}
                >
                    <ToggleButton 
                        text={"Торговля"} 
                        value={"trade"} 
                    />
                    <ToggleButton 
                        text={"История"} 
                        value={"history"} 
                    />
                </ToggleButtonGroup>
                
                {value == 'trade' && <TradeView />}
                {value == 'history' && <HistoryView />}
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
    )
}

export default InvestorView;