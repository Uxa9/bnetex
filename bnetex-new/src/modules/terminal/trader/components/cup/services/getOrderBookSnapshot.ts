import axios from "axios";

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

export const getOrderBookSnapshot = async (pair: string | undefined = "BTCUSDT", step: number | undefined = 0.1) => {
    const res = await axios.get(`https://fapi.binance.com/fapi/v1/depth?symbol=${pair?.toLocaleLowerCase()}&limit=1000`);

    const asks: string[][] = res.data.asks.reverse();
    const bids: string[][] = res.data.bids.reverse();

    const orderBook = asks.concat(bids.reverse());

    if (step === 0.1) return orderBook;

    const tick = parseInt((step / 0.1).toFixed(2), 10);

    return convertPricesByTick(orderBook, tick);
};