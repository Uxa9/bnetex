import useApi from 'lib/hooks/useApi';
import { getToken } from './utils/getToken';

const useAuthActions = () => {

    const [ api ] = useApi();

    const login = async (email: string, password: string) => {
        return await api.post(
            '/auth/login', {
                email: email,
                password: password,
            })
            .then((response) => {
                function parseJwt (token: string) {
                    let base64Url = token.split('.')[1];
                    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                
                    return JSON.parse(jsonPayload);
                };
    
                const user = parseJwt(response.data.token);
    
                const userInfo = {
                    token: response.data.token,
                    userId: user.id,
                    mainWallet: user.mainWallet,
                    investWallet: user.investWallet,
                };
                localStorage.setItem('userInfo-BNETEX', JSON.stringify(userInfo));
                localStorage.setItem('mainWallet', user.mainWallet);
                localStorage.setItem('investWallet', user.investWallet);
            })
            .finally(() => {
                localStorage.setItem('userEmail', email);
            })
        ;
    };

    const signup = async (email: string, password: string) => {
        return await api.post(
            '/auth/registration', {
                email: email,
                password: password,
            })
            .then(() => {
                localStorage.setItem('userEmail', email);
            });
    };

    const confirmEmail = async (email: string, activationCode: string ) => {
        return await api.post(
            '/auth/confirm-email', {
                email: email,
                activationCode: activationCode,
            })
            .then(() => {
                // Костыль. Нужно добавить юзеру поле justRegistered. При успешной активации почты ставить
                // его в true. Затем, при открытии страницы RegistrationFinalize отправлять запрос на 
                // установку поля в true
                localStorage.setItem('justRegistered', 'true');
            });
    };

    const resendActivationCode = async (email: string) => {
        return await api.post(
            '/auth/resend-activation-link', {
                email: email,
            });
    };

    const checkActivationCodeTime = async (email: string) => {
        return await api.post(
            '/auth/activattion-link-datetime', {
                email: email,
            });
    };

    const verifyToken = async () => {
        return await api.post(
            '/auth/token/verify', {
                token: getToken(),
            });
    };

    return { login, signup, confirmEmail, resendActivationCode, checkActivationCodeTime, verifyToken };
};

export default useAuthActions;
