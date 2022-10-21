import classNames from 'classnames';
import { Button, Input } from 'lib/ui-kit';
import { FC, HTMLAttributes, ReactElement, ReactNode } from 'react';
import styles from './formCard.module.scss';

interface FormCardProps extends HTMLAttributes<HTMLFormElement>{
    title:string,
    subtitle?: string,
    inputs?: ReactElement<typeof Input>[],
    button: ReactElement<typeof Button>,
    actions?: ReactNode,
    step?: string,
}

const FormCard: FC<FormCardProps> = (props) => {

    const {title, subtitle, inputs, button, actions, className, step, ...rest} = props;

    return(
        <form  
            className={classNames(
                styles.form,
                'card',
                className
            )}
            {...rest}
        >
            <div className={styles['form__header']}>
                {
                    step && 
                    <p className={classNames(
                        styles['form__step'],
                        'caption',
                    )}
                    >
                        {step}
                    </p>
                }
                <h3>{title}</h3>
                <p className='text'>{subtitle}</p>
            </div>
            {inputs}
            {button}
            <div className={styles['form__actions']}>
                {actions}
            </div>
        </form>
    );
};

export default FormCard;
