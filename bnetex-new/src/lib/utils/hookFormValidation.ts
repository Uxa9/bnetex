import { RegisterOptions } from 'react-hook-form';

export const requiredValidation: RegisterOptions = {
    required: {
        value: true,
        message: 'Необходимо заполнить поле',
    },
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

