import styles from './chart.module.scss';
import { ChartOptions, ColorType, createChart, DeepPartial, IChartApi, ISeriesApi, SingleValueData } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { Switch, ToolTip } from 'lib/ui-kit';
import { useTheme } from 'lib/hooks/useTheme';
import { evaluateTheme } from 'lib/utils/evaluateAppColors';
import clsx from 'clsx';
import { Spinner } from 'assets/images/icons';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { decodeUserJwt } from 'lib/utils/decodeJwt';

interface ChartProps {
    data: SingleValueData[];
    type: 'ROE' | 'PNL';
    className?: string;
    loading: boolean;
    comissionSwitch?: boolean;
    header?: boolean;
    options?: DeepPartial<ChartOptions>;
}

const ALGORYTHM_COMISSION = 0.5;

//toDo: выделить отдельно chart и отдельно chart с хедером roe/pnl

const Chart = ({
    data, type, className, loading, comissionSwitch = true,
    header = true, options }: ChartProps
) => {

    const chartRef = useRef<HTMLDivElement | null>(null);
    const [chartBase, setChartBase] = useState<IChartApi | null>(null);
    const [lineChart, setLineChart] = useState<ISeriesApi<'Area'> | null>(null);

    const userInfo = decodeUserJwt();

    const [withComission, setWithCommision] = useState<boolean>(false);
    const toggleComission = () => setWithCommision(prevState => !prevState);
    const { theme } = useTheme();

    // Базовое создание графика
    useEffect(() => {
        if (!chartRef.current) return;

        const chart = createChart(chartRef.current, {
            ...options,
            rightPriceScale: {
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.3,
                },
                borderVisible: false,
                ...options?.rightPriceScale,
            },
            timeScale: {
                borderVisible: false,
                ...options?.timeScale,
            },
            crosshair: {
                vertLine: {
                    visible: false,
                },
                horzLine: {
                    visible: false,
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
            lineWidth: 2,
        });

        setLineChart(areaSeries);

    }, [chartRef]);

    // Колоризация
    useEffect(() => {
        if (!chartRef.current) return;

        const colors = evaluateTheme();

        chartBase?.applyOptions({
            layout: {
                textColor: colors.grayscale[11],
                background: {type: ColorType.Solid, color: '#00000000'},
            },
        });

        lineChart?.applyOptions({
            lineColor: `${colors.accent.accent[3]}`,
            topColor: `${colors.accent.accent[3]}50`,
            bottomColor: `${colors.accent.accent[3]}00`,
        });
    }, [ chartBase, lineChart, theme ]);

    // Вкл/выкл. комиссии
    useEffect(() => {
        if (!lineChart) return;

        lineChart.setData(withComission ?
            data.map(item => {return{...item, value: item.value * ALGORYTHM_COMISSION};}) :
            data);

        chartBase?.timeScale().fitContent();
    }, [ data, withComission, lineChart ]);

    // Ресайз
    useEffect(() => {
        if (!chartRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;

                chartBase?.applyOptions({width: width});
                chartBase?.timeScale().fitContent();
            }
        });

        observer.observe(chartRef.current);

        return () => {
            chartRef.current && observer.unobserve(chartRef.current);
        };
    }, [ chartBase ]);

    return(
        <div className={clsx(styles['container'], 'card', className)}>
            {
                header &&
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
                    {
                        !!data.length && !loading && comissionSwitch &&
                    <div className={styles['comission-block']}>
                        <ToolTip
                            title={'С комиссией'}
                            infoText={`Комиссия за сделки — этот платеж взимается с клиента в виде процента от прибыли со всех торговых операции. Ставка комиссии - ${userInfo.roles[0].investPercent || 50}% от прибыли (PNL/ROE).`}
                        />
                        <Switch
                            checked={withComission}
                            onChange={toggleComission}
                            justify={'gap'}
                        />
                    </div>
                    }
                </div>
            }
            <div
                className={styles['wrapper']}
                ref={chartRef}
            >
                {
                    !data.length && !loading &&
                        <p className={clsx(styles['empty'], 'text')}>
                            Данные о вашем {type} отстутствуют. Начните работу с алгоритмом или посмотрите
                            историю работы алгоритма.
                        </p>
                }
                {
                    loading &&
                    <Spinner
                        className={styles['spinner']}
                    />
                }
            </div>
        </div>
    );
};

export default Chart;
