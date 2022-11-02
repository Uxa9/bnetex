import classNames from 'classnames';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';
import styles from './formCard.module.scss';

const FormCardSkeleton = () => {
    return(
        <form  
            className={classNames(
                styles.form,
                'card',
            )}
        >
            <div className={styles['form__header']}>
                <Skeleton height={'32px'} width={'80%'} />
                <Skeleton height={'15px'} />
                <Skeleton height={''} type={'input'} />
                <Skeleton height={''} type={'input'} />
                <Skeleton height={''} type={'button'} />
            </div>
        </form>
    );
};

export default FormCardSkeleton;
