import { useState } from 'react';

import { NumInput, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';

import styles from '../investorView.module.scss';

const HistoryView = () => {

    const [period, setPeriod] = useState("1");

    return (
        <>
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
                />
            </div>
            <div
                className={styles['investor-prediction-period']}
            >
                <p
                    className={styles['header']}
                >
                    Выберите срок инвестиций среди вариантов ниже
                </p>
                <ToggleButtonGroup 
                    title={""} 
                    name={""} 
                    onChange={(value) => {
                        setPeriod(value);
                    }}
                    value={period}
                >
                    <ToggleButton 
                        text={"1 мес."} 
                        value={"1"} 
                    />
                    <ToggleButton 
                        text={"3 мес."} 
                        value={"3"} 
                    />
                    <ToggleButton 
                        text={"6 мес."} 
                        value={"6"} 
                    />
                    <ToggleButton 
                        text={"9 мес."} 
                        value={"9"} 
                    />
                    <ToggleButton 
                        text={"12 мес."} 
                        value={"12"} 
                    />
                </ToggleButtonGroup>
            </div>
        </>
    )
}

export default HistoryView;