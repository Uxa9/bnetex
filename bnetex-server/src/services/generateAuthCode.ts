
const generateAuthCode = (length = 6) => {

    const makeLink = (length: number) => {
        var result           = '';
        var characters       = '0123456789';
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