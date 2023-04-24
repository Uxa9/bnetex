import { getUserInfo } from 'lib/utils/getUserInfo';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

//export const socket = io(`http://socket.bnetex.com?id=${getUserInfo().userId}`);
export const socket = io(`http://localhost:5001?id=${getUserInfo().userId}`);
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;