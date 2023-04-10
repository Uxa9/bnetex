import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { protectedApi } = useApi();

export const sendFuturesOrder = async (params: any) => {

    return await protectedApi.post(
        `/invest-trading/place-order`, {
            ...params,
            id: getUserInfo().userId
        });
};
