import { Outlet } from 'react-router-dom';
import styles from './authLayout.module.scss';
import { ReactComponent as AbstractImg} from '../../assets/images/abstract-registration.svg';
import Blur from 'components/blurredBackgroundItem';

const AuthLayout = () => {
    
    return(
        <main className={styles.layout}>
            <Blur 
                color={'purple'}
                top={'0'}
                left={'0'} 
                type={'ellipse'}
                rotate={-165}
            />
            <Blur 
                color={'blue'}
                top={'-10%'}
                left={'30%'} 
                type={'ellipse'}
            />
            <Blur 
                color={'green'}
                top={'-30%'}
                left={'-10%'} 
                type={'circle'}
            />  
            <div className={styles.container}>
                <Outlet />
                <AbstractImg />
            </div>
        </main>
    );
};


export default AuthLayout;
