import { api } from 'config/api';
import { getUserInfo } from 'lib/utils/getUserInfo';

export const getUserFuturesWallet = async () => {
    return await api.get(
        `/invest-trading/balance/${getUserInfo().userId}`);
};
