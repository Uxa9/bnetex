import { api } from 'config/api';
import { getUserInfo } from 'lib/utils/getUserInfo';

export const closeAllPositions = async () => {
    return await api.get(
        `/invest-trading/closeAllPositions/${getUserInfo().userId}`
    );
};
