import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { protectedApi } = useApi();

export const getUserFuturesWallet = async () => {

    return await protectedApi.get(
        `/invest-trading/balance/${getUserInfo().userId}`);
};
