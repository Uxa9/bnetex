import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './burgerMenu.module.scss';


export default function BurgerMenu(props: any) {

    const [isOpen, setIsOpen] = useState(false);
    const links = props.links();

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
            >

            </div>
            <div
                className={
                    `${styles['burger-menu']} 
                    ${isOpen ? 
                        styles['burger-menu-active'] : 
                        styles['burger-menu-hidden']}`
                }
                onClick={props.onClose}
            >
                {links.map((item: any) => {
                    return (
                        <div
                            className={styles['burger-menu-link']}
                        >
                            {item}
                        </div>)
                })}
            </div>
        </>
    )
}