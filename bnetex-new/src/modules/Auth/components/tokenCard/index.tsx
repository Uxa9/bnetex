import classNames from 'classnames';
import { DynamicImg } from 'lib/utils/DynamicImg';
import styles from './tokenCard.module.scss';

interface TokenCardProps {
    imagePath: string;
    hasRedSkeleton?: boolean;
}

const TokenCard = ({imagePath, hasRedSkeleton}: TokenCardProps) => {
    return (
        <div className={styles['token-card']}>
            <DynamicImg 
                path={imagePath}
            />
            <div className={styles['token-card__skeletons']}>
                <div className={styles['skeleton-row']}>
                    <div className={styles['skeleton']}></div>
                    <div className={classNames(
                        styles['skeleton'],
                        hasRedSkeleton && styles['skeleton--red'],
                    )}
                    >
                    </div>
                </div>
                <div className={styles['skeleton']}></div>
                <div className={styles['skeleton']}></div>
                <div className={styles['skeleton']}></div>
            </div>
        </div>
    );
};

export default TokenCard;
