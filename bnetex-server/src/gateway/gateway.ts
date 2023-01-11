import { OnModuleInit } from "@nestjs/common/interfaces";
import { OnGatewayDisconnect, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { MessageBody, WebSocketServer, ConnectedSocket } from "@nestjs/websockets/decorators";
import { Observable, Subject } from "rxjs";
import { Server, Socket } from "socket.io";
import { io } from "socket.io-client";
import { UsersService } from "../users/users.service";
import { SocketClientService } from "../socket/socket-client.service";

@WebSocketGateway({

})
export class MyGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketClient: SocketClientService,
        private userService: UsersService
    ) { 
        
    }

    onModuleInit() {
        console.log('aboba');
        this.socketClient.emitForcer.subscribe( async (payload: any) => {
            
            
            for (let s of this.server.of('/').sockets) {
                
                let id = Number(s[1].handshake.query.id);


                if(!id) return;

                let user = await this.userService.getUserById(id);
                

                if (user.openTrade) {
                    
                    const totalDeposit = payload.position.deposit;
                    const { roe } = payload;
                     


                    s[1].emit('currentPosition', playload)
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

        console.log(client);
        
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