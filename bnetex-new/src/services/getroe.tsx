import { api } from 'config/api';

const getRoE = async (id: number) => {
    return await api.post(
        '/users/getroe', {
            userId: id,
        }
    )
        .then((response) => {
            return {
                dates: response.data.roe.dates,
                values: response.data.roe.values,
            };
        });
};

export default getRoE;
