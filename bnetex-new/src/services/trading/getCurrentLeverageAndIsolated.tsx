import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { protectedApi } = useApi();

export const getCurrentLeverageAndIsolated = async () => {

    return await protectedApi.get(
        `/invest-trading/getLI/${getUserInfo().userId}`
    );
};
