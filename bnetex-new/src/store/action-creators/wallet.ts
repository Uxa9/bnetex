import { Dispatch } from 'redux';
import { WalletAction, WalletActionTypes } from 'store/actions/wallets';
import useApi from 'lib/hooks/useApi';
import { WalletCategoryType } from 'lib/types/wallet';
import { getUserInfo } from 'lib/utils/getUserInfo';

const { protectedApi } = useApi();

export const getWallets = () => {
    return (dispatch: Dispatch<WalletAction>) => {
        dispatch({ type: WalletActionTypes.SEND_WALLET_REQUEST});

        return protectedApi
            .get(`/users/getWallets/${getUserInfo().userId}`)
            .then((res) => {
                dispatch({
                    type: WalletActionTypes.GET_WALLETS,
                    mainWallet: res.data.mainWallet,
                    investorWallet: res.data.investWallet,
                });
            })
            .catch(() => {
                dispatch({ type: WalletActionTypes.WALLET_REQUEST_RETURNED});
            });
    };
};

export const transferBetweenWallets = (sender: WalletCategoryType, reciever: WalletCategoryType, amount: number) => {

    return (dispatch: Dispatch<WalletAction>) => {
        dispatch({ type: WalletActionTypes.SEND_WALLET_REQUEST});

        const requestBody = {
            sender: `${sender}Wallet`,
            reciever: `${reciever}Wallet`,
            amount: amount,
            userId: getUserInfo().userId,
        };

        return protectedApi.post('/users/transfer-money', requestBody)
            .then(() => {
                dispatch({ type: WalletActionTypes.WALLET_REQUEST_RETURNED});
            })
            .catch((err) => {
                dispatch({ type: WalletActionTypes.WALLET_REQUEST_RETURNED});
                throw new Error(err.response.data.message);
            });
    };
};

export const withdrawConfirm = (confirmCode: string) => {

    return (dispatch: Dispatch<WalletAction>) => {
        dispatch({ type: WalletActionTypes.SEND_WALLET_REQUEST});

        return protectedApi.post('/request/fulfill', {
            confirmCode,
            requestId: Number(localStorage.getItem('requestId')),
        })
            .then(() => {
                dispatch({ type: WalletActionTypes.WALLET_REQUEST_RETURNED});
            })
            .catch((err) => {
                dispatch({ type: WalletActionTypes.WALLET_REQUEST_RETURNED});
                throw new Error(err.response.data.message);
            });
    };
};

export const withdrawRequest = (walletAddress: string, amount: number, type: string) => {
    return (dispatch: Dispatch<WalletAction>) => {
        dispatch({ type: WalletActionTypes.SEND_WALLET_REQUEST});

        return protectedApi.post('/request/create', {
            walletAddress,
            amount,
            type,
            userId: getUserInfo().userId,
        })
            .then(() => {
                dispatch({ type: WalletActionTypes.WALLET_REQUEST_RETURNED});
            })
            .catch((err) => {
                dispatch({ type: WalletActionTypes.WALLET_REQUEST_RETURNED});
                throw new Error(err.response.data.message);
            });
    };
};
