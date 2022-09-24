import { Outlet } from 'react-router-dom';
import styles from './authLayout.module.scss';
import { ReactComponent as AbstractImg} from '../../assets/images/abstract-registration.svg';
import Blur from 'components/blurredBackgroundItem';

const AuthLayout = () => {
    
    return(
        <main className={styles.layout}>
            <div className={styles.container}>
                <Blur 
                    color={'purple'}
                    top={'0%'}
                    left={'-20%'} 
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
                    color={'red'}
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
                <AbstractImg 
                    className={styles['abstract-img']}
                />
            </div>
        </main>
    );
};


export default AuthLayout;
