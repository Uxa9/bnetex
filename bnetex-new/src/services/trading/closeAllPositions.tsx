import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { protectedApi } = useApi();

export const closeAllPositions = async () => {

    return await protectedApi.get(
        `/invest-trading/closeAllPositions/${getUserInfo().userId}`
    );
};
