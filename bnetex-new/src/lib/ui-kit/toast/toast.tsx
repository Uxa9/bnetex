import { CircledCheck, CircledCross, Cross } from 'assets/images/icons';
import classNames from 'classnames';
import { useToast } from 'lib/hooks/useToast';
import { delay } from 'lib/utils/delay';
import { useEffect, useState } from 'react';
import styles from './toast.module.scss';

const TOAST_LIFESPAN: number = 3000;
const TOAST_ANIMATION_TIME: number = 350;

const Toast = () => {
    const { toast, clearToast } = useToast();
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        toast && onToastChange();
    }, [toast]);

    const onToastChange = async () => {
        setIsVisible(true);
        await delay(TOAST_LIFESPAN)
            .then(() => setIsVisible(false))
            .then(() => delay(TOAST_ANIMATION_TIME))
            .then(() => clearToast());
    };

    const closeToast = () => {
        setIsVisible(false);
        setTimeout(() => {
            clearToast();
        }, TOAST_ANIMATION_TIME);
    };

    return(
        <div 
            className={classNames(styles.toast,
                isVisible && styles['toast--visible']
            )}
        >
            <div className={styles['toast__title']}>
                {
                    toast && toast.type === 'error' ?
                        <CircledCross 
                            className={classNames(styles['toast__type'],
                                styles['toast__type--error']
                            )}
                        />
                        :
                        <CircledCheck 
                            className={classNames(styles['toast__type'],
                                styles['toast__type--success']
                            )}
                        />
                }
                <h5>{toast && toast.type === 'error' ? 'Ошибка' : 'Успех'}</h5>
            </div>
            <p className={classNames(styles['toast__text'], 'body-1')}>{toast && toast.text}</p>
            <Cross 
                onClick={closeToast}
                className={styles['toast__close']}
            />
        </div>
    );
};

export default Toast;
