import { api } from 'config/api';
import { getUserInfo } from 'lib/utils/getUserInfo';

export const getCurrentLeverageAndIsolated = async () => {
    return await api.get(
        `/invest-trading/getLI/${getUserInfo().userId}`
    );
};
