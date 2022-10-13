import { UserState, UserActionTypes, UserAction } from '../actions/user';

const initialState: UserState = {
    id: 0,
    roles: [''],
    mainWallet: 0,
    investWallet: 0
};

export const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionTypes.WITHDRAW:
            return {...state, mainWallet: state.mainWallet - action.amount };
        case UserActionTypes.DEPOSIT:
            return {...state, mainWallet: state.mainWallet + action.amount };
        case UserActionTypes.SET_MAIN_WALLET:                        
            return {...state, mainWallet: action.amount };
        case UserActionTypes.SET_INVEST_WALLET:
            return {...state, investWallet: action.amount };
        default:
            return state;
    }
};
