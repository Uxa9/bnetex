import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import { Wallets } from "./wallet.model";
import {WalletNetwork} from "./network.model";

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [
      SequelizeModule.forFeature([ Wallets, WalletNetwork ]),
  ]
})
export class WalletModule {}
