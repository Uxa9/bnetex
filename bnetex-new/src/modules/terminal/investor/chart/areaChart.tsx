import { useEffect, FC } from 'react';
import classNames from 'classnames';

import Chart from 'react-apexcharts';

import styles from './areaChart.module.scss';

interface ChartProps {
    dates  : string[],
    values : number[],
    title  : string
}

const AreaChart:FC<ChartProps> = props => {

    const options : any = {
        chart : {
            zoom      : { enabled : false },
            selection : { enabled : false },
        },
        dataLabels : { enabled : false },
        // title : { text: 'Chart' },
        stroke : { 
            width : 1,
            colors : ['#9043CA'] 
        },
        colors : ['#9043CA', '#F1DEFF', '#F9F1FF00'],
        labels : props.dates || [],
    };

    const series : any = {
        name : 'Доход',
        data : props.values || []
    };

    useEffect(() => {
        options.labels     = props.dates;
        series.data        = props.values;
        // options.title.text = props.title;
    }, []);

    useEffect(() => {
        options.labels = props.dates;
    }, [props.dates]);

    useEffect(() => {
        series.data    = props.values;
    }, [props.values]);

    return (
        <div
            className={classNames("block", styles['chart-container'])}
        >
            <span>
                {props.title}
            </span>
            <Chart
                type='area'
                height='90%'
                options={options}
                series={[series]}
            />
        </div>
    )
}

export default AreaChart;