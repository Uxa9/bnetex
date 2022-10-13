import useApi from 'lib/hooks/useApi';

const getWallets = async (id: number) => {

    const [api] = useApi();

    return await api.get(
        `/users/getWallets/${id}`,
    )
        .then((response) => {
            localStorage.setItem('mainWallet', response.data.mainWallet);
            localStorage.setItem('investWallet', response.data.investWallet);
            return {
                mainWallet: response.data.mainWallet,
                investWallet: response.data.investWallet
            }
        });
};

export default getWallets;
