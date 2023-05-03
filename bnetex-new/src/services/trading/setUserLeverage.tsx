import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { api } = useApi();

export const setUserLeverage = async (params: any) => {

    return await api.post(
        `/invest-trading/setUserLeverage`, {
            ...params,
            id: getUserInfo().userId
        });
};
