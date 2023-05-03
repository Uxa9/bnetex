import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { api } = useApi();

export const closeAllPositions = async () => {

    return await api.get(
        `/invest-trading/closeAllPositions/${getUserInfo().userId}`
    );
};
