import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import { Wallet } from "./models/wallet.model";
import {User} from "../users/users.model";
import { WalletNetwork } from './models/walletNetwork';
import { Network } from './models/network.model';
import { Currency } from './models/currency.model';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [
      SequelizeModule.forFeature([ Wallet, WalletNetwork, Network, Currency, User ]),
  ]
})
export class WalletModule {}
