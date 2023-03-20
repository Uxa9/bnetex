import clsx from 'clsx';
import { ReactElement, useState, useMemo, SetStateAction, Dispatch  , MouseEvent } from 'react';
import { SelectOptionProps } from '../selectOption';
import styles from './select.module.scss';
import { v4 as uuidV4 } from 'uuid';
import React from 'react';
import { throwError } from 'lib/utils/errorThrower';
import { Angle } from 'assets/images/icons';

interface SelectProps<T> {
    label?: string;
    value: T;
    onChange: Dispatch<SetStateAction<T>>;
    children: ReactElement<SelectOptionProps<T>>[];
}

// toDo: Сделать возможность закрыть селект по клику по нему.

function Select<T> ({label, value, onChange, children}: SelectProps<T>) {

    const id = useMemo(() => uuidV4(), []);
    const [ isMenuVisible, setIsMenuVisible ] = useState<boolean>(false);

    const selectedValue: ReactElement<SelectOptionProps<T>> | never = useMemo(() => {
        const findValue = React.Children.toArray(children).filter((child) => {
            const element = child as ReactElement<SelectOptionProps<T>>;
            return element.props.value === value;
        })[0];

        return findValue as ReactElement<SelectOptionProps<T>> ??
            throwError(`Массив selectOptions не содержит текущего значения селектора: ${value}`);

    }, [ value, children ]);

    const memorizedOptions = useMemo(() => {
        return React.Children.map(children, (child, index) => {
            const element = child as ReactElement<SelectOptionProps<T>>;
            return React.cloneElement(element, {
                onClick: (e: MouseEvent<HTMLDivElement>) => {
                    onChange(element.props.value);
                    setIsMenuVisible(false);
                    e.stopPropagation();
                },
                key: index,
            });
        });
    }, [ children, onChange ]);

    return(
        <button
            className={clsx(
                styles['select'],
                isMenuVisible && styles['select--active']
            )}
            onClick={() => setIsMenuVisible(isVisible => !isVisible)}
            onBlur={() => setIsMenuVisible(false)}
            type={'button'}
        >
            <fieldset
                className={clsx(styles['fieldset-outline'])}
            >
                <legend className={styles['fieldset-outline__legend']}>
                    <span>{label}</span>
                </legend>
            </fieldset>
            <div
                className={styles['select__body']}
                id={id}
                onClick={(e: MouseEvent<HTMLDivElement>) => {
                    if (isMenuVisible) {
                        e.stopPropagation();
                        setIsMenuVisible(false);
                    }
                }}
            >
                { selectedValue }
                <Angle className={styles['select__arrow']} />
            </div>
            <div
                className={clsx(
                    styles['select__menu'],
                    isMenuVisible && styles['select__menu--visible']
                )}
            >
                { memorizedOptions }
            </div>
        </button>
    );
};

export default Select;
