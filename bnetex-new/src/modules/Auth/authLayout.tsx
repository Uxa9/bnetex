import { Outlet } from 'react-router-dom';
import styles from './authLayout.module.scss';
import { ReactComponent as AuthLink} from 'assets/images/auth_link.svg';
import Blur from 'components/blurredBackgroundItem';
import classNames from 'classnames';
import { DynamicImg } from 'lib/utils/DynamicImg';

const AuthLayout = () => {
    return (
        <main className={styles.layout}>
            <div className={styles.container}>
                <Blur 
                    color={'red'}
                    top={'100%'}
                    left={'0%'} 
                    type={'ellipse'}
                    rotate={165}
                />
                <Blur 
                    color={'blue'}
                    top={'70%'}
                    left={'50%'}
                    type={'ellipse'}
                />
                <Blur 
                    color={'purple'}
                    top={'-30%'}
                    left={'0%'}
                    type={'circle'}
                />
                <Blur 
                    color={'purple'}
                    top={'-40%'}
                    left={'50%'}
                    type={'circle'}
                />
                <Outlet />
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
            </div>
        </main>
    );
};

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


export default AuthLayout;
