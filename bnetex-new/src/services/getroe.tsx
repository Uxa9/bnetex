import { api } from 'config/api';

const getRoE = async () => {
    return await api.post('/users/getroe')
        .then((response) => {
            return {
                dates: response.data.roe.dates,
                values: response.data.roe.values,
            };
        });
};

export default getRoE;
