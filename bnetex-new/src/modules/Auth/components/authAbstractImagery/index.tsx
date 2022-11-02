import TokenCard from '../tokenCard';
import styles from './authAbstractImagery.module.scss';
import { ReactComponent as AuthLink} from 'assets/images/auth_link.svg';

const AuthAbstractImagery = () => {
    return (
        <div className={styles['abstract-img']}>
            <div className={styles['abstract-img__row']}>
                <TokenCard 
                    imagePath={'logo_ETH.png'}
                />
                <AuthLink 
                    className={styles['abstract-img__link']}
                />
            </div>
            <div className={styles['abstract-img__row']}>
                <AuthLink 
                    className={styles['abstract-img__link']}
                />
                <TokenCard 
                    imagePath={'logo_BTC.png'}
                    hasRedSkeleton
                />
            </div>
            <div className={styles['abstract-img__row']}>
                <TokenCard 
                    imagePath={'logo_USDT.png'}
                />
            </div>
        </div>
    );
};

export default AuthAbstractImagery;
