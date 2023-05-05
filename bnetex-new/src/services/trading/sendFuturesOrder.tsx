import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { api } = useApi();

export const sendFuturesOrder = async (params: any) => {

    return await api.post(
        `/invest-trading/place-order`, {
            ...params,
            id: getUserInfo().userId
        });
};
