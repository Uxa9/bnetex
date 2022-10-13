import { Dispatch } from 'redux';
import { UserAction, UserActionTypes } from 'store/actions/user';

export const withdrawMoney = (amount: number) => {
    return async (dispatch: Dispatch<UserAction>) => {
        dispatch({ type: UserActionTypes.WITHDRAW, amount: amount});
    };
};

export const depositMoney = (amount: number) => {
    return async (dispatch: Dispatch<UserAction>) => {
        dispatch({ type: UserActionTypes.DEPOSIT, amount: amount});
    };
};

export const setMainWallet = (amount: number) => {
    return async (dispatch: Dispatch<UserAction>) => {
        dispatch({ type: UserActionTypes.SET_MAIN_WALLET, amount: amount});
    };
};

export const setInvestWallet = (amount: number) => {
    return async (dispatch: Dispatch<UserAction>) => {
        dispatch({ type: UserActionTypes.SET_INVEST_WALLET, amount: amount});
    };
};