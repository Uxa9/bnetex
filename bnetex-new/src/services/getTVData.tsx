import useApi from 'lib/hooks/useApi';
import { HistoryPeriod } from 'store/actions/algotrade';

const getTVData = async (historyPeriod: HistoryPeriod) => {

    const { api } = useApi();

    return await api.post('/positions/getTVData',
        {
            periodMonth: historyPeriod,
        }
    )
        .then((response) => {
            console.log(response.data);

            return response.data;
        });
};

export default getTVData;
