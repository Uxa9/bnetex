import classNames from "classnames";
import { FC, InputHTMLAttributes } from "react";

import styles from './icons.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    color?: string,
}

/**
 * 
 * @param props.color - color in string format
 * ( add this color to .scss file before passing this color :) ) 
 * 
 */
const Cross: FC<InputProps> = props => {
    
    const { color = 'red' } = props;
    
    return (
        <div
            className={classNames(styles['cross'], styles[`cross-${color}`])}
        />
    )
}

export default Cross;