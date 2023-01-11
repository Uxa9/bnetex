import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SocketModule } from "../socket/socket.module";
import { MyGateway } from "./gateway";

@Module({
    providers: [MyGateway],
    imports: [SocketModule, UsersModule]
})
export class GatewayModule {}