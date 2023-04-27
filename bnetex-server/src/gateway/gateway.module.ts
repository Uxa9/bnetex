import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SocketModule } from "../socket/socket.module";
import { MyGateway } from "./gateway";
import { InvestSessionsModule } from "../invest-sessions/invest-sessions.module";
import { InvestTradingModule } from "../invest-trading/invest-trading.module";
import { SocketClientService } from "src/socket/socket-client.service";

@Module({
    providers: [MyGateway, SocketClientService],
    imports: [SocketModule, UsersModule, InvestSessionsModule, InvestTradingModule]
})
export class GatewayModule {}