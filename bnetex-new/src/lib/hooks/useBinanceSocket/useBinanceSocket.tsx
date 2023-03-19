import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { throwError } from 'lib/utils/errorThrower';
import { BinanceSocketType, binanceWSEndpoint, UnparsedSocketMessage } from './types';
import { createCombinedStreamString, generateSocketId, parseSocketMessage } from './utils';
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

    // id активного сокета вынесен в переменную,
    // чтобы открывать новый сокет только при наличии
    // валидных tradePair и socketType
    const activeSocketId = useMemo(() => {
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
        console.log(lastUpdateId);

    };

    const openSocket = async (socketId: string) => {
        setLoading(true);

        loadOrderBook();

        const socketURL = `${binanceWSEndpoint}${createCombinedStreamString(tradePair!, socketType!)}`;
        const socket = new WebSocket(socketURL);

        socket.onopen = () => setLoading(false);

        socket.onerror = (e: Event) => {
            console.error(e); //toDo: bakeToast???
            closeActiveSocket();
            setLoading(false);
        };

        socket.onmessage = (ev: MessageEvent<string>) => {
            const message = parseSocketMessage(ev.data);
        };

        socketMap.current.set(socketId, socket);
    };

    // закрыть текущий активный сокет (если таковой существует)
    const closeActiveSocket = () => {
        const prevSocketEntry = Array.from(socketMap.current.entries()).shift();
        if (!prevSocketEntry) return;

        const [prevSocketId, prevSocket] = prevSocketEntry;
        prevSocket.addEventListener('close', () => socketMap.current.delete(prevSocketId));
        prevSocket.close();
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
