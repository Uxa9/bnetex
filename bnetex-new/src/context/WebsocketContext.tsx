import { decodeUserJwt } from 'lib/utils/decodeJwt';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io(`https://socket.bnetex.com?id=${decodeUserJwt().userId}`, {
    transports: ["websocket", "polling"] // use WebSocket first, if available
});
// export const socket = io(`http://localhost:5001?id=${decodeUserJwt().userId}`, {
//     transports: ["websocket", "polling"] // use WebSocket first, if available
// });
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;