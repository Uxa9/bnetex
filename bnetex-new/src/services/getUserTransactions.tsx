import useApi from 'lib/hooks/useApi';

const getUserTransactions = async () => {

    const { api } = useApi();

    return await api.get(
        `/request/user`,
    )
        .then((response) => {
            return response.data;
        });
};

export default getUserTransactions;
