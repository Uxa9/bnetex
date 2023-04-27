import { getUserInfo } from "./getUserInfo";
import jwt_decode from "jwt-decode";

interface TokenInfo {
    email: string | null;
    roles: {
        name: string | null,
        investPercent: number | null
    }[];
    mainWallet: number | null;
    investWallet: number | null;
    id: number | null;
    userId: number | null;
}

const defaultTokenInfo: TokenInfo = {
    email: null,
    roles: [{
        name: null,
        investPercent: null
    }],
    mainWallet: null,
    investWallet: null,
    userId: null, 
    id: null
};

export const decodeUserJwt = () => {

    const userToken = getUserInfo().token;

    if (userToken === null) return defaultTokenInfo;

    const tokenInfo = jwt_decode(userToken) as TokenInfo;
    
    if (!tokenInfo) return defaultTokenInfo;

    const response: TokenInfo = {
        email: tokenInfo.email,
        roles: tokenInfo.roles.map(role => {return {
            name: role.name,
            investPercent: role.investPercent
        }}),
        mainWallet: tokenInfo.mainWallet,
        investWallet: tokenInfo.investWallet,
        id: tokenInfo.id,
        userId: tokenInfo.id
    }

    return response;
}