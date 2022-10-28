export const pad = (value: number | string, desiredLength: number): string => {
    const parseValue = String(value);
    const lengthDifference = parseValue.length - desiredLength;

    return lengthDifference <= 0 ? '0'.repeat(Math.abs(lengthDifference)).concat(parseValue) : parseValue;
};
