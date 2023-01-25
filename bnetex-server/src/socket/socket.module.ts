import { Module } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { SocketClientService } from "./socket-client.service";

@Module({
    providers: [SocketClientService],
    exports: [SocketClientService],
    imports: []
})
export class SocketModule {}