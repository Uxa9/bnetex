import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Wallet} from "./models/wallet.model";
import {Network} from "./models/network.model";
import {Currency} from "./models/currency.model";
import {WalletNetwork} from "./models/walletNetwork";
import axios from "axios";
import { User } from '../users/users.model';
import { Transaction } from './models/transaction.model';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet) private walletRepository: typeof Wallet,
        @InjectModel(Network) private networkRepository: typeof Network,
        @InjectModel(Currency) private currencyRepository: typeof Currency,
        @InjectModel(WalletNetwork) private walletNetworkRepository: typeof WalletNetwork,
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Transaction) private transactionRepository: typeof Transaction
    ) {}

    async getUserWallet(userId: number) {

        let userWallet;

        userWallet = await this.walletRepository.findOne({
            where: { userId }
        });

        if (!userWallet) {
            await this.generateWallet(userId);

            userWallet = await this.walletRepository.findOne({
                where: { userId }
            });
        }

        return userWallet.walletId;
    }

    async generateWallet(userId: number, network: string = "TRC20") {
        // const walletAddress = await axios.get(`paygateway.bnetex.com/wallet/generate/${network}`);
        const walletAddress = await axios.get(`http://localhost:3800/Wallet/generate/${network}`);

        const walletNetwork = await this.networkRepository.findOne({ where: {name: network}});

        const wallet = await this.walletRepository.create({
            walletId: walletAddress.data.address,
            networkId: walletNetwork.id,    
            userId: userId
        });

        const walletMoney = await this.walletNetworkRepository.findOne({
            where: {
                walletId: wallet.id
            }
        });

        return wallet;
    }

    async generateMoneyWallet(userId: number, currency = "USDT") {
        const wallet = await this.walletRepository.findOne({
            where: {
                userId
            }
        });

        const cur = await this.currencyRepository.findOne({
            where: {
                name: currency
            }
        })

        if (!wallet) return;

        const walletMoneyCheck = this.walletNetworkRepository.findOne({
            where: {
                walletId: wallet.id,
                currencyId: cur.id
            }
        });

        if (walletMoneyCheck) return;

        return await this.walletNetworkRepository.create({
            walletId: wallet.id,
            currencyId: cur.id
        });
    }

    async acceptIncomingTransmitions(data: any) {
        if (data.length === undefined) data = [data];

        data.map(async (transmitionInfo) => {

            const wallet = await this.walletRepository.findOne({
                where: {
                    walletId : transmitionInfo.wallet
                }
            });

            if (!wallet) return;

            const network = await this.networkRepository.findByPk(wallet.networkId);

            if ( !network || network.name !== transmitionInfo.network ) return;
            if ( transmitionInfo.currency !== "USDT" ) return;

            const transaction = await this.transactionRepository.findOne({ where: {transactionId: transmitionInfo.txId}});

            if (transaction) return;
            else await this.transactionRepository.create({
                userId : wallet.userId,
                transactionId : transmitionInfo.txId,
                amount : transmitionInfo.amount
            });

            const user = await this.userRepository.findByPk(wallet.userId);

            await user.increment({
                mainWallet: transmitionInfo.amount
            });
        });
    }

    async getUserTransactions(userId: number) {
        return await this.transactionRepository.findAll({
            where: {
                userId
            }
        });
    }

}
