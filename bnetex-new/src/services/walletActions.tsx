import useApi from 'lib/hooks/useApi';
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

    const { protectedApi, api } = useApi();
    
    const transferBetweenWallets = async (data: transferBetweenWalletsData) => {

        const sendData = {
            sender: WalletCategoryEnum[data.sender],
            reciever: WalletCategoryEnum[data.reciever],
            amount: data.amount,
        };

        return await protectedApi.post(
            '/users/transfer-money', 
            {...sendData, userId: getUserInfo().userId},
            {headers: {
                'Authorization': `Bearer ${getUserInfo().token}`,
            }}
        );
    };
    
    const withdrawConfirm = async (data: WithdrawConfirmFormData) => {
        return await protectedApi.post(
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
        return await protectedApi.post(
            '/request/create', 
            data,
            {headers: {
                'Authorization': `Bearer ${getUserInfo().token}`,
            }}
        );
    };

    const getWallets = async (): Promise<WalletCategoryWithBalance> => {
        return await api.get(`/users/getWallets/${getUserInfo().userId}`)
            .then((response) => {
                return {
                    main: response.data.mainWallet,
                    investor: response.data.investWallet,
                };
            });
    };

    const getUserWallet = async (): Promise<any> => {
        return await api.get(`/wallets/${getUserInfo().userId}`)
            .then((response) => {                
                return {
                    walletId: response.data
                }
            })
    }
    

    return { transferBetweenWallets, withdrawConfirm, withdrawRequest, getWallets, getUserWallet };
};

export default useWalletActions;
