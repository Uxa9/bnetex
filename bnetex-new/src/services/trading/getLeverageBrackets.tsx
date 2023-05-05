import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { api } = useApi();

export const getLeverageBrackets = async () => {

    return await api.get(
        `/invest-trading/getMaxLeverage/${getUserInfo().userId}`
    );
};
