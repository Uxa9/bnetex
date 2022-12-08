import { Injectable } from '@nestjs/common';
import {USDMClient} from "binance";

@Injectable()
export class InvestTradingService {

    async getUserBalance() {
        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        const result = await client.getBalance();

        return result.find(item => item.asset === "USDT");
            // .then((result) => {
            //     console.log(result.find(item => item.asset === "USDT"));
            //     return result;
            // })
            // .catch((err) => {
            //     console.error('getBalance error: ', err);
            // });

    }

    async buyLimit() {

        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        const assetPrices = await client.getMarkPrice({
            symbol: "BTCUSDT"
        });
        
        const markPrice: number = Number(assetPrices.markPrice)
        const stopLossPrice = Number(markPrice * 99.9 / 100).toFixed(2)

        await client.submitNewOrder({
            symbol: "BTCUSDT",
            side: "BUY",
            type: "MARKET",
            quantity: 0.001,
        });

        // submitNewOrder(
        //     params: NewFuturesOrderParams
        // ): Promise<NewOrderResult | NewOrderError> {
        //     this.validateOrderId(params, 'newClientOrderId');
        //     return this.postPrivate('fapi/v1/order', params);
        // }

        return;
    }

}
