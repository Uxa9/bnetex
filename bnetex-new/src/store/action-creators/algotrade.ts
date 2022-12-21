import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { Dispatch } from 'redux';
import { AlgotradeAction, AlgotradeActionTypes, AlgotradeDataResponse } from 'store/actions/algotrade';

const { protectedApi } = useApi();

export const getAlgotradeData = () => {
    return (dispatch: Dispatch<AlgotradeAction>) => {
        dispatch({ type: AlgotradeActionTypes.SEND_REQUEST});

        return protectedApi
            .get<AlgotradeDataResponse>(`/users/invest/${getUserInfo().userId}`)
            .then((res) => {
                dispatch({ type: AlgotradeActionTypes.GET_ALGOTRADE_DATA, data: res.data});
            })
            .catch((err) => {
                dispatch({ type: AlgotradeActionTypes.REQUEST_ERROR});
                throw new Error(err.response.data.message);
            });
    };
};
