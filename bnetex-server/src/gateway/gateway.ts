import { OnModuleInit } from "@nestjs/common/interfaces";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, WebSocketServer } from "@nestjs/websockets/decorators";
import { Server } from "socket.io";
import { WebSocket } from "ws";

@WebSocketGateway({

})
export class MyGateway implements OnModuleInit {

    private ws = new WebSocket("ws://localhost:3009");

    constructor() {
        this.ws.addEventListener("open", () => {
            this.ws.send("ROE_UPDATE");
            console.log('established connection to bnetex bot');
        });

        this.ws.addEventListener("message", (result) => {
            console.log(result);            
        });

        this.ws.addEventListener("error", (err) => {
            console.log(err);
            
        });
    }

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('Client connected');                        
        });
                
    }

    @SubscribeMessage('currentPosition')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        
        this.server.emit('currentPosition', {
            msg: 'Aboba',
            content: {
                position: {}
            }
        });
    }
}