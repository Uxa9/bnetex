import { getUnixTime, subMonths } from 'date-fns';
import useApi from 'lib/hooks/useApi';
const { api } = useApi();

export const getUser = async () => {
    return await api.get('/users/info');
};

export const changeUserPassword = async (prevPassword: string, newPassword: string) => {
    return await api.post(
        '/users/changePassword', {
            prevPassword: prevPassword,
            newPassword: newPassword,
        });
};

export const getRoeAndPnl = async () => {

    const from = getUnixTime(subMonths(new Date, 6));
    const to = getUnixTime(new Date);

    return await api.get(
        `/users/getRoeAndPnl?from=${from}&to=${to}`,
    );
};

export const getInvestInfo = async () => {
    return await api.get(
        '/users/invest');
};

export const getUserOpenPosition = async () => {
    return await api.get(
        '/users/invest/positions');
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
            api_secret,
        }
    );
};
