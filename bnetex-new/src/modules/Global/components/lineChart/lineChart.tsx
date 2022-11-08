import classNames from 'classnames';
import { colorIndexMap } from 'lib/utils/colorIndexMap';
import { useMemo } from 'react';
import styles from './lineChart.module.scss';

export interface LineChartItem {
    value: number;
    name: string;
}

interface LineChartProps {
    values: LineChartItem[];
}   

const LineChart = ({values}: LineChartProps) => {

    const totalVolume = useMemo(() => 
        values.reduce((acc: number, value: LineChartItem ) => {
            return acc + value.value;
        }, 0),
    [ values ]);

    return(
        <div className={styles['line-chart']}>
            <div className={styles['line-chart__chart']}>
                {
                    values.map((value: LineChartItem, index: number) => 
                        <div
                            className={classNames(
                                styles['chart-line'],
                                styles[colorIndexMap('chart-line', index)],
                            )}
                            key={index}
                            style={{width: `${100 * value.value/totalVolume}%`}}
                        />
                    )
                }
            </div>
            <div className={styles['line-chart__names']}>
                {
                    values.map((item: LineChartItem, index: number) => 
                        <div
                            className={classNames(styles['chart-line-item'], 'text')}
                            key={index}
                        >
                            <div className={styles['chart-line-item__name-block']}>
                                <div 
                                    className={classNames(
                                        styles['chart-line-item__color-border'],
                                        styles[colorIndexMap('chart-line-item__color-border', index)],
                                    )} 
                                />
                                <p>{item.name}</p>
                            </div>
                            <div className={styles['chart-line-item__value']}>{item.value}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default LineChart;
