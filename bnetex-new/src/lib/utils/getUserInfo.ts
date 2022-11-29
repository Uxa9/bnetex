interface UserInfo {
    email: string | null;
    userId: number | null; 
    token: string | null;
}

const defaultUserInfo: UserInfo = {
    email: null,
    userId: null,
    token: null,
};

export const getUserInfo = () => {
    const userInfo: string | null = localStorage.getItem('userInfo-BNETEX');
    return userInfo ? JSON.parse(userInfo) as UserInfo : defaultUserInfo;
};
