export const getToken = () => {
    const userInfo = localStorage.getItem('userInfo-BNETEX');
    return userInfo ? JSON.parse(userInfo).token : '';
};
