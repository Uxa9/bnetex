import { api } from 'config/api';

const getPnL = async (id: number) => {
    return await api.post('/users/getpnl', { userId: id })
        .then((response) => {
            return {
                dates: response.data.pnl.dates,
                values: response.data.pnl.values,
            };
        });
};

export default getPnL;
