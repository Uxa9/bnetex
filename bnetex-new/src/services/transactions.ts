import useApi from 'lib/hooks/useApi';

export const createTransaction = async (amount: number) => {

    const [protectedApi] = useApi();

    const getUserId = () => {
        const userInfo = localStorage.getItem('userInfo-BNETEX');
        return userInfo ? Number(JSON.parse(userInfo).userId) : '';
    };

    return await protectedApi.post(
        '/transaction/create', {
            amount: amount,
            userId: getUserId(),
        });
};
