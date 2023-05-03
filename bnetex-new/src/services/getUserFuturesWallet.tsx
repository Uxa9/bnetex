import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { api } = useApi();

export const getUserFuturesWallet = async () => {

    return await api.get(
        `/invest-trading/balance/${getUserInfo().userId}`);
};
