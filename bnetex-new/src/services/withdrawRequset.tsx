import useApi from 'lib/hooks/useApi';

interface WithdrawFormData {
    userId: number,
    walletAddress: string,
    amount: number,
    type: string
}

const withdrawRequest = async (data: WithdrawFormData) => {

    const [api] = useApi();

    return await api.post(
        '/request/create', 
        data
    )
        .then((response) => {
            localStorage.setItem('requestId', response.data.requestId)
        });
};

export default withdrawRequest;
