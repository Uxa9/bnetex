import { Injectable } from '@nestjs/common';
import {USDMClient} from "binance";
import { UsersService } from '../users/users.service';

@Injectable()
export class InvestTradingService {

    constructor (
        private userService: UsersService
    ) {}

    async getUserBalance(id: number) {

        const user = await this.userService.getUserById(id);
        
        // get user keys
        const client = new USDMClient({
            api_key: user.api_key,
            api_secret: user.api_secret,
        });

        const result = await client.getBalance();

        return result.find(item => item.asset === "USDT").availableBalance;
    }

    async getLeverageAndIsolated(id: number) {
        const user = await this.userService.getUserById(id);

        // get user keys
        const client = new USDMClient({
            api_key: user.api_key,
            api_secret: user.api_secret,
        });

        const info = await client.getAccountInformation();

        const coinInfo = info.positions.find(item => item.symbol === "BTCUSDT");

        return {
            leverage : coinInfo.leverage,
            isolated : coinInfo.isolated
        };
    }

    async placeOrder(params: any) {
        const user = await this.userService.getUserById(params.id);

        const client = new USDMClient({
            api_key: user.api_key,
            api_secret: user.api_secret,
        });

        const assetPrices = await client.getMarkPrice({
            symbol: params.pair
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
                    symbol: params.pair,
                    side: params.side,
                    type: params.type,
                    quantity: Number(amount.toFixed(3)),
                });
            }

            if (params.type === "LIMIT") {
                await client.submitNewOrder({
                    symbol: params.pair,
                    side: params.side,
                    type: params.type,
                    price: params.price,
                    timeInForce: params.tif || "GTC",
                    quantity: Number((params.amount / params.price).toFixed(3))
                }).catch((e) => {
                    return e;
                });
            }

            return;
        }
        catch (e) {
            return e;
        }
    }

    async getMaxLeverage(id: number) {
        const user = await this.userService.getUserById(id);

        const client = new USDMClient({
            api_key: user.api_key,
            api_secret: user.api_secret,
        });

        return await client.getNotionalAndLeverageBrackets({
            symbol: "BTCUSDT"
        });
    }

    async setUserLeverage(params: any) {
       const user = await this.userService.getUserById(params.id);
        
        const client = new USDMClient({
            api_key: user.api_key,
            api_secret: user.api_secret,
        });

        return await client.setLeverage({
            leverage: params.lever,
            symbol: "BTCUSDT"
        });
    }

    async getUserPositions(id: number) {
        const user = await this.userService.getUserById(id);

        const client = new USDMClient({
            api_key: user.api_key,
            api_secret: user.api_secret,
        });

        // const a = await client.getAccountInformation()

        // return a.positions
        // console.log(a.positions.filter(item => item.symbol === "BTCUSDT"));
        
        return Promise.all([
        //     // client.getAllOpenOrders(),
            client.getPositions(),
            client.getAccountInformation()
        ]).then(([/*orders,*/ positions, info]) => {     
            // console.log(info);
            const pos = positions.filter(item => item.entryPrice !== '0.0');
            const inf = info.positions.filter(item => item.entryPrice !== '0.0');
            // console.log(pos);
            // console.log(inf);
            
            return {
                // orders,
                pos,
                inf
            }
        });
    }

    async closeAllPositions(id: number) {
        const user = await this.userService.getUserById(id);

        const client = new USDMClient({
            api_key: user.api_key,
            api_secret: user.api_secret,
        });

        const positions = await client.getPositions();

        positions.map(async (item) => {
            const amount = Number(item.positionAmt);

            if (amount === 0) return;

            if (amount > 0) {
                client.submitNewOrder({
                    symbol: item.symbol,
                    side: "SELL",
                    type: "MARKET",
                    quantity: amount
                }).then().catch(err => console.log(err));
            } else {
                client.submitNewOrder({
                    symbol: item.symbol,
                    side: "BUY",
                    type: "MARKET",
                    quantity: amount*-1,
                }).then().catch(err => console.log(err));
            }
        });
    }

    async test() {
        const client = new USDMClient({
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
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











