import { Copy } from 'assets/images/icons';
import { useToast } from 'lib/hooks/useToast';
import Button, { ButtonProps } from '../button/button';
import styles from './copyButton.module.scss';

// При необходимости можно добавить разные стили

interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'buttonStyle' | 'className' | 'Icon'> {
    textToCopy: string,
    successText: string,
}

const CopyButton = (props: CopyButtonProps) => {

    const { textToCopy, successText, ...rest } = props;
    const { bakeToast } = useToast();

    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(textToCopy)
            .then(() => bakeToast.success(successText))
            .catch(() => bakeToast.error('Не удалось скопировать данные в буфер обмена, попробуйте скопировать вручную'));
    };

    return (
        <Button 
            {...rest}
            onClick={handleCopyClick}
            buttonStyle={'thin'}
            className={styles.copyButton}
            Icon={Copy}
        />
    );
};

export default CopyButton;
