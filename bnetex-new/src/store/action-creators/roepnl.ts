import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { Dispatch } from 'redux';
import { RoePnlAction, RoePnlActionTypes, RoePnlState, SuccessfulRoePnlRequestData } from 'store/actions/roepnl';


const { protectedApi, api } = useApi();

// toDo: такая штука должна быть на беке
const transformDataToFixed = (data: SuccessfulRoePnlRequestData): Omit<RoePnlState, 'loading'> => {
    return {
        dates: data.dates,
        pnl: data.pnlValues.map(it => Number(it.toFixed(2))),
        roe: data.roeValues.map(it => Number(it.toFixed(2))),
    };
};

export const getRoeAndPnl = () => {
    return (dispatch: Dispatch<RoePnlAction>) => {
        dispatch({ type: RoePnlActionTypes.SEND_REQUEST});

        return protectedApi
            .post<SuccessfulRoePnlRequestData>(`/users/getRoeAndPnl/${getUserInfo().userId}`) 
            .then((res) => {
                dispatch({ type: RoePnlActionTypes.GET_ROE_PNL, data: transformDataToFixed(res.data)});
            })
            .catch((err) => {
                dispatch({ type: RoePnlActionTypes.REQUEST_ERROR});
                throw new Error(err.response.data.message);
            });
    };
};

export const getHistoricalData = (period: number, amount: number) => {
    return (dispatch: Dispatch<RoePnlAction>) => {
        dispatch({ type: RoePnlActionTypes.SEND_REQUEST});

        return api
            .post<SuccessfulRoePnlRequestData>('/positions/getHistData', {
                period,
                amount,
            }) 
            .then((res) => {
                dispatch({ type: RoePnlActionTypes.GET_HISTORICAL_DATA, data: transformDataToFixed(res.data)});
            })
            .catch((err) => {
                
                dispatch({ type: RoePnlActionTypes.REQUEST_ERROR});
                throw new Error(err.response.data.message);
            });
    };
};


