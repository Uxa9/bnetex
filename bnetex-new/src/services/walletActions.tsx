import useApi from 'lib/hooks/useApi';
import { WalletCategoryWithBalance } from 'lib/types/wallet';
import { getUserId } from 'lib/utils/getUserId';
import { getToken } from './utils/getToken';

interface transferBetweenWalletsData {
    sender: string,
    reciever: string,
    amount: number
}

interface WithdrawConfirmFormData {
    requestId: number,
    confirmCode: string
}

const WalletCategoryEnum: {[key: string]: string} = {
    main: 'mainWallet',
    investor: 'investWallet',
}

const useWalletActions = () => {

    const [ protectedApi, api ] = useApi();
    
    const transferBetweenWallets = async (data: transferBetweenWalletsData) => {

        const sendData = {
            sender: WalletCategoryEnum[data.sender],
            reciever: WalletCategoryEnum[data.reciever],
            amount: data.amount
        }

        return await protectedApi.post(
            '/users/transfer-money', 
            {...sendData, userId: getUserId()},
            {headers: {
                'Authorization': `Bearer ${getToken()}`,
            }}
        );
    };
    
    const withdrawConfirm = async (data: WithdrawConfirmFormData) => {
        return await protectedApi.post(
            '/request/fulfill', 
            {...data, requestId: Number(localStorage.getItem('requestId'))},
            {headers: {
                'Authorization': `Bearer ${getToken()}`,
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
                'Authorization': `Bearer ${getToken()}`,
            }}
        );
    };

    const getWallets = async (): Promise<WalletCategoryWithBalance> => {
        return await api.get(`/users/getWallets/${getUserId()}`)
            .then((response) => {
                return {
                    main: response.data.mainWallet,
                    investor: response.data.investWallet,
                };
            });
    };
    

    return { transferBetweenWallets, withdrawConfirm, withdrawRequest, getWallets };
};

export default useWalletActions;
