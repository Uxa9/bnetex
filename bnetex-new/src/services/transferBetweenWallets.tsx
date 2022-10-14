import useApi from 'lib/hooks/useApi';

interface transferBetweenWalletsData {
    userId : number,
    firstWallet : string,
    secondWallet : string,
    amount : number
}

const [ protectedApi ] = useApi();

const transferBetweenWallets = async (data: transferBetweenWalletsData) => {

    return await protectedApi.post(
        '/users/transfer-money', 
        data
    );
};

export default transferBetweenWallets;
