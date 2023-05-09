import { api } from 'config/api';
import { WalletCategoryType, WalletCategoryWithBalance } from 'lib/types/wallet';
import { getUserInfo } from 'lib/utils/getUserInfo';

interface transferBetweenWalletsData {
    sender: WalletCategoryType,
    reciever: WalletCategoryType,
    amount: number
}

interface WithdrawConfirmFormData {
    requestId: number,
    confirmCode: string
}

const WalletCategoryEnum: {[key: string]: string} = {
    main: 'mainWallet',
    investor: 'investWallet',
};

const useWalletActions = () => {

    const transferBetweenWallets = async (data: transferBetweenWalletsData) => {
        const sendData = {
            sender: WalletCategoryEnum[data.sender],
            reciever: WalletCategoryEnum[data.reciever],
            amount: data.amount,
        };

        return await api.post(
            '/users/transfer-money',
            {...sendData},
            {headers: {
                'Authorization': `Bearer ${getUserInfo().token}`,
            }}
        );
    };

    const withdrawConfirm = async (data: WithdrawConfirmFormData) => {
        return await api.post(
            '/request/fulfill',
            {...data, requestId: Number(localStorage.getItem('requestId'))},
            {headers: {
                'Authorization': `Bearer ${getUserInfo().token}`,
            }}
        );
    };

    interface WithdrawFormData {
        userId: number,
        walletAddress: string,
        amount: number,
        type: string
    }

    const withdrawRequest = async (data: WithdrawFormData) => {
        return await api.post(
            '/request/create',
            data,
            {headers: {
                'Authorization': `Bearer ${getUserInfo().token}`,
            }}
        );
    };

    const getWallets = async (): Promise<WalletCategoryWithBalance> => {
        return await api.get('/users/getWallets')
            .then((response) => {
                return {
                    main: response.data.mainWallet,
                    investor: response.data.investWallet,
                };
            });
    };

    const getUserWallet = async (): Promise<any> => {
        return await api.get('/wallets')
            .then((response) => {
                return {
                    walletId: response.data,
                };
            });
    };


    return { transferBetweenWallets, withdrawConfirm, withdrawRequest, getWallets, getUserWallet };
};

export default useWalletActions;
