import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { protectedApi } = useApi();

export const setUserLeverage = async (params: any) => {

    return await protectedApi.post(
        `/invest-trading/setUserLeverage`, {
            ...params,
            id: getUserInfo().userId
        });
};
