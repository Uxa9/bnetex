import { useEffect, useState } from 'react';
import styles from './burgerMenu.module.scss';


export default function BurgerMenu(props: any) {

    const [isOpen, setIsOpen] = useState(false);

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
            >

            </div>
            <div
                className={
                    `${styles['burger-menu']} 
                    ${isOpen ? 
                        styles['burger-menu-active'] : 
                        styles['burger-menu-hidden']}`
                }
            >
                {props.children}
            </div>
        </>
    )
}