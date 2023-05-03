import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { Dispatch } from 'redux';
import { RoePnlAction, RoePnlActionTypes, RoePnlState, SuccessfulRoePnlRequestData } from 'store/actions/roepnl';

const { api } = useApi();

// toDo: такая штука должна быть на беке
const transformDataToFixed = (data: SuccessfulRoePnlRequestData): Omit<RoePnlState, 'loading'> => {
    // toDo: костыль ебаный, с history приходит pnlValues, с getRoeAndPnl - pnl. Какого хуя?
    const pnl = data.pnlValues ?? data.pnl;
    const roe = data.roeValues ?? data.roe;

    return {
        dates: data.dates,
        pnl: pnl.map(it => Number(it.toFixed(2))),
        roe: roe.map(it => Number(it.toFixed(2))),
    };
};

export const getRoeAndPnl = () => {
    return (dispatch: Dispatch<RoePnlAction>) => {
        dispatch({ type: RoePnlActionTypes.SEND_REQUEST});

        return api
            .get<SuccessfulRoePnlRequestData>(`/users/getRoeAndPnl`)
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

        const to = new Date().valueOf();
        const from = new Date().setMonth(new Date().getMonth() - period);

        return api
            .post<SuccessfulRoePnlRequestData>('/positions/getHistData', {
                to,
                from,
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
