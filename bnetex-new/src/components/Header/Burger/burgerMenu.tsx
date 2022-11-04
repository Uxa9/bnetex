import classNames from 'classnames';
import { useTheme } from 'lib/hooks/useTheme';
import { Switch } from 'lib/ui-kit';
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
                className={classNames(
                    styles['menu-background'],
                    styles[`menu-background--${isOpen ? 'active' : 'hidden'}`]
                )}
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
                        </div>);
                })}
                <Switch
                    checked={theme === 'dark'} 
                    onChange={toggleTheme}
                    label={'Темная тема'}
                />
            </div>
        </>
    );
}
