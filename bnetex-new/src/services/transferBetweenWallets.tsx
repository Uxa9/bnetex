import useApi from 'lib/hooks/useApi';

interface transferBetweenWalletsData {
    userId : number,
    firstWallet : string,
    secondWallet : string,
    amount : number
}

const transferBetweenWallets = async (data: transferBetweenWalletsData) => {

    const [api] = useApi();

    return await api.post(
        '/users/transfer-money', 
        data
    );
};

export default transferBetweenWallets;
