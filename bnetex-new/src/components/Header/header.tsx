import styles from './header.module.scss';

import {Wallet, User, Logo, Settings}    from '../../assets/images/icons';

import _l from '../../locales/index';
import { useNavigate } from 'react-router-dom';
import { Button } from 'lib/ui-kit';
import { MouseEventHandler } from 'react';

// toDo
// декомпозировать ссылки в компоненте, провести рефактор!! 


const headerModes = {
    'beginner': _l.beginner_level,
    'advanced': _l.advanced_level,
    'investor': _l.investor_level,
}; 

const Header = () => {

    const navigate = useNavigate();

    return (
        <header
            className={styles.header}
        >
            <Logo 
                onClick={() => navigate('/')}
            />
            <nav className={styles.links}>
                <div className={styles['links__main']}>
                    <Button 
                        text={'Фьючерсы USD-M'} 
                        buttonStyle={'thin'}
                    />
                    <Button 
                        text={'P2P'} 
                        buttonStyle={'thin'}
                    />
                    
                </div>
                <div className={styles['links__user']}>
                    <Button 
                        text={'Кошельки'} 
                        buttonStyle={'thin'}
                        Icon={Wallet}
                    />
                    <Button 
                        text={'Профиль'} 
                        buttonStyle={'thin'}
                        Icon={User}
                    />
                    <Button 
                        buttonStyle={'thin'}
                        Icon={Settings}
                    />
                </div>
            </nav>
           
        </header>
    );
};

export default Header;
