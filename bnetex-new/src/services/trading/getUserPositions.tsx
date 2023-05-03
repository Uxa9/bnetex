import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { api } = useApi();

export const getUserPositions = async () => {

    return await api.get(
        `/invest-trading/userPositions/${getUserInfo().userId}`
    );
};
