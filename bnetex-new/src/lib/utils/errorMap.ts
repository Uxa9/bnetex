const errorDictionary:{[key: string]: string} = {
    USER_NOT_FOUND: 'Пользователь с таким email не найден',
};


export const mapError = (error: string) => {
    return errorDictionary.hasOwnProperty(error) ? errorDictionary[error] : error;
};
