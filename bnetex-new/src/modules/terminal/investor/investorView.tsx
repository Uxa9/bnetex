import { useState } from 'react';

import TerminalLayout from '../terminalLayout';
import PnlChart from './pnlChart/pnlChart';
import RoeChart from './roeChart/roeChart';

const InvestorView = () => {

    const [values, setValues] = useState<number[]>([
        Math.floor(Math.random() * (1000 - 100) + 100),
        Math.floor(Math.random() * (1000 - 100) + 100),
        Math.floor(Math.random() * (1000 - 100) + 100),
        Math.floor(Math.random() * (1000 - 100) + 100),
    ]);

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
            <PnlChart 
                dates={['0','1','2','3']}
                values={values}
            />
            <RoeChart
                dates={['0','1','2','3']}
                values={values}
            />
        </>
    )
}

export default InvestorView;