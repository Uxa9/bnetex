import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import { title } from 'process';
import { FC, HTMLAttributes, ReactElement, ReactNode } from 'react';
import styles from './formCard.module.scss';

interface FormCardProps extends HTMLAttributes<HTMLFormElement>{
    title:string,
    subtitle?: string,
    inputs?: ReactNode,
    button: ReactElement<typeof Button>,
    actions?: ReactNode,
}

const FormCard: FC<FormCardProps> = (props) => {

    const {title, subtitle, inputs, button, actions, className, ...rest} = props;

    return(
        <form  
            className={classNames(
                styles.form,
                '.card',
                className
            )}
            {...rest}
        >
            <div className={styles['form__header']}>
                <h3>{title}</h3>
                <p className='body-1'>{subtitle}</p>
            </div>

            {inputs}
            {button}
            {actions}
        </form>
    );
};

export default FormCard;
