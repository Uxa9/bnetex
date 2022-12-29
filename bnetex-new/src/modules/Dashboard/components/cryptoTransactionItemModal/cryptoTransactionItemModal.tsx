import clsx from 'clsx';
import { BaseModalProps } from 'lib/hooks/useModal';
import { Transaction, TransactionStatusMap } from 'lib/types/transaction';
import styles from './cryptoTransactionItemModal.module.scss';
import itemStyles from '../cryptoTransactionItem/cryptoTransactionItem.module.scss';
import CopyButton from 'lib/ui-kit/copyButton/copyButton';
import { formatDate } from 'lib/utils/formatDate';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';

interface CryptoTransactionItemModalProps{
    item: Transaction;
}

const CryptoTransactionItemModal = (props: CryptoTransactionItemModalProps & BaseModalProps) => {

    const { item, onClose } = props;

    return(
        <Modal
            title={'Детали транзакции'}
            onClose={onClose}
            className={clsx(
                styles['content'],
                'text'
            )}
        >
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Статус</span>
                <p
                    className={clsx(itemStyles['item-status'],
                        itemStyles[`item-status--${item.status}`],
                        'caption-mini',
                    )}
                >
                    {TransactionStatusMap[item.status]}
                </p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Дата</span>
                <p>{formatDate(new Date(item.date), true)}</p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Перевод</span>
                <p
                    className={clsx(itemStyles['item-type'],
                        itemStyles[`item-type--${item.type}`],
                    )}
                >
                    {item.type === 'income' ? 'Ввод' : 'Вывод'}
                </p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Монета</span>
                <p>{item.coin}</p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Сумма</span>
                <p>{item.amount}</p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Комиссия сети</span>
                <p>0.4</p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Сеть</span>
                <p>TRON (TRC20)</p>
            </div>
            <div className={clsx(styles['data-line'], styles['item-destination'])}>
                <span className={styles['data-line__label']}>Адрес</span>
                <div className={itemStyles['item-destination']}>
                    <p>
                        {item.destination}
                    </p>
                    <CopyButton
                        textToCopy={item.destination}
                        successText={'Кошелек успешно скопирован в ваш буфер обмена'}
                    />
                </div>
            </div>
            <div className={clsx(styles['data-line'], styles['wallet'])}>
                <span className={styles['data-line__label']}>Кошелек получатель</span>
                <p>{item.wallet}</p>
            </div>
        </Modal>
    );
};


export default CryptoTransactionItemModal;
