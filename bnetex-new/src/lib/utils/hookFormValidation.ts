import { RegisterOptions } from 'react-hook-form';

export const requiredValidation: RegisterOptions = {
    required: {
        value: true,
        message: 'Необходимо заполнить поле',
    },
};

export const MIN_PASSWORD_LENGTH = 8;

export const newPasswordValidation: RegisterOptions = {
    validate: {
        atleastEightCharacters: value => value.length >= MIN_PASSWORD_LENGTH,
        atleastOneDigit: value => /\d/.test(value),
        atleastOneUppercase: value => /[A-ZА-Я]/.test(value),
    },
    ...requiredValidation,
};

export const emailValidation: RegisterOptions = {
    pattern: {
        value: /^[A-Za-z0-9+_.-]+@(.+)$/,
        message: 'Неверный email',
    },
    ...requiredValidation,
};

export const numberValidation: RegisterOptions = {
    valueAsNumber: true,
    ...requiredValidation,
};

