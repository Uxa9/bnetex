import { api } from 'config/api';
import { getUserInfo } from 'lib/utils/getUserInfo';

export const getUserPositions = async () => {
    return await api.get(
        `/invest-trading/userPositions/${getUserInfo().userId}`
    );
};
