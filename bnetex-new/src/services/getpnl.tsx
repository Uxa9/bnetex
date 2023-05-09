import { api } from 'config/api';

const getPnL = async () => {
    return await api.post('/users/getpnl')
        .then((response) => {
            return {
                dates: response.data.pnl.dates,
                values: response.data.pnl.values,
            };
        });
};

export default getPnL;
