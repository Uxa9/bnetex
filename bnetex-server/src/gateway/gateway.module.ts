import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SocketModule } from "../socket/socket.module";
import { MyGateway } from "./gateway";
import { InvestSessionsModule } from "../invest-sessions/invest-sessions.module";

@Module({
    providers: [MyGateway],
    imports: [SocketModule, UsersModule, InvestSessionsModule]
})
export class GatewayModule {}