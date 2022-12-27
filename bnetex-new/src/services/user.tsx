import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';

const { api, protectedApi } = useApi();

export const getUser = async () => {
    return await protectedApi.get(
        `/users/${getUserInfo().userId}`,
        {
            headers: {
                'Authorization': `Bearer ${getUserInfo().token}`,
            },
        });
};

export const changeUserPassword = async (prevPassword: string, newPassword: string) => {
    return await protectedApi.post(
        '/users/changePassword', {
            userId: getUserInfo().userId,
            prevPassword: prevPassword,
            newPassword: newPassword,
        });
};

export const getRoeAndPnl = async () => {
    return await protectedApi.get(
        `/users/getRoeAndPnl/${getUserInfo().userId}`,
    );
};

export const getInvestInfo = async () => {
    return await protectedApi.get(
        `/users/invest/${getUserInfo().userId}`);
};

export const getUserOpenPosition = async () => {
    return await protectedApi.get(
        `/users/invest/positions/${getUserInfo().userId}`);
};

export const resendActivationCode = async (email: string) => {
    return await api.post<string>(
        '/auth/resend-activation-link', {
            email: email,
        });
};

export const checkActivationCodeTime = async (email: string) => {
    return await api.post(
        '/auth/activattion-link-datetime', {
            email: email,
        });
};
