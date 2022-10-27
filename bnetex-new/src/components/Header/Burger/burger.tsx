import { useEffect, useState } from 'react';
import styles from './burger.module.scss';

export default function Burger(props: any) {

    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(props.active);
    }, [props.active])

    return (
        <div
            className={`${styles.burger} ${active && styles['burger-active']}`}
        >
            <div
                className={styles['burger-stripe']}
            />
            <div
                className={styles['burger-stripe']}
            />
            <div
                className={styles['burger-stripe']}
            />
        </div>
    )
}