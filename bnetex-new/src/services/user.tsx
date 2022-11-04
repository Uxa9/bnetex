import useApi from 'lib/hooks/useApi';
import { getUserId } from 'lib/utils/getUserId';
import { getToken } from './utils/getToken';

const [ protectedApi ] = useApi();


export const getUser = async () => {
    return await protectedApi.get(
        `/users/${getUserId()}`,
        {headers: {
            'Authorization': `Bearer ${getToken()}`,
        }});
};
