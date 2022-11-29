import { WalletState, WalletActionTypes, WalletAction } from '../actions/wallets';

const initialState: WalletState = {
    mainWallet: 0,
    investWallet: 0,
    loading: false,
};

export const walletReducer = (state = initialState, action: WalletAction): WalletState => {
    switch (action.type) {
        case WalletActionTypes.SEND_WALLET_REQUEST:
            return {...state, loading: true };
        case WalletActionTypes.GET_WALLETS:
            return { mainWallet: action.mainWallet, investWallet: action.investorWallet, loading: false };
        case WalletActionTypes.WALLET_REQUEST_RETURNED:
            return {...state, loading: false };
        default:
            return state;
    }
};
