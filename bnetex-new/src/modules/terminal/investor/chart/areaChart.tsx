import { useEffect, FC, ReactElement } from 'react';
import classNames from 'classnames';
import Chart from 'react-apexcharts';
import styles from './areaChart.module.scss';
import { ToolTip } from 'lib/ui-kit';

interface ChartProps {
    dates  : string[],
    values : number[],
    title  : string | ReactElement<typeof ToolTip>,
}

const AreaChart:FC<ChartProps> = props => {

    const {dates, values, title} = props;

    const options : any = {
        chart : {
            zoom      : { enabled : false },
            selection : { enabled : false },
            toolbar   : { show : false },
        },
        dataLabels : { enabled : false },
        // title : { text: 'Chart' },
        stroke : { 
            width : 1,
            colors : ['#9043CA'], 
        },
        colors : ['#9043CA', '#F1DEFF', '#F9F1FF00'],
        labels : dates || [],
    };

    const series : any = {
        name : 'Доход',
        data : values || [],
    };

    useEffect(() => {
        options.labels     = dates;
        series.data        = values;
        // options.title.text = props.title;
    }, []);

    useEffect(() => {
        options.labels = dates;
    }, [dates]);

    useEffect(() => {
        series.data    = values;
    }, [values]);

    return (
        <div
            className={styles['chart-container']}
        >
            {
                title
            }
            <Chart
                type='area'
                height='90%'
                width={'100%'}
                options={options}
                series={[series]}
            />
        </div>
    );
};

export default AreaChart;
