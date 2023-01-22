import useApi from 'lib/hooks/useApi';
import { HistoryPeriod } from 'modules/TradingView/api/types';

const { api } = useApi();

const getTVData = async (historyPeriod: HistoryPeriod) => {
    return await api
        .post('/positions/getTVData',{
            period: historyPeriod,
        })
        .then((response) =>  response.data);
};

export default getTVData;
