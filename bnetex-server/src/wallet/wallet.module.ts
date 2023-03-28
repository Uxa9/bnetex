import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import { Wallet } from "./models/wallet.model";
import {User} from "../users/users.model";
import { WalletNetwork } from './models/walletNetwork.model';
import { Network } from './models/network.model';
import { Currency } from './models/currency.model';
import { Transaction } from './models/transaction.model';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [
      SequelizeModule.forFeature([ Wallet, WalletNetwork, Network, Currency, User, Transaction ]),
  ]
})
export class WalletModule {}
