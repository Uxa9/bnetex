import { FC, useEffect, useState } from "react";
import styles from './toggleSwitch.module.scss';

export interface ToggleButtonProps {
    active: boolean,
    handleChange(): void
}

const ToggleSwitchButton: FC<ToggleButtonProps> = props => {

    const [active, setActive] = useState(false);
    
    useEffect(() => {
        setActive(props.active);
    }, [props.active]);

    const handleChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
        setActive(checked);
        props.handleChange();
    }

    return (
        <input 
            type="checkbox"
            className={styles['toggle-button']}
            onChange={(e) => handleChange(e.target.checked)}
            checked={active}
        />
    );
};

export default ToggleSwitchButton;