import useApi from 'lib/hooks/useApi';

const getTVData = async () => {

    const { api } = useApi();

    return await api.post('/positions/getTVData',
        {}
    )
        .then((response) => {
            return response.data;
        });
};

export default getTVData;
