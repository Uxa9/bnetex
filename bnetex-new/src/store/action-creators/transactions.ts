import useApi from 'lib/hooks/useApi';
import { Transaction } from 'lib/types/transaction';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { Dispatch } from 'redux';
import { TransactionAction, TransactionActionTypes } from 'store/actions/transactions';

const { api } = useApi();

// не должно быть такой хуйни - нужно править бек
const parseTransactions = (transactions: any[]): Transaction[] => {
    return transactions.map(it => {
        return {
            id: it.id,
            date: Number(new Date(it.createdAt)),
            type: it.type === '1' ? 'withdraw' : 'income',
            wallet: 'Основной кошелек',
            coin: 'USDT',
            amount: it.amount,
            destination: it.walletAddress,
            status: it.fulfilled ? 'confirmed' : 'processing',
        };
    });
};

export const getTransactions = () => {
    return (dispatch: Dispatch<TransactionAction>) => {
        dispatch({ type: TransactionActionTypes.SEND_REQUEST});

        return api
            .get(`/wallets/transactions`)
            .then((res) => {
                dispatch({ type: TransactionActionTypes.GET_TRANSACTIONS, data: parseTransactions(res.data)});
            })
            .catch((err) => {
                dispatch({ type: TransactionActionTypes.REQUEST_ERROR});
                throw new Error(err.response.data.message);
            });
    };
};
