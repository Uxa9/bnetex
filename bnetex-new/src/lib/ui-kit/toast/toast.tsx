import { CircledCheck, CircledCross, Info, Cross } from 'assets/images/icons';
import classNames from 'classnames';
import { ToastInterface } from 'lib/types/toast';
import { delay } from 'lib/utils/delay';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './toast.module.scss';
import variablesMap from 'styles/exportedVariables.module.scss';
import { ToastContext } from 'lib/hooks/useToast';

const TOAST_LIFESPAN: number = 3000;
const TOAST_ANIMATION_TIME = Number(variablesMap['defaultTransition'].replace(/ms/, ''));

const Toast = ({id, type, text, deleteToast}: ToastInterface & Pick<ToastContext, 'deleteToast'>) => {
    
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const toastLifeTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsVisible(true);
        if (toastLifeTimer.current) 
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

    const evaluateToastIcon = useCallback(() => {
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
    }, [ type ]);

    return (
        <div 
            className={classNames(
                styles.toast,
                isVisible && styles['toast--visible']
            )}
        >
            { evaluateToastIcon() }
            <p className={classNames(styles['toast__text'], 'text')}>{text}</p>
            <Cross 
                onClick={closeToast}
                className={styles['toast__close']}
            />
        </div>
    );
};

export default Toast;
