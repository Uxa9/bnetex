import useApi from "lib/hooks/useApi";
import { getUserInfo } from "lib/utils/getUserInfo";

const { api } = useApi();

export const getCurrentLeverageAndIsolated = async () => {

    return await api.get(
        `/invest-trading/getLI/${getUserInfo().userId}`
    );
};
