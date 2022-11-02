import useApi from 'lib/hooks/useApi';

const getRoE = async (id: number) => {

    const [api] = useApi();

    return await api.post(
        '/users/getroe', {
            userId: id,
        }
    )
        .then((response) => {
            return {
                dates: response.data.roe.dates,
                values: response.data.roe.values,
            };
        });
};

export default getRoE;
