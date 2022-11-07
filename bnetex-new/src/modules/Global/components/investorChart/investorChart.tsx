import { useTheme } from 'lib/hooks/useTheme';
import { Switch, ToolTip } from 'lib/ui-kit';
import { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import styles from './investorChart.module.scss';

interface InvestorChartProps {
    dates: string[],
    values: number[],
    type: 'ROE' | 'PNL',
}

const ALGORYTHM_COMISSION = 0.5;

const InvestorChart = ({dates, values, type}: InvestorChartProps) => {
    
    const { theme } = useTheme();

    const [withComission, setWithCommision] = useState<boolean>(false);
    const toggleComission = () => setWithCommision(prevState => !prevState);

    const chartValues = useMemo(() => 
        withComission ? values.map(value => value * ALGORYTHM_COMISSION) : values
    , [ withComission, values ]);

    const options : any = {
        chart: {
            zoom: { enabled : true },
            selection: { enabled : false },
            toolbar: { show : true },
            background: 'transparent',
        },
        xaxis: {
            labels: {
                show: false,
            },
        },
        dataLabels: { enabled : false },
        theme: {
            mode: theme, 
            monochrome: {
                enabled: false,
            },
        },
        stroke: { 
            width: 1,
            colors: ['#9043CA'], 
        },
        colors: ['#9043CA', '#F1DEFF', '#F9F1FF00'],
        labels: dates,
    };

    const series : any = {
        name: 'Доход',
        data: chartValues,
    };

    return (
        <div className={styles['investor-chart']}>
            <div className={styles['investor-chart__header']}>
                {
                    type === 'PNL' ? 
                        <ToolTip
                            title={'PnL'}
                            infoText={'PNL (Profit and Loss) – это величина, которая показывает разницу между прибылью и убытками в трейдинге.'}
                        /> :
                        <ToolTip
                            title={'ROE'}
                            infoText={'ROE — это та процентная ставка, под которую в компании работают средства акционеров. Этот показатель является ключевым для определения эффективности деятельности компании. Например, показатель ROE = 20% говорит о том, что каждый рубль, вложенный в компанию, ежегодно приносит 20 копеек прибыли.'}
                        />
                }
                <div className={styles['comission-block']}>
                    <ToolTip
                        title={'С комиссией'}
                        infoText={'Комиссия за сделки — этот платеж взимается с клиента в виде процента от прибыли со всех торговых операции. Ставка комиссии - 50% от прибыли (PNL/ROE).'}
                    />
                    <Switch 
                        checked={withComission}
                        onChange={toggleComission}
                        justify={'gap'}
                    />
                </div>
            </div>
            <div
                className={styles['investor-chart__wrapper']}
            >
                <Chart
                    type={'area'}
                    height={'100%'}
                    width={'100%'}
                    options={options}
                    series={[series]}
                />
            </div>
        </div>
    );
};

export default InvestorChart;
