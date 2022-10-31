import { FC, useEffect, useState } from "react";

export interface ToggleButtonProps {
    active: boolean
}

const ToggleSwitchButton: FC<ToggleButtonProps> = props => {

    const [active, setActive] = useState();
    
    useEffect(() => {
        setActive(props.active);
    }, [props.active]);

    return (
        <div class="container">
  <label for="toggle-button" class="text">Toggle Button</label>
</div>
    );
};

export default ToggleSwitchButton;