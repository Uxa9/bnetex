import { Exchange } from 'assets/images/icons';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useGoToState } from 'lib/hooks/useGoToState';
import { BaseModalProps } from 'lib/hooks/useModal';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { WalletCategoryEnum, WalletCategoryType } from 'lib/types/wallet';
import { Button, Input, Select, SelectOption } from 'lib/ui-kit';
import { blockEAndDashKey } from 'lib/utils';
import { numberValidation } from 'lib/utils/hookFormValidation';
import { Modal } from 'modules/Global/components/ModalSpawn/Modal/modal';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import useWalletActions from 'services/walletActions';
import { getWallets } from 'store/action-creators/wallet';
import styles from './transferModal.module.scss';

interface TransferFormData {
    sender: WalletCategoryType;
    reciever: WalletCategoryType;
    amount: number;
}

const TransferModal = (props: BaseModalProps) => {

    const [ senderWalletValue, setSenderWalletValue ] = useState<WalletCategoryType>('main'); 
    const [ recieverWalletValue, setRecieverWalletValue ] = useState<WalletCategoryType>('investor'); 
    const isWalletSelectionValid = useMemo(() => senderWalletValue !== recieverWalletValue, 
        [ senderWalletValue, recieverWalletValue ]);

    const { isLoading, promiseWithLoading } = usePromiseWithLoading();
    const { bakeToast } = useToast();
    const { transferBetweenWallets } = useWalletActions();
    const { goToState } = useGoToState();
    const dispath = useAppDispatch();
    const { mainWallet, investWallet } = useTypedSelector(state => state.wallet);
   
    useEffect(() => {
        dispath(getWallets());
    }, []);
    
    const swapSelectorValues = () => {
        const senderWallet = senderWalletValue;
        setSenderWalletValue(recieverWalletValue);
        setRecieverWalletValue(senderWallet); 
    };

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<TransferFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: TransferFormData) => {

        const sendData: TransferFormData = {
            ...data,
            sender: senderWalletValue,
            reciever: recieverWalletValue,
        };

        promiseWithLoading(transferBetweenWallets(sendData))
            .then(() => {
                goToState(`${AppLinksEnum.DASHBOARD}/wallet/${recieverWalletValue}`);
                props.onClose();
                bakeToast.success(`Успешно переводено ${data.amount}.`);
            })
            .catch((error) => {
                bakeToast.error(error.response?.data.message);
            });
    };

    return(
        <Modal
            title={'Перевод средств'}
            onClose={props.onClose}
        >
            <form 
                onSubmit={handleSubmit(onSubmit)}
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
                            option={
                                <p className={styles['wallet-category']}>
                                    Основной кошелек
                                    <span>{mainWallet}</span>
                                </p>
                            }
                        />
                        <SelectOption 
                            value={WalletCategoryEnum.investor}
                            option={
                                <p className={styles['wallet-category']}>
                                    Инвестиционный кошелек
                                    <span>{investWallet}</span>
                                </p>
                            }
                        />
                    </Select>
                    <Button 
                        buttonStyle={'flat'}
                        Icon={Exchange}
                        onClick={swapSelectorValues}
                        className={styles['exchange-button']}
                        type={'button'}
                    />
                    <Select 
                        value={recieverWalletValue}
                        onChange={setRecieverWalletValue}
                        label={'Кошелек-получатель'}
                    >
                        <SelectOption 
                            value={WalletCategoryEnum.main}
                            option={
                                <p className={styles['wallet-category']}>
                                    Основной кошелек
                                    <span>{mainWallet}</span>
                                </p>
                            }
                        />
                        <SelectOption 
                            value={WalletCategoryEnum.investor}
                            option={
                                <p className={styles['wallet-category']}>
                                    Инвестиционный кошелек
                                    <span>{investWallet}</span>
                                </p>
                            }
                        />
                    </Select>
                </div>
                <Input
                    label={'Сумма перевода'}
                    inputControl={register('amount', {
                        ...numberValidation, 
                        validate: {
                            inputValueIsLesserThanSenderWalletBalance: 
                                (value) => value <= (senderWalletValue === 'main' ? mainWallet : investWallet),
                        },
                    })}
                    errorText={errors.amount?.message}
                    type={'number'}
                    onKeyPress={blockEAndDashKey}
                />
                <Button 
                    buttonStyle={'primary'}
                    type={'submit'}
                    text={'Подтвердить'}
                    fillContainer
                    disabled={!isValid || !isWalletSelectionValid}
                    isLoading={isLoading}
                />
            </form>
        </Modal>
    );
};

export default TransferModal;
