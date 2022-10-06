import useApi from 'lib/hooks/useApi';

interface WithdrawConfirmFormData {
    requestId: number,
    confirmCode: string
}

const withdrawConfirm = async (data: WithdrawConfirmFormData) => {

    const [api] = useApi();

    return await api.post(
        '/request/fulfill', 
        data
    );
};

export default withdrawConfirm;
