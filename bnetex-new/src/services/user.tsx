import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';

const { api, protectedApi } = useApi();

export const getUser = async () => {
    return await protectedApi.get(`/users/info`);
};

export const changeUserPassword = async (prevPassword: string, newPassword: string) => {
    return await protectedApi.post(
        '/users/changePassword', {
            prevPassword: prevPassword,
            newPassword: newPassword,
        });
};

export const getRoeAndPnl = async () => {
    return await protectedApi.get(
        `/users/getRoeAndPnl`,
    );
};

export const getInvestInfo = async () => {
    return await protectedApi.get(
        `/users/invest`);
};

export const getUserOpenPosition = async () => {
    return await protectedApi.get(
        `/users/invest/positions`);
};

export const resendActivationCode = async (email: string) => {
    return await api.post<string>(
        '/auth/resend-activation-link', {
            email: email,
        });
};

export const checkActivationCodeTime = async (email: string) => {
    return await api.post(
        '/auth/activation-link-datetime', {
            email: email,
        });
};

export const changeApiKey = async (api_key: string, api_secret: string) => {
    return await api.put(
        '/users/set-api', {
            api_key,
            api_secret
        }
    )
}
