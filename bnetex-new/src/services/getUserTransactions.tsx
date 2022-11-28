import useApi from 'lib/hooks/useApi';

const getUserTransactions = async (id: number) => {

    const { api } = useApi();

    return await api.get(
        `/request/user/${id}`,
    )
        .then((response) => {
            return response.data;
        });
};

export default getUserTransactions;
