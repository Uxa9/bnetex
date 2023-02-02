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
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
        });

        const result = await client.getBalance();

        return result.find(item => item.asset === "USDT").availableBalance;
    }

    async getLeverageAndIsolated(id: number) {
        // const user = this.userService.getUserById(id);

        // get user keys
        const client = new USDMClient({
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
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
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
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
        // const user = this.userService.getUserById(id);

        const client = new USDMClient({
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
        });

        return await client.getNotionalAndLeverageBrackets({
            symbol: "BTCUSDT"
        });
    }

    async setUserLeverage(params: any) {
        // const user = this.userService.getUserById(params.id);
        
        const client = new USDMClient({
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
        });

        return await client.setLeverage({
            leverage: params.lever,
            symbol: "BTCUSDT"
        });
    }

    async getUserPositions(id: number) {
        const client = new USDMClient({
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
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
            const pos = positions.filter(item => item.symbol === "BTCUSDT");
            const inf = info.positions.filter(item => item.symbol === "BTCUSDT");
            // console.log(pos);
            // console.log(inf);
            
            return {
                // orders,
                pos : pos[0],
                inf : inf[0]
            }
        });
    }

    async closeAllPositions(id: number) {
        const client = new USDMClient({
            api_key: "ZJAPDwq3dn47W0syHdqkmpwJGuyLkAUZ7ORRK9TBEYcvtxB5AWySJLcPsjDIoE4d",
            api_secret: "hJ3eYDeVepnpuVcNi7GHiXmym7BLltuFGvCiV71ya2p5HPbe863lF9aBybwz2YcA",
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











