import { Bar, LibrarySymbolInfo, SubscribeBarsCallback } from 'charting_library/charting_library';
import { UUID } from 'lib/types/uuid';
import { availableIntervals, TVInterval } from './types';

const socketMap = new Map<UUID, WebSocket>();

// открыть сокет по тикеру и интервалу времени
// toDo: багают интервалы

export function subscribeOnStream (
    symbolInfo: LibrarySymbolInfo,
    resolution: TVInterval,
    listenerGuid: UUID,
    onTick: SubscribeBarsCallback
) {

    // сокет с таким id уже открыт, новый открывать не нужно
    if (socketMap.get(listenerGuid)?.readyState === WebSocket.OPEN) {
        return;
    };

    const interval = availableIntervals[resolution];
    const ticker = symbolInfo.name?.toLowerCase();

    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${ticker}@kline_${interval}`);

    socket.onmessage = (event: MessageEvent) => {
        const binanceTickerData = JSON.parse(event.data);
        const candle = parseCandle(binanceTickerData);
        onTick(candle);
    };

    socketMap.set(listenerGuid, socket);
}

// распарсить свечку из данных бинанса
const parseCandle = (data: any): Bar => {
    const kline = data.k;
    return {
        time: data.E,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
        volume: parseFloat(kline.v),
    };
};

// закрыть сокет по его id
export function unsubscribeFromStream(listenerGuid: UUID) {
    socketMap.get(listenerGuid)?.close();
}
