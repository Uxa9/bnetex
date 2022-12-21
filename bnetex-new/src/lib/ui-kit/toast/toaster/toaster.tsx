import { useToast } from 'lib/hooks/useToast';
import Toast from '../toast';
import styles from './toaster.module.scss';

const Toaster = () => {

    const { toaster, deleteToast } = useToast();

    return (
        <>
            {
                <div className={styles['toaster']}>
                    {
                        Array.from(toaster).map(([id, toast]) =>
                            <Toast
                                key={id.toString()}
                                deleteToast={deleteToast}
                                {...toast}
                            />
                        )
                    }
                </div>
            }
        </>
    );
};

export default Toaster;
