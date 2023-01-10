import variablesMap from 'styles/exportedVariables.module.scss';

enum VariableKeys {
    HEADER_HEIGHT = 'HEADER_HEIGHT',
    DEFAULT_TRANSITION = 'DEFAULT_TRANSITION',
    LAPTOP_BP = 'LAPTOP_BP',
    MOBILE_BP = 'MOBILE_BP',
    EARLY_MOBILE_BP = 'EARLY_MOBILE_BP',
}

type VariableKey = keyof typeof VariableKeys

/**
 * Возвращает переменную из exportedVariables.module.scss, обрезая
 * все нечисловые значения (px, ms и др.) и кастуя полученную строку в number
 * @param variable – имя переменной
 * @returns
 */

const getCssVariable = (variable: VariableKey): number => {
    return Number(variablesMap[variable].replace(/[^\d]+/, ''));
};

export default getCssVariable;
