import { createContext, Dispatch, ReactNode, SetStateAction,
    useContext, useEffect, useMemo, useRef, useState } from 'react';
import { throwError } from 'lib/utils/errorThrower';
import { AvailableSocketKeys, BinanceSocketType, binanceWSEndpoint } from './types';
import { createCombinedStreamString, depthSocketMessageParser, generateSocketId,
    parseSocketMessage, tickerSocketMessageParser } from './utils';
import { getOrderBookSnapshot } from './sevices';
import { useAppDispatch } from '../useAppDispatch';
import { clearOrderBook, setOrderBook, setTradePairPrice, updateOrderBook } from 'store/action-creators/tradePair';
import { BinanceSymbol } from 'modules/TradingView/api/types';

export interface BinanceSocketContext {
    tradePair: BinanceSymbol<number> | null;
    tradePairFractionDigits?: number;

    setTradePair: Dispatch<SetStateAction<BinanceSymbol<number> | null>>;
    setSocketType: Dispatch<SetStateAction<BinanceSocketType | null>>;
}

const binanceSocketContext = createContext<BinanceSocketContext | null>(null);

export const useBinanceSocket = () => useContext(binanceSocketContext)
    ?? throwError('useBinanceSocket can be used only inside BinanceSocketProvider');

export function BinanceSocketProvider({ children }: { children: ReactNode }) {

    const dispatch = useAppDispatch();

    // хранилище сокетов нужно для корректного закрытия
    const socketMap = useRef<Map<string, WebSocket>>(new Map());
    // торговая пара - BTCUSDT, ETHUSDT, etc.
    const [tradePair, setTradePair] = useState<BinanceSymbol<number> | null>(null);
    const [socketType, setSocketType] = useState<BinanceSocketType | null>(null);

    const snapshotUpdateIdRef = useRef<number | null>(null);
    const prevDepthStreamUpdateIdRef = useRef<number | null>(null);

    // кол-во символов после запятой в tickSize
    const tradePairFractionDigits = String(tradePair?.priceFilter.tickSize).split('.').at(-1)?.length;

    // id активного сокета вынесен в переменную,
    // чтобы открывать новый сокет только при наличии
    // валидных tradePair и socketType
    const activeSocketId = useMemo(() => {
        return tradePair && socketType
            ? generateSocketId(tradePair.symbol, socketType)
            : null;
    }, [tradePair, socketType]);

    /**
     * при каждом изменении activeSocketId сначала закрываем
     * активный, затем открываем новый в соотв. с activeSocketId.
     * Активный сокет также закроется, если activeSocketId будет null
     * и пре unmount этого компонента
     */
    useEffect(() => {
        closeActiveSocket();
        activeSocketId && openSocket(activeSocketId);

        return () => closeActiveSocket();
    }, [activeSocketId]);

    const loadOrderBook = async () => {
        const { lastUpdateId, asks, bids } = await getOrderBookSnapshot(tradePair!.symbol);

        dispatch(setOrderBook(asks, bids));
        snapshotUpdateIdRef.current = lastUpdateId;
    };

    const openSocket = async (socketId: string) => {
        const socketURL = `${binanceWSEndpoint}${createCombinedStreamString(tradePair!.symbol, socketType!)}`;
        const socket = new WebSocket(socketURL);

        socket.onopen = () => {
            loadOrderBook();
        };

        socket.onerror = () => {
            closeActiveSocket();
        };

        socket.onmessage = handleSocketMessage;

        socketMap.current.set(socketId, socket);
    };

    const handleSocketMessage = (ev: MessageEvent<string>) => {
        const { stream, data } = parseSocketMessage(ev.data);

        // eslint-disable-next-line default-case
        switch (stream) {
            case AvailableSocketKeys.TICKER: {
                const { currentPrice } = tickerSocketMessageParser(data);
                dispatch(setTradePairPrice(currentPrice));
                break;
            }
            case AvailableSocketKeys.DEPTH: {
                const { asks, bids, finalUpdate, prevUpdate } = depthSocketMessageParser(data);

                // https://binance-docs.github.io/apidocs/futures/en/#diff-book-depth-streams
                if (!snapshotUpdateIdRef.current) return;
                const depthUpdateIsOutdated = finalUpdate < snapshotUpdateIdRef.current;
                if (depthUpdateIsOutdated) return;

                const isDepthStreamContinuous = prevDepthStreamUpdateIdRef.current
                    ? prevDepthStreamUpdateIdRef.current === prevUpdate
                    : true;

                if (!isDepthStreamContinuous) {
                    loadOrderBook();
                    return;
                };

                prevDepthStreamUpdateIdRef.current = finalUpdate;

                dispatch(updateOrderBook(asks, bids));

                break;
            }
        }
    };

    // закрыть текущий активный сокет (если таковой существует)
    const closeActiveSocket = () => {
        const prevSocketEntry = Array.from(socketMap.current.entries()).shift();
        if (!prevSocketEntry) return;

        const [prevSocketId, prevSocket] = prevSocketEntry;
        prevSocket.addEventListener('close', () => socketMap.current.delete(prevSocketId));
        prevSocket.close();

        snapshotUpdateIdRef.current = null;
        prevDepthStreamUpdateIdRef.current = null;

        dispatch(clearOrderBook());
    };

    return (
        <binanceSocketContext.Provider
            value={{
                tradePair,
                tradePairFractionDigits,
                setTradePair,
                setSocketType,
            }}
        >
            {children}
        </binanceSocketContext.Provider>
    );
}
