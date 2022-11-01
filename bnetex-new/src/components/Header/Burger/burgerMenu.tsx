import classNames from 'classnames';
import { useTheme } from 'lib/hooks/useTheme';
import { ToggleSwitchButton } from 'lib/ui-kit';
import { useEffect, useState } from 'react';
import styles from './burgerMenu.module.scss';


export default function BurgerMenu(props: any) {

    const [isOpen, setIsOpen] = useState(false);
    const links = props.links();

    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setIsOpen(props.open);
    }, [props.open]);

    return (
        <>
            <div
                className={`${styles['menu-background']}
                    ${isOpen ? 
                        styles['menu-background-active'] : 
                        styles['menu-background-hidden']}`
                }
                onClick={props.onClose}
            />
            <div
                className={
                    `${styles['burger-menu']} 
                    ${isOpen ? 
                        styles['burger-menu-active'] : 
                        styles['burger-menu-hidden']}`
                }
            >
                {links.map((item: any) => {
                    return (
                        <div
                            className={styles['burger-menu-link']}
                            onClick={props.onClose}
                        >
                            {item}
                        </div>)
                })}
                <div
                    className={styles['theme-button-switcher']}
                >
                    <ToggleSwitchButton 
                        active={(theme === "dark")}
                        handleChange={toggleTheme}
                    />
                </div>
            </div>
        </>
    )
}