import { AppColorsArray } from 'lib/types/appColors';

export const colorIndexMap = (className: string, index: number) => {
    return `${className}--${AppColorsArray[index]}`;
};
