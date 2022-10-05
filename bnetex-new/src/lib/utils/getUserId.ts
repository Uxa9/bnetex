export const getUserId = () => {
    const userInfo = localStorage.getItem('userInfo-BNETEX');
    return userInfo ? Number(JSON.parse(userInfo).userId) : '';
};
