import useApi from 'lib/hooks/useApi';
import { WalletCategoryWithBalance } from 'lib/types/wallet';
import { getUserId } from 'lib/utils/getUserId';

interface transferBetweenWalletsData {
    sender: string,
    reciever: string,
    amount: number
}

interface WithdrawConfirmFormData {
    requestId: number,
    confirmCode: string
}

const useWalletActions = () => {

    const [ protectedApi, api ] = useApi();
    
    const transferBetweenWallets = async (data: transferBetweenWalletsData) => {
        return await protectedApi.post(
            '/users/transfer-money', 
            {data, userId: getUserId()}
        );
    };
    
    const withdrawConfirm = async (data: WithdrawConfirmFormData) => {
        return await protectedApi.post(
            '/request/fulfill', 
            data
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
            data
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
