
export interface UserState {
    id: number,
    roles: string[],
    mainWallet: number,
    investWallet: number
}

export enum UserActionTypes {
    WITHDRAW = 'WITHDRAW',
    DEPOSIT = 'DEPOSIT',
    SET_MAIN_WALLET = 'SET_MAIN_WALLET',
    SET_INVEST_WALLET = 'SET_INVEST_WALLET'
}

interface WithdrawUserAction {
    type: UserActionTypes.WITHDRAW,
    amount: number
}

interface DepositUserAction {
    type: UserActionTypes.DEPOSIT,
    amount: number
}

interface SetMainWallet {
    type: UserActionTypes.SET_MAIN_WALLET,
    amount: number
}

interface SetInvestWallet {
    type: UserActionTypes.SET_INVEST_WALLET,
    amount: number
}

export type UserAction = WithdrawUserAction | 
                         DepositUserAction  |
                         SetMainWallet      |
                         SetInvestWallet
