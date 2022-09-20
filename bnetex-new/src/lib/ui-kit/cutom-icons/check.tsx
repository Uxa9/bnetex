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
const Check: FC<InputProps> = props => {
    
    const { color = 'green' } = props;
    
    return (
        <div
            className={classNames(styles['check'], styles[`check-${color}`])}
        />
    )
}

export default Check;