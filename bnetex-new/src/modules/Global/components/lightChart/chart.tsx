import styles from './chart.module.scss';
import { createChart, IChartApi, ISeriesApi, SingleValueData } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { Switch, ToolTip } from 'lib/ui-kit';

interface ChartProps {
    data: SingleValueData[];
    type: 'ROE' | 'PNL';
}

const ALGORYTHM_COMISSION = 0.5;

const Chart = ({ data, type }: ChartProps) => {

    const chartRef = useRef<HTMLDivElement | null>(null);
    const [chartBase, setChartBase] = useState<IChartApi | null>(null);
    const [lineChart, setLineChart] = useState<ISeriesApi<'Area'> | null>(null);

    const [withComission, setWithCommision] = useState<boolean>(false);
    const toggleComission = () => setWithCommision(prevState => !prevState);


    useEffect(() => {
        if (!chartRef.current) return;

        const chart = createChart(chartRef.current, {
            layout: {
                textColor: '#d1d4dc',
                backgroundColor: '#00000000',
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.25,
                },
            },
            crosshair: {
                vertLine: {
                    width: 4,
                    color: 'rgba(224, 227, 235, 0.1)',
                    style: 0,
                },
                horzLine: {
                    visible: false,
                    labelVisible: false,
                },
            },
            grid: {
                vertLines: {
                    color: 'rgba(42, 46, 57, 0)',
                },
                horzLines: {
                    color: 'rgba(42, 46, 57, 0)',
                },
            },
        });

        setChartBase(chart);

        const areaSeries = chart.addAreaSeries({
            topColor: 'rgba(38, 198, 218, 0.56)',
            bottomColor: 'rgba(38, 198, 218, 0)',
            lineColor: 'rgba(38, 198, 218, 1)',
            lineWidth: 2,
        });

        setLineChart(areaSeries);

    }, [chartRef]);

    useEffect(() => {
        if (!lineChart) return;
        lineChart.setData(withComission ? 
            data.map(item => {return{...item, value: item.value * ALGORYTHM_COMISSION};}) :
            data);
    }, [data, withComission]);

    useEffect(() => {

        if (!chartRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                
                chartBase?.applyOptions({width: width});
            }
        });

        observer.observe(chartRef.current);

        return () => {
            chartRef.current && observer.unobserve(chartRef.current);
        };
    }, [ chartBase ]);

    return(
        <div className={styles['container']}>
            <div className={styles['header']}>
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
                className={styles['wrapper']}
                ref={chartRef}
            />
        </div>
    );
};

export default Chart;
