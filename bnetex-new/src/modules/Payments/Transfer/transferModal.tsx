import { Exchange } from 'assets/images/icons';
import { Modal } from 'components/ModalSpawn/Modal/modal';
import { BaseModalProps } from 'lib/hooks/useModal';
import { WalletCategoryEnum, WalletCategoryType } from 'lib/types/wallet';
import { Button, Input, Select, SelectOption } from 'lib/ui-kit';
import { useState } from 'react';
import styles from './transferModal.module.scss';

const TransferModal = (props: BaseModalProps) => {

    const [ senderWalletValue, setSenderWalletValue ] = useState<WalletCategoryType>('main'); 
    const [ recieverWalletValue, setRecieverWalletValue ] = useState<WalletCategoryType>('investor'); 

    const swapSelectorValues = () => {
        const senderWallet = senderWalletValue;
        setSenderWalletValue(recieverWalletValue);
        setRecieverWalletValue(senderWallet); 
    };

    return(
        <Modal
            title={'Перевод средств'}
            onClose={props.onClose}
            className={styles['transfer-modal']}
        >
            <div className={styles['transfer-modal__wallet-selectors']}>
                <Select 
                    value={senderWalletValue}
                    onChange={setSenderWalletValue}
                    label={'Кошелек-отправитель'}
                >
                    <SelectOption 
                        value={WalletCategoryEnum.main}
                        option={'Основной кошелек'}
                    />
                    <SelectOption 
                        value={WalletCategoryEnum.investor}
                        option={'Инвестиционный кошелек'}
                    />
                </Select>
                <Button 
                    buttonStyle={'flat'}
                    Icon={Exchange}
                    onClick={swapSelectorValues}
                    className={styles['exchange-button']}
                />
                <Select 
                    value={recieverWalletValue}
                    onChange={setRecieverWalletValue}
                    label={'Кошелек-получатель'}
                >
                    <SelectOption 
                        value={WalletCategoryEnum.main}
                        option={'Основной кошелек'}
                    />
                    <SelectOption 
                        value={WalletCategoryEnum.investor}
                        option={'Инвестиционный кошелек'}
                    />
                </Select>
            </div>
            <Input
                label={'Сумма перевода'}
                helperText={'Баланс кошелька 32 USDT'}
            />
            <Button 
                buttonStyle={'primary'}
                text={'Подтвердить'}
                fillContainer
            />
        </Modal>
    );
};

export default TransferModal;
