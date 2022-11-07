import { AxiosResponse } from 'axios';
import useApi from 'lib/hooks/useApi';
import { TradeHistoryItem } from 'lib/types/tradeHistoryItem';
import { Dispatch } from 'redux';
import { TradeHistoryAction, TradeHistoryActionTypes } from 'store/actions/tradeHistory';

const [ api ] = useApi();

export const getTradeHistory = (period: number, amount: number) => {
    return async (dispatch: Dispatch<TradeHistoryAction>) => {
        try {
            dispatch({ type: TradeHistoryActionTypes.FETCH_HISTORY });
            const response: AxiosResponse<TradeHistoryItem[]> = await api.get(`positions/${period}`,
                {params: {period, amount}}
            );
            dispatch({ type: TradeHistoryActionTypes.FETCH_HISTORY_SUCCESS, tradeHistory: response.data  });
        } catch (e) {
            dispatch({
                type: TradeHistoryActionTypes.FETCH_HISTORY_ERROR,
                error: 'Произошла ошибка при загрузке истории',
            });
        }
    };
};
