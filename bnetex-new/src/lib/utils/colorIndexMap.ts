// toDo: надо как то доставать цвета из палитры...
const colors = ['accent', 'blue', 'orange', 'green', 'red'];

export const colorIndexMap = (className: string, index: number) => {
    return `${className}--${colors[index]}`;
};
