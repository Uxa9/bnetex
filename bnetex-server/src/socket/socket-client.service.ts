import { Injectable, OnModuleInit } from "@nestjs/common";
import { Subject } from "rxjs";
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketClientService implements OnModuleInit {
    
    private socketClient: Socket;
    public emitForcer = new Subject();

    private registerConsumerEvents() {
        this.socketClient.on("connect", () => {
            console.log('connected');            
        });
        this.socketClient.on('ROE_UPDATE', (payload: any) => {
            
            this.emitForcer.next(payload);
        });
    }

    constructor() {
        this.socketClient = io('ws://localhost:3009');
    }

    onModuleInit() {
        this.registerConsumerEvents();        
    }
}