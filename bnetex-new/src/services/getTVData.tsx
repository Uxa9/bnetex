import { api } from 'config/api';
import { HistoryRangeSpots } from 'modules/TradingView/api/types';

const getTVData = async (historyRangeSpots: HistoryRangeSpots) => {
    return await api
        .post('/positions/getTVData',{
            ...historyRangeSpots,
        })
        .then((response) =>  response.data);
};

export default getTVData;
