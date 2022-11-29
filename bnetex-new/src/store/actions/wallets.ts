export interface WalletState {
    mainWallet: number; 
    investWallet: number;
    loading: boolean;
}

export enum WalletActionTypes {
    SEND_WALLET_REQUEST = 'SEND_WALLET_REQUEST',
    GET_WALLETS = 'GET_WALLETS',
    GET_TRANSACTIONS = 'GET_TRANSACTIONS',
    WALLET_REQUEST_RETURNED = 'WALLET_REQUEST_RETURNED', 
}

interface SendWalletRequestAction {
    type: WalletActionTypes.SEND_WALLET_REQUEST;
}

interface GetWalletsAction {
    type: WalletActionTypes.GET_WALLETS;
    mainWallet: number;
    investorWallet: number;
}


interface WalletRequestReturnedAction {
    type: WalletActionTypes.WALLET_REQUEST_RETURNED;
}

export type WalletAction = SendWalletRequestAction | GetWalletsAction | WalletRequestReturnedAction;
