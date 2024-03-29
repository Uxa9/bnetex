import clsx from 'clsx';
import { useGoToState } from 'lib/hooks/useGoToState';
import { Button } from 'lib/ui-kit';
import { AppLinksEnum } from 'routes/appLinks';
import { blurItems404 } from './blurItems';
import styles from './page404.module.scss';
import {ReactComponent as AbstractGridL} from 'assets/images/abstract-grid--L.svg';
import {ReactComponent as AbstractGridM} from 'assets/images/abstract-grid--M.svg';
import Blur, { BlurProps } from 'modules/Global/components/blurredBackgroundItem';

const Page404 = () => {

    const { goToState } = useGoToState();

    return(
        <div className={styles['container']}>
            {
                blurItems404.map((item: BlurProps, index: number) => 
                    <Blur 
                        key={index}
                        {...item} 
                    />
                )
            }
            <div className={styles['page-404']}>
                <h1 className={styles['page-404__header']}>404</h1>
                <p 
                    className={clsx(
                        styles['page-404__disclaimer'],
                        'subtitle'
                    )}
                >
                Такой страницы не существует. 
                    <br />
                Возможно, вы совершили ошибку в поисковом запросе.
                </p>
                <Button 
                    buttonStyle={'primary'}
                    text={'Главная страница'}
                    onClick={() => goToState(AppLinksEnum.HOME)}
                />
                <AbstractGridM className={styles['page-404__abstract-M']} />
                <AbstractGridL className={styles['page-404__abstract-L']} />
            </div>
        </div>
    );
};

export default Page404;
