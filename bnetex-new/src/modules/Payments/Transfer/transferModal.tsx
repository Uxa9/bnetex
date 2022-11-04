import { Exchange } from 'assets/images/icons';
import { Modal } from 'components/ModalSpawn/Modal/modal';
import { useGoToState } from 'lib/hooks/useGoToState';
import { BaseModalProps } from 'lib/hooks/useModal';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { WalletCategoryEnum, WalletCategoryType, WalletCategoryWithBalance } from 'lib/types/wallet';
import { Button, Input, Select, SelectOption } from 'lib/ui-kit';
import { blockEAndDashKey } from 'lib/utils';
import { numberValidation } from 'lib/utils/hookFormValidation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import useWalletActions from 'services/walletActions';
import styles from './transferModal.module.scss';

interface TransferFormData {
    sender: string;
    reciever: string;
    amount: number;
}

const TransferModal = (props: BaseModalProps) => {

    const [ senderWalletValue, setSenderWalletValue ] = useState<WalletCategoryType>('main'); 
    const [ recieverWalletValue, setRecieverWalletValue ] = useState<WalletCategoryType>('investor'); 
    const [ walletBalances, setWalletBalances ] = useState<WalletCategoryWithBalance>({main: 0, investor: 0}); 
    const isWalletSelectionValid = useMemo(() => senderWalletValue !== recieverWalletValue, [ senderWalletValue, recieverWalletValue ]);

    const { isLoading, promiseWithLoading } = usePromiseWithLoading();
    const { bakeToast } = useToast();
    const { transferBetweenWallets, getWallets } = useWalletActions();
    const { goToState } = useGoToState();

    const swapSelectorValues = () => {
        const senderWallet = senderWalletValue;
        setSenderWalletValue(recieverWalletValue);
        setRecieverWalletValue(senderWallet); 
    };

    useEffect(() => {
        promiseWithLoading<WalletCategoryWithBalance>(getWallets())
            .then(response => {
                setWalletBalances({...response});
            });
    }, []);

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
                                    <span>{walletBalances.main}</span>
                                </p>
                            }
                        />
                        <SelectOption 
                            value={WalletCategoryEnum.investor}
                            option={
                                <p className={styles['wallet-category']}>
                                    Инвестиционный кошелек
                                    <span>{walletBalances.investor}</span>
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
                                    <span>{walletBalances.main}</span>
                                </p>
                            }
                        />
                        <SelectOption 
                            value={WalletCategoryEnum.investor}
                            option={
                                <p className={styles['wallet-category']}>
                                    Инвестиционный кошелек
                                    <span>{walletBalances.investor}</span>
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
                                (value) => Number(value) <= walletBalances[senderWalletValue],
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
