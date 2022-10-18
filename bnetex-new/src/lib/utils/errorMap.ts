const errorDictionary:{[key: string]: string} = {
    USER_NOT_FOUND: 'Пользователь с таким email не найден',
    USER_WITH_THIS_EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже зарегистрирован',
    WRONG_PASSWORD: 'Неверный логин или пароль',
    USER_NOT_ACTIVATED: 'Ваш аккаунт не активирован',
};


export const mapError = (error: string) => {
    return errorDictionary.hasOwnProperty(error) ? errorDictionary[error] : error;
};
