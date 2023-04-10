const reducedNumberPostfixArray = ['', 'k', 'M', 'B', 'T'];

export const reduceNumber = (value: number, fixDecimal = 0): string => {
    let iterator = 0;

    while (value / 1000 > 1) {
        value /= 1000;
        iterator++;
    }

    const fixedValue = fixDecimal ? value.toFixed(fixDecimal) : value ;

    return `${fixedValue}${reducedNumberPostfixArray[iterator]}`;
};
