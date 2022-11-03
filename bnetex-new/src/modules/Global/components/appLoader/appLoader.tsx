import styles from './appLoader.module.scss';


const AppLoader = () => {

    return(
        <div className={styles['loader-wrapper']}>
            <div className={styles['loader-container']}>
                <div className={styles['loader-section']} />
                <div className={styles['loader-section']} />
                <div className={styles['loader-section']} />
                <div className={styles['loader-section']} />
            </div>
        </div>
    );
};

export default AppLoader;
