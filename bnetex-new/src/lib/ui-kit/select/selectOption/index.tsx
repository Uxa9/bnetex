import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';
import styles from './selectOption.module.scss';

export interface SelectOptionProps<T> extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    value: T;
    option: JSX.Element | string;
}

function SelectOption<T> ({ option, onClick }: SelectOptionProps<T>) {

    const evaluateOption = () => {
        return typeof option === 'string' ? 
            <p 
                className={classNames(styles['text-option'], 'text')}
            >
                { option }
            </p> :
            { option };
    };

    return(
        <button 
            className={styles['container']}
            onClick={onClick}
        >
            { evaluateOption() }
        </button>
    );
};

export default SelectOption;
