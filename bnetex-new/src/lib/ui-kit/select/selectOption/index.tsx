import classNames from 'classnames';
import { ButtonHTMLAttributes, ReactElement } from 'react';
import styles from './selectOption.module.scss';

export interface SelectOptionProps<T> extends Pick<ButtonHTMLAttributes<HTMLDivElement>, 'onClick'> {
    value: T;
    option: ReactElement<any> | string;
}

function SelectOption<T> ({ option, onClick }: SelectOptionProps<T>) {
    return(
        <div 
            className={styles['container']}
            onClick={onClick}
        >
            <div
                className={classNames(styles['text-option'], 'text')}
            >
                { option }
            </div>
        </div>
    );
};

export default SelectOption;
