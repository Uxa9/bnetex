import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { protectedApi } = useApi();

export const getLeverageBrackets = async () => {

    return await protectedApi.get(
        `/invest-trading/getMaxLeverage/${getUserInfo().userId}`
    );
};
