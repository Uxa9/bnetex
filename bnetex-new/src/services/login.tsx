import useApi from 'lib/hooks/useApi';

const login = async (email: string, password: string) => {

    const [api] = useApi();

    return await api.post(
        '/auth/login', {
            email: email,
            password: password,
        });
};

export default login;
