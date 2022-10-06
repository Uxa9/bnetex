import useApi from 'lib/hooks/useApi';

const login = async (email: string, password: string) => {

    const [api] = useApi();

    return await api.post(
        '/auth/login', {
            email: email,
            password: password,
        })
        .then((response) => {
            function parseJwt (token: string) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            
                return JSON.parse(jsonPayload);
            };

            const user = parseJwt(response.data.token);

            const userInfo = {
                token: response.data.token,
                userId: user.id,
                mainWallet: user.mainWallet,
                investWallet: user.investWallet
            };
            localStorage.setItem('userInfo-BNETEX', JSON.stringify(userInfo));
            localStorage.setItem('mainWallet', user.mainWallet);
            localStorage.setItem('investWallet', user.investWallet);
        });
};

export default login;
