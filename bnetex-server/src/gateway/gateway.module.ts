import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SocketModule } from "../socket/socket.module";
import { MyGateway } from "./gateway";
import { InvestSessionsModule } from "../invest-sessions/invest-sessions.module";
import { InvestTradingModule } from "../invest-trading/invest-trading.module";

@Module({
    providers: [MyGateway],
    imports: [SocketModule, UsersModule, InvestSessionsModule, InvestTradingModule]
})
export class GatewayModule {}