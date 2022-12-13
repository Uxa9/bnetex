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
    }

    async getLeverageAndIsolated(id: number) {
        // const user = this.userService.getUserById(id);

        // get user keys
        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        const info = await client.getAccountInformation();

        const coinInfo = info.positions.find(item => item.symbol === "BTCUSDT");

        return {
            leverage : coinInfo.leverage,
            isolated : coinInfo.isolated
        };
    }

    async placeOrder(params: any) {

        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        const assetPrices = await client.getMarkPrice({
            symbol: "BTCUSDT"
        });

        let markPrice = 0;

        if (Array.isArray(assetPrices)) {
            markPrice = Number(assetPrices[0].markPrice);
        } else {
            markPrice = Number(assetPrices.markPrice);
        }

        const amount = params.amount / markPrice;

        try {
            if (params.type === "MARKET") {
                await client.submitNewOrder({
                    symbol: "BTCUSDT",
                    side: params.side,
                    type: params.type,
                    quantity: Number(amount.toFixed(3)),
                });
            }

            if (params.type === "LIMIT") {
                await client.submitNewOrder({
                    symbol: "BTCUSDT",
                    side: params.side,
                    type: params.type,
                    price: params.price,
                    timeInForce: params.tif || "GTC",
                    quantity: Number((params.amount / params.price).toFixed(3)),
                });
            }

            return;
        }
        catch (e) {
            throw e;
        }
    }

    async getMaxLeverage(id: number) {
        // const user = this.userService.getUserById(id);

        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        return await client.getNotionalAndLeverageBrackets({
            symbol: "BTCUSDT"
        });
    }

    async setUserLeverage(params: any) {
        // const user = this.userService.getUserById(params.id);
        
        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        return await client.setLeverage({
            leverage: params.lever,
            symbol: "BTCUSDT"
        });
    }

    async getUserPositions(id: number) {
        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        const a = await client.getAccountInformation()

        return a.positions
        // console.log(a.positions.filter(item => item.symbol === "BTCUSDT"));
        
        // return Promise.all([
        //     // client.getAllOpenOrders(),
        //     // client.getPositions()
        //     client.getAccountInformation()
        // ]).then(([/*orders,*/ info]) => {     
        //     console.log(info);
                   
        //     return {
        //         // orders,
        //         info
        //     }
        // });
    }

    async closeAllPositions(id: number) {
        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        const positions = await client.getPositions();

        const amount = Number(positions.find(item => item.symbol === "BTCUSDT").positionAmt);

        if ( amount > 0) {
            await client.submitNewOrder({
                symbol: "BTCUSDT",
                side: "SELL",
                type: "MARKET",
                quantity: amount,
            });
        } else {
                        
            await client.submitNewOrder({
                symbol: "BTCUSDT",
                side: "BUY",
                type: "MARKET",
                quantity: amount*-1,
            });
        }
    }

    async test() {
        const client = new USDMClient({
            api_key: "qV8uFbOk1cvhNvAhuayRJ4HNMxjtfNX8rn0ucBQueV9zJ2bbMAHSbujR6hzbiZFS",
            api_secret: "egMlLmKtMQSCnlveSMVDXBBaSkxWidZbpvfgKBbpAFojolBOK3Mi1nqWXw7bbGbA",
        });

        return Promise.all([
            client.getAllOpenOrders(),
            client.getPositions()
        ]).then(([orders, positions]) => {
            return {
                orders,
                positions
            }
        });
    }
}











