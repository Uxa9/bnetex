import { Info } from 'assets/images/icons';
import { differenceInSeconds } from 'date-fns';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { Button } from 'lib/ui-kit';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';
import { pad } from 'lib/utils/pad';
import { useEffect, useRef, useState } from 'react';
import useAuthActions from 'services/auth';
import styles from './resendCodeAction.module.scss';

const DEFAULT_DELAY_BETWEEN_REQUESTS = 30; 
const TIMER_INTERVAL = 1000;

const ResendCodeAction = ({ userEmail }: {userEmail: string}) => {
    const { promiseWithLoading } = usePromiseWithLoading();
    const { checkActivationCodeTime, resendActivationCode } = useAuthActions();
    const { bakeToast } = useToast();

    const [ timeToNextCodeSending, setTimeToNextCodeSending ] = useState<number>(-1);
    const timer = useRef<NodeJS.Timeout | null>(null);

    const runTimer = () => {
        console.log('timer');
        setTimeToNextCodeSending(prevState => {
            if (prevState !== 0) {
                return prevState - 1;
            }
            else {
                timer.current && clearInterval(timer.current);
                return 0;
            }
        });
    };
    
    useEffect(() => {
        userEmail && checkTime();

        return () => {
            timer.current && clearInterval(timer.current);
        };

    }, [ userEmail ]);

    const checkTime = () => {
        promiseWithLoading(checkActivationCodeTime(userEmail))
            .then(response => {
                const prevCodeSendTime = new Date(response.data);
                const timeElapsed = differenceInSeconds(new Date(), prevCodeSendTime);
                if (timeElapsed < DEFAULT_DELAY_BETWEEN_REQUESTS) {
                    setTimeToNextCodeSending(DEFAULT_DELAY_BETWEEN_REQUESTS - timeElapsed);
                    timer.current = setInterval(runTimer, TIMER_INTERVAL);
                }
                else setTimeToNextCodeSending(0);
            })
            .catch((err) => bakeToast.error(err.message));
    };

    const handleSubmit = () => {
        setTimeToNextCodeSending(-1);
        promiseWithLoading(resendActivationCode(userEmail))
            .then(() => bakeToast.success(`Код отправлен на ${userEmail}`))
            .then(() => checkTime());
    };

    return(
        <>
            {
                timeToNextCodeSending === -1 ?
                    <Skeleton 
                        height={'12px'}
                    />
                    :
                    <>
                        {
                            timeToNextCodeSending !== 0 ? 
                                <div className={styles['helper-timer']}>
                                    <Info />
                                    <span 
                                        className={'caption-mini'}
                                    >
                                        {`Отправить код повторно через 00:${pad(timeToNextCodeSending, 2)}`}
                                    </span>
                                </div>
                                :
                                <Button 
                                    buttonStyle={'flat'}
                                    text={'Отправить код повторно'}
                                    className={'caption-mini'}
                                    onClick={handleSubmit}
                                    type={'button'}
                                />
                        }
                    </>
            }
        </>
    );
};

export default ResendCodeAction;
