import classNames from 'classnames';
import styles from './signedNumber.module.scss';

interface SignedNumberProps {
    value: number | string;
    postfix?: string;
    withSign?: boolean;
    className?: string;
}

const SignedNumber = ({value, postfix = 'USDT', withSign = true, className}: SignedNumberProps) => {

    const isPositive = value > 0;

    return(
        <span
            className={classNames(
                styles[isPositive ? 'positive' : 'negative'],
                className,  
            )}
        >
            { withSign && isPositive && '+'}
            { value }
            { postfix }
        </span>
    );
};

export default SignedNumber;
