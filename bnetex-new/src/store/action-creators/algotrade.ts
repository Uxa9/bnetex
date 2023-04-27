import useApi from 'lib/hooks/useApi';
import { decodeUserJwt } from 'lib/utils/decodeJwt';
import {getUserInfo} from 'lib/utils/getUserInfo';
import {Dispatch} from 'redux';
import {AlgotradeAction, AlgotradeActionTypes, AlgotradeDataResponse} from 'store/actions/algotrade';

const { protectedApi } = useApi();

export const getAlgotradeData = () => {
    return (dispatch: Dispatch<AlgotradeAction>) => {
        dispatch({ type: AlgotradeActionTypes.SEND_REQUEST});

        return protectedApi
            .get<AlgotradeDataResponse>(`/users/invest/${decodeUserJwt().userId}`)
            .then((res) => {
                dispatch({ type: AlgotradeActionTypes.GET_ALGOTRADE_DATA, data: res.data});
            })
            .catch((err) => {
                dispatch({ type: AlgotradeActionTypes.REQUEST_ERROR});
                throw new Error(err.response.data.message);
            });
    };
};

export const triggerTVMarkRefresh = () => {
    return (dispatch: Dispatch<AlgotradeAction>) => {
        dispatch({ type: AlgotradeActionTypes.REFRESH_TV_MARKS});
    };
};

export const changeViewType = (payload: string) => {
    return (dispatch: Dispatch<AlgotradeAction>) => {
        dispatch({type: AlgotradeActionTypes.CHANGE_VIEW_TYPE, payload: payload});
    }
}
