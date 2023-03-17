import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Wallet} from "./models/wallet.model";
import {Network} from "./models/network.model";
import {Currency} from "./models/currency.model";
import {WalletNetwork} from "./models/walletNetwork";
import axios from "axios";

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet) private walletRepository: typeof Wallet,
        @InjectModel(Network) private networkRepository: typeof Network,
        @InjectModel(Currency) private currencyRepository: typeof Currency,
        @InjectModel(WalletNetwork) private walletNetworkRepository: typeof WalletNetwork,
    ) {}

    async generateWallet(userId: number, network: string = "TRC20") {
        const walletAddress = await axios.get(`paygateway.bnetex.com/wallet/generate/${network}`);

        const walletNetwork = await this.networkRepository.findOne({ where: {name: network}});

        const wallet = await this.walletRepository.create({
            walletId: walletAddress.data.address,
            userId: userId
        });

        await this.walletNetworkRepository.create({
            walletId: wallet.id,
            networkId: walletNetwork.id
        });
    }

    async acceptIncomingTransmitions(data: any) {
        if (data.length === undefined) data = [data];

        data.map(transmitionInfo => {
            this.
        });
    }

}
