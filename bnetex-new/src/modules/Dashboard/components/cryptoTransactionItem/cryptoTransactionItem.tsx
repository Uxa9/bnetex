import { Angle } from 'assets/images/icons';
import clsx from 'clsx';
import { useModal } from 'lib/hooks/useModal';
import { Transaction, TransactionStatusMap } from 'lib/types/transaction';
import { IconButton } from 'lib/ui-kit';
import CopyButton from 'lib/ui-kit/copyButton/copyButton';
import { formatDate } from 'lib/utils/formatDate';
import CryptoTransactionItemModal from 'modules/Dashboard/components/cryptoTransactionItemModal/cryptoTransactionItemModal';
import styles from './cryptoTransactionItem.module.scss';

interface CryptoTransactionItemProps {
    item: Transaction,
}

const CryptoTransactionItem = (props: CryptoTransactionItemProps) => {

    const { item } = props;
    const { open } = useModal(CryptoTransactionItemModal);
    const openCryptoTransactionItemModal = () => open({item: item});

    return(
        <>
            <td className={'caption'}>{formatDate(new Date(item.date), true)}</td>
            <td
                className={clsx(styles['item-type'],
                    styles[`item-type--${item.type}`],
                    'caption',
                )}
            >
                {item.type === 'income' ? 'Ввод' : 'Вывод'}
            </td>
            <td className={'caption'}>{item.wallet}</td>
            <td className={'caption'}>{item.coin}</td>
            <td className={'caption'}>{item.amount}</td>
            <td className={clsx(styles['item-destination'],
                styles['item-destination--fill'],
                'caption')}
            >
                <p>
                    {item.destination}
                </p>
                <CopyButton
                    textToCopy={item.destination}
                    successText={'Кошелек успешно скопирован в ваш буфер обмена'}
                />
            </td>
            <td
                className={clsx(styles['item-status'],
                    styles[`item-status--${item.status}`],
                    'caption-mini',
                )}
            >
                {TransactionStatusMap[item.status]}
            </td>
            <td
                className={styles['item-expand-modal']}
            >
                <IconButton
                    Icon={Angle}
                    onClick={openCryptoTransactionItemModal}
                />
            </td>
        </>
    );
};

export default CryptoTransactionItem;
