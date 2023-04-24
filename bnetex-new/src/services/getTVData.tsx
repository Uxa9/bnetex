import useApi from 'lib/hooks/useApi';
import { HistoryRangeSpots } from 'modules/TradingView/api/types';

const { api } = useApi();

const getTVData = async (historyRangeSpots: HistoryRangeSpots) => {
    return await api
        .post('/positions/getTVData',{
            ...historyRangeSpots
        })
        .then((response) =>  response.data);
};

export default getTVData;
