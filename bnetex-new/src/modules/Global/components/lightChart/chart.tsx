import styles from './chart.module.scss';
import { createChart, IChartApi, ISeriesApi, SingleValueData } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface ChartProps {
    data: SingleValueData[]
}

const Chart = ({data}: ChartProps) => {

    const chartRef = useRef<HTMLDivElement | null>(null);
    const [chartBase, setChartBase] = useState<IChartApi | null>(null);
    const [lineChart, setLineChart] = useState<ISeriesApi<'Area'> | null>(null);

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

        lineChart.setData(data);
    }, [data]);

    useEffect(() => {

        if (!chartRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                console.log(width);
                
                chartBase?.applyOptions({width: width});
            }
        });

        observer.observe(chartRef.current);

        return () => {
            chartRef.current && observer.unobserve(chartRef.current);
        };
    }, [ chartBase ]);

    return(
        <div
            className={styles['chart-container']}
            ref={chartRef}
        />
    );
};

export default Chart;
