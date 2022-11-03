import useApi from 'lib/hooks/useApi';

const getPnL = async (id: number) => {

    const [api] = useApi();

    return await api.post(
        '/users/getpnl', {
            userId: id,
        }
    )
        .then((response) => {
            return {
                dates: response.data.pnl.dates,
                values: response.data.pnl.values,
            };
        });
};

export default getPnL;
