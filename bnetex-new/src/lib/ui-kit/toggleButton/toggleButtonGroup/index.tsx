import React, { PropsWithChildren, ReactNode } from 'react';
import { FC, ReactElement } from 'react';
import ToggleButton, { ToggleButtonProps } from '../toggleButton';
import styles from './toggleButtonGroup.module.scss';

interface ToggleButtonGroupProps {
    title?: string,
    name: string,
    value?: string | number,
    onChange: (value: any, name?: string) => void
    children: ReactElement<typeof ToggleButton>[]
    exclusive?: boolean,
    asNumber?: boolean
}

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = props => {

    const { title, value, exclusive, name, children, onChange, asNumber } = props;

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(asNumber ? event.currentTarget.valueAsNumber : event.currentTarget.value, event.currentTarget.name);
    };

    const propsToToggleButtons = {
        name: name,
        onChange: handleValueChange,
        exclusive: exclusive,
    };

    function renderChildrenWithProps(children: ReactNode, elementProps: any): ReactNode {

        const childrenLength = React.Children.count(children) - 1;

        return React.Children.map(children, (child, index) => {
            const element = child as ReactElement<PropsWithChildren<ToggleButtonProps>>;

            if(value) elementProps['checked'] = (value === element.props.value);

            const btnLocation = index === 0 ? 'left' : index === childrenLength  ? 'right' : 'center';

            return React.cloneElement(element, { ...elementProps, key: index, location: btnLocation });
        });
    }

    return (
        <fieldset className={styles.container}>
            {title && 
                <legend className='label-1'>{title}</legend>
            }
            <div className={styles['toggle-buttons']}>
                {renderChildrenWithProps(children, propsToToggleButtons)}
            </div>

        </fieldset>
    );
};

export default ToggleButtonGroup;
