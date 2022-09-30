import classNames from 'classnames';
import { CryptoTransactionItemType } from 'lib/types/cryptoTransactionItem';
import CopyButton from 'lib/ui-kit/copyButton/copyButton';
import { formatDate } from 'lib/utils/formatDate';
import styles from './cryptoTransactionItem.module.scss';

interface CryptoTransactionItemProps{
    item: CryptoTransactionItemType,
}

const mapType = (element: CryptoTransactionItemType['type']) => {
    return (
        <td 
            className={classNames(styles['item-type'],
                styles[`item-type--${element}`]
            )}
        >
            {element === 'income' ? 'Ввод' : 'Вывод'}
        </td>
    );
};

const mapStatus = (element: CryptoTransactionItemType['status']) => {
    return (
        <td 
            className={classNames(styles['item-status'],
                styles[`item-status--${element}`]
            )}
        >
            {element === 'confirmed' ? 'Завершена' : 'В обработке'}
        </td>
    );
};

const CryptoTransactionItem = (props: CryptoTransactionItemProps) => {
    const { item } = props;

    return(
        <>
            <td>{formatDate(item.date, true)}</td>
            {mapType(item.type)}
            <td>{item.wallet}</td>
            <td>{item.coin}</td>
            <td>{item.amount}</td>
            <td className={styles['item-destination']}>
                <p>
                    {item.destination}
                </p>
                <CopyButton 
                    textToCopy={item.destination}
                    successText={'Кошелек успешно скопирован в ваш буфер обмена'}
                />
            </td>
            {mapStatus(item.status)}
            <td></td>
        </>
    );
};

export default CryptoTransactionItem;
