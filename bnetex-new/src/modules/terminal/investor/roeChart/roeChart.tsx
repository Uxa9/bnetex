import { useEffect, FC } from 'react';

import Chart from 'react-apexcharts';

interface ChartProps {
    dates  : string[],
    values : number[] 
}

interface Series {
    name : string,
    data : number[]
}

const RoeChart:FC<ChartProps> = props => {

    const options : any = {
        chart : {
            zoom      : { enabled : false },
            selection : { enabled : false },
        },
        dataLabels : { enabled : false },
        title : { text: 'RoE' },
        stroke : { 
            width : 1,
            colors : ['#9043CA'] 
        },
        colors : ['#9043CA', '#F1DEFF', '#F9F1FF00'],
        labels : props.dates || [],
    };

    const series : Series = {
        name : 'Доход',
        data : props.values || []
    };

    useEffect(() => {
        options.labels = props.dates;
        series.data    = props.values;
    }, []);

    useEffect(() => {
        options.labels = props.dates;
    }, [props.dates]);

    useEffect(() => {
        series.data    = props.values;
    }, [props.values]);

    return (
        <div
            className="block"
        >
            <Chart
                type="area"
                options={options}
                series={[series]}
            />
        </div>
    )
}

export default RoeChart;