import { Outlet } from 'react-router-dom';
import styles from './authLayout.module.scss';
import { ReactComponent as AbstractImg} from '../../assets/images/abstract-registration.svg';

const AuthLayout = () => {
    
    return(
        <main className={styles.layout}>
            <Outlet />
            <AbstractImg />
        </main>
    );
};


export default AuthLayout;
