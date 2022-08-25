import { useState } from 'react';

import AreaChart from '../chart/areaChart';

const HistoryView = () => {

    const [values, setValues] = useState<number[]>([]);

    return (
        <>
            <div
                onClick={(() => setValues([
                    Math.floor(Math.random() * (1000 - 100) + 100),
                    Math.floor(Math.random() * (1000 - 100) + 100),
                    Math.floor(Math.random() * (1000 - 100) + 100),
                    Math.floor(Math.random() * (1000 - 100) + 100),
                ]))}
            >
                change
            </div>
            <AreaChart 
                dates={['0','1','2','3']}
                values={values}
                title="PnL"
            />
            <AreaChart
                dates={['0','1','2','3']}
                values={values}
                title="RoE"
            />
        </>
    )
}

export default HistoryView;