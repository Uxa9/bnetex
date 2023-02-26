import { useTheme } from 'lib/hooks/useTheme';
import { DynamicImg } from 'lib/utils/DynamicImg';
import styles from './devices.module.scss';

const Devices = () => {

    const { theme } = useTheme();

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['info']}>
                    <h2>Пользуйтесь на <span>всех</span> устройствах</h2>
                    <p className={'text'}>
                        Мы тщательно проработали дизайн нашего сервиса и сделали его максимально
                         адаптивным, чтобы вы могли получить доступ к торгам с любого устройства.
                    </p>
                </div>
                <div className={styles['image-container']}>
                    <div className={styles['image-container__background']} />
                    <DynamicImg
                        path={`devices_${theme}.png`}
                        className={styles['image-container__image']}
                    />
                </div>
            </div>
        </section>
    );
};

export default Devices;
