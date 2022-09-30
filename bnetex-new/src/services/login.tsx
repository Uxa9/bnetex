import useApi from 'lib/hooks/useApi';

const login = async (email: string, password: string) => {

    const [api] = useApi();

    return await api.post(
        '/auth/login', {
            email: email,
            password: password,
        })
        .then((response) => {
            const userInfo = {
                token: response.data.token,
                userId: response.data.userId,
            };
            localStorage.setItem('userInfo-BNETEX', JSON.stringify(userInfo));
        });
};

export default login;
