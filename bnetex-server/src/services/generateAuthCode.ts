
const generateAuthCode = (length = 6, includeLetters = false) => {

    const makeLink = (length: number) => {
        var result           = '';
        var characters       = includeLetters ?
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" :
            '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
       }
       return result;
    }

    return makeLink(length);
}

export default generateAuthCode;