import styles from './modal.module.scss';
import { ReactNode } from 'react';
import { Cross } from 'assets/images/icons';
import classNames from 'classnames';
import { useModalSpawner } from 'lib/hooks/useModal';

export interface ModalProps {
    children: ReactNode;
    title: string | JSX.Element;
    className?: string;

    onClose(): void;
}

export function Modal(props: ModalProps) {

    const { children, title,  className, onClose } = props;
    const { isModalVisible } = useModalSpawner();

    return (
        <section
            className={classNames(
                styles['modal'],
                isModalVisible && styles['modal--visible'],
            )}
            onClick={ props.onClose }
        >
            <div
                className={classNames(
                    styles['modal__container'],
                    isModalVisible && styles['modal__container--visible']
                )}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                }}
            >
                <header
                    className={styles['modal__header']}
                >
                    <h2
                        className={styles['modal__title']}
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className={styles['modal__close']}
                    >
                        {<Cross />}
                    </button>
                </header>
                <div 
                    className={classNames(
                        styles['modal__content'],
                        className
                    )}
                >
                    {children}
                </div>
            </div>
        </section>
    );
}
