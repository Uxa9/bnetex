const errorDictionary:{[key: string]: string} = {
    USER_NOT_FOUND: 'Пользователь с таким email не найден',
    USER_WITH_THIS_EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже зарегистрирован',
    // WRONG_PASSWORD: 'Неверный логин или пароль',
    USER_NOT_ACTIVATED: 'Ваш аккаунт не активирован',
    WRONG_CODE: 'Неверный код подтверждения',
    ERROR_WHILE_SEND_MAIL_CHECK_EMAIL_ADDRESS: 'Ошибка при отправке сообщения, попробуйте позже',
    WRONG_PASSWORD: 'Неврный пароль',
    AUTH_CODE_REQUIRED_TOO_MANY_TIMES: 'Рано', // Че тут писать то 
    SERVER_FAILURE: 'Ошибка сервера, попробуйте позже',
};


export const mapError = (error: string) => {
    return errorDictionary.hasOwnProperty(error) ? errorDictionary[error] : error;
};
