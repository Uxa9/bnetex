import classNames from 'classnames';
import { Modal } from 'components/ModalSpawn/Modal/modal';
import { BaseModalProps } from 'lib/hooks/useModal';
import { CryptoTransactionItemStatusMap, CryptoTransactionItemType } from 'lib/types/cryptoTransactionItem';
import styles from './cryptoTransactionItemModal.module.scss';
import itemStyles from '../cryptoTransactionItem/cryptoTransactionItem.module.scss';
import CopyButton from 'lib/ui-kit/copyButton/copyButton';
import { formatDate } from 'lib/utils/formatDate';

interface CryptoTransactionItemModalProps{
    item: CryptoTransactionItemType;
}

const CryptoTransactionItemModal = (props: CryptoTransactionItemModalProps & BaseModalProps) => {

    const { item, onClose } = props;

    return(
        <Modal
            title={'Детали транзакции'}
            onClose={onClose}
            className={classNames(
                styles['content'],
                'text'
            )}
        >
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Статус</span>
                <p
                    className={classNames(itemStyles['item-status'],
                        itemStyles[`item-status--${item.status}`],
                        'caption-mini',
                    )}
                >
                    {CryptoTransactionItemStatusMap[item.status]}
                </p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Дата</span>
                <p>{formatDate(item.date, true)}</p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Перевод</span>
                <p
                    className={classNames(itemStyles['item-type'],
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
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Адрес</span>
                <p className={itemStyles['item-destination']}>
                    <span>
                        {item.destination}
                    </span>
                    <CopyButton 
                        textToCopy={item.destination}
                        successText={'Кошелек успешно скопирован в ваш буфер обмена'}
                    />
                </p>
            </div>
            <div className={styles['data-line']}>
                <span className={styles['data-line__label']}>Кошелек получатель</span>
                <p>{item.wallet}</p>
            </div>
        </Modal>
    );
};


export default CryptoTransactionItemModal;
