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
           
        </>
    );
}
