import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import { Wallet } from "./models/wallet.model";
import {WalletNetwork} from "./models/network.model";
import {User} from "../users/users.model";

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [
      SequelizeModule.forFeature([ Wallet, WalletNetwork, User ]),
  ]
})
export class WalletModule {}
