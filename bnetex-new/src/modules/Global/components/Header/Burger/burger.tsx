import clsx from 'clsx';
import styles from './burger.module.scss';

interface BurgerProps {
    isOpened: boolean;
    onClick: () => void;
    roundedCorner?: boolean;
    className?: string;
}

const Burger = ({isOpened, onClick, roundedCorner, className}: BurgerProps) => {
    return(
        <button
            className={clsx(
                styles['burger'],
                roundedCorner && styles['burger--rounded'],
                isOpened && styles['burger--opened'],
                className
            )}
            onClick={onClick}
        >
            <div></div>
            <div></div>
            <div></div>
        </button>
    );
};

export default Burger;
