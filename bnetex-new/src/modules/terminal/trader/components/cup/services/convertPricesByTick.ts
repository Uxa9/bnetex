export const convertPricesByTick = (array: string[][], tick: number): string[][] => {
    const convertedArray: string[][] = [];
    const orderBookStep = tick * 0.01;

    for (let i = 0; i < array.length; i += tick) {
        const slicedValues = array.slice(i, tick + i);

        const volumeSum = slicedValues.reduce((acc: number, item: string[]) => {
            return acc + parseFloat(item[1]);
        }, 0);
        const medianPrice = Math.floor(parseInt(slicedValues[0][0], 10) / orderBookStep) * orderBookStep;

        convertedArray.push([medianPrice.toFixed(2), volumeSum.toFixed(4)]);
    }

    return convertedArray;
};
