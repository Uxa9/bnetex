import { createContext, Dispatch, ReactNode, SetStateAction,
    useContext, useEffect, useMemo, useRef, useState } from 'react';
import { throwError } from 'lib/utils/errorThrower';
import { AvailableSocketKeys, BinanceSocketType, binanceWSEndpoint } from './types';
import { createCombinedStreamString, depthSocketMessageParser, generateSocketId,
    parseSocketMessage, tickerSocketMessageParser } from './utils';
import { getOrderBookSnapshot } from './sevices';

export interface BinanceSocketContext {
    loading: boolean;
    tradePair: string | null;

    setTradePair: Dispatch<SetStateAction<string | null>>;
    setSocketType: Dispatch<SetStateAction<BinanceSocketType | null>>;
}

const binanceSocketContext = createContext<BinanceSocketContext | null>(null);

export const useBinanceSocket = () => useContext(binanceSocketContext)
    ?? throwError('useBinanceSocket can be used only inside BinanceSocketProvider');

export function BinanceSocketProvider({children}: {children: ReactNode}) {

    // хранилище сокетов нужно для корректного закрытия
    const socketMap = useRef<Map<string, WebSocket>>(new Map());
    // торговая пара - BTCUSDT, ETHUSDT, etc.
    const [tradePair, setTradePair] = useState<string | null>(null);
    const [socketType, setSocketType] = useState<BinanceSocketType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const snapshotUpdateIdRef = useRef<number | null>(null);
    const prevDepthStreamUpdateIdRef = useRef<number | null>(null);

    // id активного сокета вынесен в переменную,
    // чтобы открывать новый сокет только при наличии
    // валидных tradePair и socketType
    const activeSocketId = useMemo(() => {
        console.log(tradePair);

        return tradePair && socketType
            ? generateSocketId(tradePair, socketType)
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
        const { lastUpdateId, asks, bids } = await getOrderBookSnapshot(tradePair!);
        console.log('snapshot', asks, bids);

        snapshotUpdateIdRef.current = lastUpdateId;
    };

    const openSocket = async (socketId: string) => {
        setLoading(true);

        const socketURL = `${binanceWSEndpoint}${createCombinedStreamString(tradePair!, socketType!)}`;
        const socket = new WebSocket(socketURL);

        socket.onopen = () => {
            loadOrderBook();
            setLoading(false);
        };

        socket.onerror = (e: Event) => {
            console.error(e); //toDo: bakeToast???
            closeActiveSocket();
            setLoading(false);
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
                // console.log(currentPrice);
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

                if (!isDepthStreamContinuous) loadOrderBook();

                prevDepthStreamUpdateIdRef.current = finalUpdate;

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
    };

    return (
        <binanceSocketContext.Provider
            value={{
                loading,
                tradePair,
                setTradePair,
                setSocketType,
            }}
        >
            {children}
        </binanceSocketContext.Provider>
    );
}
