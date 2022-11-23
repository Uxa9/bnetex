import clsx from 'clsx';
import styles from './signedNumber.module.scss';

interface SignedNumberProps {
    value: number | string;
    postfix?: string;
    withSign?: boolean;
    className?: string;
}

const SignedNumber = ({value, postfix, withSign = true, className}: SignedNumberProps) => {

    const isPositive = value > 0;

    const evaluateNumberStyle = () => {
        switch (true) {
            case value > 0: {
                return 'positive';
            }
            case value < 0: {
                return 'negative';
            }
            default: {
                return 'zero';
            }
        }
    };

    return(
        <span
            className={clsx(
                styles[evaluateNumberStyle()],
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
