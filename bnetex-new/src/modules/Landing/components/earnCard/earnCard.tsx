import clsx from 'clsx';
import styles from './earnCard.module.scss';

export interface EarnCardProps {
    percent: number;
    description: string;
    isPrimary?: boolean;
    className?: string;
}

const EarnCard = ({ percent, description, isPrimary, className }: EarnCardProps) => {
    return (
        <div className={clsx(
            styles['wrapper'],
            className
        )}
        >
            <div className={clsx(
                styles['card'],
                isPrimary && styles['card--primary']
            )}
            >
                <div className={styles['card__title']}>
                    {
                        isPrimary
                            ? <h3>{ percent }</h3>
                            : <h5>{ percent }</h5>
                    }
                    <span className={isPrimary ? 'text-bold' : 'text'}>годовых</span>
                </div>
                <p className={styles['description']}>{ description }</p>
            </div>
        </div>
    );
};

export default EarnCard;
