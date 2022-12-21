import { Angle } from 'assets/images/icons';
import clsx from 'clsx';
import { useModal } from 'lib/hooks/useModal';
import { Transaction, TransactionStatusMap, TransactionTypeMap } from 'lib/types/transaction';
import { Button, IconButton } from 'lib/ui-kit';
import CopyButton from 'lib/ui-kit/copyButton/copyButton';
import { formatDate } from 'lib/utils/formatDate';
import CryptoTransactionItemModal from 'modules/Dashboard/components/cryptoTransactionItemModal/cryptoTransactionItemModal';
import { ReactNode, useMemo } from 'react';
import styles from './cryptoTransactionItem.module.scss';

interface CryptoTransactionItemProps {
    item: Transaction,
}

interface Cell {
    classNames: string[];
    label: string;
    value: string | ReactNode;
}

//toDo: чуть отрефакторить поведение cell, потом перенести такую логику в другие таблицы

const CryptoTransactionItem = (props: CryptoTransactionItemProps) => {

    const { item } = props;
    const { open } = useModal(CryptoTransactionItemModal);
    const openCryptoTransactionItemModal = () => open({item: item});

    const cells: Cell[] = useMemo(() => {
        return [
            {
                classNames: ['date'],
                label: 'Дата',
                value: formatDate(new Date(item.date), true),
            },
            {
                classNames: ['item-type', `item-type--${item.type}`],
                label: 'Перевод',
                value: TransactionTypeMap[item.type],
            },
            {
                classNames: ['wallet'],
                label: 'Кошелек',
                value: item.wallet,
            },
            {
                classNames: ['asset'],
                label: 'Актив',
                value: item.coin,
            },
            {
                classNames: ['amount'],
                label: 'Сумма',
                value: item.amount,
            },
            {
                classNames: ['destination', 'item-destination'],
                label: 'Адресат',
                value: <>
                    <p>
                        {item.destination}
                    </p>
                    <CopyButton
                        textToCopy={item.destination}
                        successText={'Кошелек успешно скопирован в ваш буфер обмена'}
                    />
                </>,
            },
            {
                classNames: ['status'],
                label: 'Статус',
                value: <div className={clsx(styles['item-status'], styles[`item-status--${item.status}`], 'caption-mini')}>
                    { TransactionStatusMap[item.status] }
                </div>,
            },
        ];
    }, [ item ]);

    return (
        <>
            {
                cells.map(cell =>
                    <td
                        className={styles[cell.classNames[0]]}
                        key={cell.classNames[0]}
                    >
                        <span
                            className={clsx(
                                styles['body-label'],
                                'caption',
                            )}
                        >
                            { cell.label }
                        </span>
                        {
                            cell.classNames[1]
                                ? <div className={styles[cell.classNames[1]]}>{ cell.value }</div>
                                : cell.value
                        }
                    </td>
                )
            }
            <td
                className={styles['item-expand-modal']}
            >
                <IconButton
                    Icon={Angle}
                    onClick={openCryptoTransactionItemModal}
                />
            </td>
            <td
                className={styles['item-expand-modal--mobile']}
            >
                <Button
                    text='Подробнее'
                    Icon={Angle}
                    onClick={openCryptoTransactionItemModal}
                    buttonStyle={'secondary'}
                    iconAlignment={'right'}
                    mini
                />
            </td>
        </>
    );
};

export default CryptoTransactionItem;
