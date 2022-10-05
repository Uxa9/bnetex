import useApi from 'lib/hooks/useApi';

interface WithdrawFormData {
    userId: string,
    address: string,
    amount: number,
    type: string
}

const withdrawRequest = async (data: WithdrawFormData) => {

    const [api] = useApi();

    return await api.post(
        '/request/create', 
        data
    )
        .then((_response) => {
            
        });
};

export default withdrawRequest;
