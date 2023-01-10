import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { protectedApi } = useApi();

export const getUserPositions = async () => {

    return await protectedApi.get(
        `/invest-trading/userPositions/${getUserInfo().userId}`
    );
};
