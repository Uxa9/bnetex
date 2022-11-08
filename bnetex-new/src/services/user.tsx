import useApi from 'lib/hooks/useApi';
import { getUserId } from 'lib/utils/getUserId';
import { getToken } from './utils/getToken';

const [protectedApi] = useApi();


export const getUser = async () => {
    return await protectedApi.get(
        `/users/${getUserId()}`,
        {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            }
        });
};

export const changeUserPassword = async (prevPassword: string, newPassword: string) => {
    return await protectedApi.post(
        '/users/changePassword', {
        userId: getUserId(),
        prevPassword: prevPassword,
        newPassword: newPassword
    },
        {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            }
        });
}

export const getRoeAndPnl = async () => {
    return await protectedApi.get(
        `/users/getRoeAndPnl/${getUserId()}`,
        {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            }
        });
}

export const getInvestInfo = async () => {
    return await protectedApi.get(
        `/users/invest/${getUserId()}`,
        {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            }
        });
}

export const getUserOpenPosition = async () => {
    return await protectedApi.get(
        `/users/invest/positions/${getUserId()}`,
        {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            }
        });
}
