import { api } from 'config/api';
import { getUserInfo } from 'lib/utils/getUserInfo';

export const getLeverageBrackets = async () => {
    return await api.get(
        `/invest-trading/getMaxLeverage/${getUserInfo().userId}`
    );
};
