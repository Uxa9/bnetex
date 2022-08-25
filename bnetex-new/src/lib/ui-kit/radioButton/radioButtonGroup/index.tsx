import React, { PropsWithChildren, ReactNode } from 'react';
import { FC, ReactElement } from 'react';
import RadioButton, { RadioButtonProps } from '../radioButton';
import styles from './radioButtonGroup.module.scss';

interface RadioButtonGroupProps {
    title: string,
    name: string,
    value?: string | number,
    onChange: (value: any) => void,
    children: ReactElement<typeof RadioButton>[]
}

const RadioButtonGroup: FC<RadioButtonGroupProps> = props => {

    const { title, name, value, children, onChange } = props;

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
    };

    const propsToRadioButtons = {
        name: name,
        onChange: handleValueChange,
    };

    function renderChildrenWithProps(children: ReactNode, elementProps: any): ReactNode {
        return React.Children.map(children, (child, index) => {
            const element = child as ReactElement<PropsWithChildren<RadioButtonProps>>;

            if(value) elementProps['checked'] = (value === element.props.value);

            return React.cloneElement(element, { ...elementProps, key: index });
        });
    }

    return (
        <fieldset className={styles.container}>
            <legend className='label-1'>{title}</legend>

            <div className={styles['radio-buttons']}>
                {renderChildrenWithProps(children, propsToRadioButtons)}
            </div>

        </fieldset>
    );
};

export default RadioButtonGroup;
