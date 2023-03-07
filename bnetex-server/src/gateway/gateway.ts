import { OnModuleInit } from "@nestjs/common/interfaces";
import { OnGatewayDisconnect, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { MessageBody, WebSocketServer, ConnectedSocket } from "@nestjs/websockets/decorators";
import { from, map, Observable, Subject } from "rxjs";
import { Server, Socket } from "socket.io";
import { io } from "socket.io-client";
import { UsersService } from "../users/users.service";
import { SocketClientService } from "../socket/socket-client.service";
import moment from "moment";
import { InvestSessionsService } from "../invest-sessions/invest-sessions.service";
import { InvestTradingService } from "../invest-trading/invest-trading.service";

const PORT = Number(process.env.SOCKET_PORT) || 5001;

@WebSocketGateway(PORT, {
    cors: true
})
export class MyGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketClient: SocketClientService,
        private userService: UsersService,
        private investTradingService: InvestTradingService,
        private investSessionService: InvestSessionsService
    ) { 
        
    }

    onModuleInit() {
        this.socketClient.emitForcer.subscribe( async (payload: any) => {           
            
            for (let s of this.server.of('/').sockets) {
                
                let id = Number(s[1].handshake.query.id);

                if(!id) return;

                let user = await this.userService.getUserById(id);                

                if (user.openTrade) {

                    const userSession = await this.investSessionService.getUserActiveSession(id);                    

                    if (
                        new Date(payload.position.enterTime).getTime() > 
                        new Date(userSession.startSessionTime).getTime()) {
                        const totalDeposit = payload.position.deposit;
                        const { roe } = payload;
                        
                        const userPartition = user.tradeBalance / totalDeposit * 100;
                        const userPnl = userPartition * (1 + Number(roe) / 100) - userPartition;
                        
                        s[1].emit('currentPosition', {
                            userPnl,
                            userRoe: roe,
                            pair: payload.pair,
                            volume: payload.position.volumeUSDT,
                            entryPrice: payload.position.averagePrice,
                            markPrice: payload.markPrice,
                            margin: "я бля хуй знает что сюда надо"
                        });

                    } else {                        
                        s[1].emit('currentPosition', {
                            msg: "no active positions"
                        })
                    }
                } else {
                    s[1].emit('currentPosition', {
                        msg: "user not trading"
                    })
                }
                                
            }
        });
    }

    @WebSocketServer()
    server: Server;

    handleConnection(client: any, ...args: any[]): any {        
        console.log('Client connected');
    }

    @SubscribeMessage('join')
    onJoin(
        @MessageBody() message: any,
        @ConnectedSocket() socket: Socket
    ) {
        socket.join(socket.handshake.query.id);
    }

    @SubscribeMessage('currentPosition')
    onNewMessage(
        @MessageBody() message: any,
        @ConnectedSocket() socket: Socket
    ) {        

    }

    @SubscribeMessage('userTraderPosition')
    userPosition(
        @MessageBody() message: any,
        @ConnectedSocket() socket: Socket
    ) {     
        try {
            for (let s of this.server.of('/').sockets) {
  
                let id = Number(s[1].handshake.query.id);
    
                if(!id) return;         
                
                const callbackFunc = async () => {
                    try {
                        const result = await this.investTradingService.getUserPositions(id);
                        
                        s[1].emit('currentUserTradePosition', result);
                    } catch (error) {
                        console.log(error);
                        
                    }
    
                }
    
                setInterval(callbackFunc, 1000);                            
            }
        }
        catch (err) {
            console.log(err);
            
        }
    }

    handleDisconnect(client: any) {        
        console.log('Client disconnected');
    }
}