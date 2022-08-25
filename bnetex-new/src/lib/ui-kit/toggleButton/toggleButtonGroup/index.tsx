import { renderChildrenWithProps } from 'lib/utils';
import React from 'react';
import { FC, ReactElement } from 'react';
import ToggleButton, { ToggleButtonProps } from '../toggleButton';
import styles from './toggleButtonGroup.module.scss';

interface ToggleButtonGroupProps {
    title: string,
    name: string,
    onChange: (value: string | number, name?: string) => void
    children: ReactElement<typeof ToggleButton>[]
    exclusive?: boolean,
}

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = props => {

    const { title, exclusive, name, children, onChange } = props;

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value, event.currentTarget.name);
    };

    const propsToToggleButtons = {
        name: name,
        onChange: handleValueChange,
        exclusive: exclusive,
    };

    return (
        <fieldset className={styles.container}>
            <legend className='label-1'>{title}</legend>

            <div className={styles['toggle-buttons']}>
                {renderChildrenWithProps<ToggleButtonProps>(children, propsToToggleButtons)}
            </div>

        </fieldset>
    );
};

export default ToggleButtonGroup;
