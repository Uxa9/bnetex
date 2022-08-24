import { renderChildrenWithProps } from 'lib/utils';
import React from 'react';
import { FC, ReactElement } from 'react';
import RadioButton, { RadioButtonProps } from '../radioButton';
import styles from './radioButtonGroup.module.scss';

interface RadioButtonGroupProps {
    title: string,
    name: string,
    onChange: (value: string | number) => void
    children: ReactElement<typeof RadioButton>[]
}

const RadioButtonGroup: FC<RadioButtonGroupProps> = props => {

    const { title, name, children, onChange } = props;

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value)
    }

    const propsToRadioButtons = {
        name: name,
        onChange: handleValueChange,
    }

    return (
        <fieldset className={styles.container}>
            <legend className='label-1'>{title}</legend>

            <div className={styles['radio-buttons']}>
                {renderChildrenWithProps<RadioButtonProps>(children, propsToRadioButtons)}
            </div>

        </fieldset>
    )
}

export default RadioButtonGroup;