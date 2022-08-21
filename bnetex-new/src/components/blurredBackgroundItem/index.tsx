import styles from './blur.module.scss';
import classNames from 'classnames';
import { FC } from 'react';


interface BlurProps{
    type: 'circle' | 'ellipse',
    color: 'purple' | 'blue' | 'red' | 'green',
    top: string,
    left: string,
    rotate?:number
}

const Blur:FC<BlurProps> = props => {

    const blurStyle = {
        top: props.top,
        left: props.left,
        transform: `rotate(${props.rotate ?? 0}deg)`,
    };

    return(
        <div 
            style={blurStyle}
            className=
                {
                    classNames(styles['blur'], 
                        styles[`blur_${props.type}`],
                        styles[`blur_color--${props.color}`])
                }
        ></div>
    );
};

export default Blur;
