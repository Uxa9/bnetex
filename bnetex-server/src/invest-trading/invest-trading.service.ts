import { Injectable } from '@nestjs/common';
import {USDMClient} from "binance";
import { UsersService } from '../users/users.service';

@Injectable()
export class InvestTradingService {

    constructor (
        private userService: UsersService
    ) {}

    async getUserBalance(id: number) {

        const user = this.userService.getUserById(id);
        
        // get user keys
        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        const result = await client.getBalance();

        return result.find(item => item.asset === "USDT").availableBalance;
            // .then((result) => {
            //     console.log(result.find(item => item.asset === "USDT"));
            //     return result;
            // })
            // .catch((err) => {
            //     console.error('getBalance error: ', err);
            // });

    }

    async buyLimit(params: any) {

        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });
console.log(params);

        const assetPrices = await client.getMarkPrice({
            symbol: "BTCUSDT"
        });
        console.log(assetPrices);
        
        const markPrice: number = Number(assetPrices.markPrice);

        const amount = params.amount / markPrice;
        console.log(amount);

        await client.submitNewOrder({
            symbol: "BTCUSDT",
            side: params.side,
            type: params.type,
            quantity: Number(amount.toFixed(3)),
        });

        return;
    }

}
