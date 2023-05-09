import { api } from 'config/api';
import { getUserInfo } from 'lib/utils/getUserInfo';

export const sendFuturesOrder = async (params: any) => {
    return await api.post(
        '/invest-trading/place-order', {
            ...params,
            id: getUserInfo().userId,
        });
};
