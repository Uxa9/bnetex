import { OnModuleInit } from "@nestjs/common/interfaces";
import { OnGatewayDisconnect, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { MessageBody, WebSocketServer, ConnectedSocket } from "@nestjs/websockets/decorators";
import { Observable, Subject } from "rxjs";
import { Server, Socket } from "socket.io";
import { io } from "socket.io-client";
import { UsersService } from "../users/users.service";
import { SocketClientService } from "../socket/socket-client.service";
import moment from "moment";
import { InvestSessionsService } from "../invest-sessions/invest-sessions.service";

@WebSocketGateway({
    cors: true
})
export class MyGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketClient: SocketClientService,
        private userService: UsersService,
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
                            markPrice: payload.position.averagePrice,
                            margin: "я бля хуй знает что сюда надо"
                        })
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

            //socket.emit('currentPosition', socket.handshake.query.id);
             
            // this.server.emit('currentPosition', {
            //     payload
            // });
        });
    }

    // init(){
        
    // }
    


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

    handleDisconnect(client: any) {        
        console.log('Client disconnected');
    }

    // @SubscribeMessage('currentPosition')
    // onNewMessage(@MessageBody() body: unknown): Observable<WsResponse<any>> {
    //     console.log(body);

    //     this.server.emit('currentPosition', {
    //         position: this.socketClient.currentPosition
    //     });
    //     console.log(this.socketClient.currentPosition);


    //     return this.socketClient.currentPosition;
    // }
}