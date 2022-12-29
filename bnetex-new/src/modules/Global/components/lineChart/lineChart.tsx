import clsx from 'clsx';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';
import { colorIndexMap } from 'lib/utils/colorIndexMap';
import { useMemo } from 'react';
import styles from './lineChart.module.scss';

export interface LineChartItem {
    value: number;
    name: string;
}

interface LineChartProps {
    values: LineChartItem[];
    valuePostfix?: string;
    loading?: boolean;
}

const LineChart = ({ valuePostfix = '', values, loading }: LineChartProps) => {

    const totalVolume = useMemo(() => {
        return values.reduce((acc: number, item: LineChartItem ) =>
            acc + item.value, 0);
    }, [ values ]);

    return(
        <div className={styles['line-chart']}>
            <div className={styles['line-chart__main']}>
                {
                    loading ?
                        <Skeleton
                            height={'24px'}
                            width={'40%'}
                        /> :
                        <h6>{`${totalVolume} ${valuePostfix}`}</h6>
                }
                {
                    loading
                        ? <Skeleton
                            height={'12px'}
                        />
                        : <div className={styles['line-chart__chart']}>
                            {
                                totalVolume
                                    ? values.map((value: LineChartItem, index: number) =>
                                        <div
                                            className={clsx(
                                                styles['chart-line'],
                                                styles[colorIndexMap('chart-line', index)],
                                            )}
                                            key={index}
                                            style={{width: `${100 * value.value/totalVolume}%`}}
                                        />
                                    )
                                    : <div
                                        className={clsx(styles['chart-line'], styles['chart-line--empty'])}
                                    />
                            }
                        </div>
                }
            </div>
            <div className={styles['line-chart__names']}>
                {
                    values.map((item: LineChartItem, index: number) =>
                        <div
                            className={clsx(styles['chart-line-item'], 'text')}
                            key={index}
                        >
                            <div className={styles['chart-line-item__name-block']}>
                                <div
                                    className={clsx(
                                        styles['chart-line-item__color-border'],
                                        styles[colorIndexMap('chart-line-item__color-border', index)],
                                    )}
                                />
                                <p>{item.name}</p>
                            </div>
                            {
                                loading ?
                                    <Skeleton
                                        height={'18px'}
                                        width={'80px'}
                                    /> :
                                    <div className={styles['chart-line-item__value']}>
                                        {`${item.value} ${valuePostfix}`}
                                    </div>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default LineChart;
