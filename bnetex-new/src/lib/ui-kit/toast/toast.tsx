import { CircledCheck, CircledCross, Info } from 'assets/images/icons';
import clsx from 'clsx';
import { ToastInterface } from 'lib/types/toast';
import { delay } from 'lib/utils/delay';
import { useEffect, useRef, useState } from 'react';
import styles from './toast.module.scss';
import { ToastContext } from 'lib/hooks/useToast';
import { useTheme } from 'lib/hooks/useTheme';
import getCssVariable from 'lib/utils/getCssVariable';

const TOAST_LIFESPAN: number = 3000;
const TOAST_ANIMATION_TIME = getCssVariable('DEFAULT_TRANSITION');

const Toast = (props: ToastInterface & Pick<ToastContext, 'deleteToast'>) => {

    const {id, type, description, title, deleteToast} = props;
    const { theme } = useTheme();

    const [ isVisible, setIsVisible ] = useState<boolean>(true);
    const toastLifeTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        toastLifeTimer.current = setTimeout(closeToast, TOAST_LIFESPAN);

        return () => {
            toastLifeTimer.current && clearTimeout(toastLifeTimer.current);
        };
    }, []);

    const closeToast = () => {
        setIsVisible(false);
        toastLifeTimer.current && clearTimeout(toastLifeTimer.current);
        delay(TOAST_ANIMATION_TIME)
            .then(() => deleteToast(id));
    };

    const evaluateToastIcon = () => {
        switch (type) {
            case 'success': {
                return <CircledCheck />;
            }
            case 'error': {
                return <CircledCross />;
            }
            default: {
                return <Info />;
            }
        }
    };

    return (
        <div
            className={clsx(
                styles.toast,
                !isVisible && styles['toast--hidden'],
                theme === 'dark' && styles['toast--dark'],
            )}
        >
            <div className={styles['toast__main']}>
                <div className={clsx(
                    styles['toast__icon'],
                    styles[`toast__icon--${type}`]
                )}
                >
                    { evaluateToastIcon() }
                </div>
                <div className={styles['toast__text']}>
                    <span className={'subtitle'}>{title}</span>
                    <span className={clsx(
                        styles['description'],
                        'caption',
                    )}
                    >
                        {description}
                    </span>
                </div>
            </div>
            <button
                className={styles['toast__close']}
                onClick={closeToast}
            >
                <span className={'caption'}>Ок</span>
            </button>
        </div>
    );
};

export default Toast;
