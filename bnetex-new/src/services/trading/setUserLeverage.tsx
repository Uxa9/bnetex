import { api } from 'config/api';
import { getUserInfo } from 'lib/utils/getUserInfo';

export const setUserLeverage = async (params: any) => {
    return await api.post(
        '/invest-trading/setUserLeverage', {
            ...params,
            id: getUserInfo().userId,
        });
};
