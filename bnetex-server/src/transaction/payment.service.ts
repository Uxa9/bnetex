import { DataType, Sequelize } from "sequelize-typescript";
import axios from 'axios';

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "db.sqlite",
});


// const Payment = sequelize.define("Payment", {
//     orderid: {
//       type: DataType.STRING,
//     },
// });

const api = axios.create({
    baseURL: process.env.PAYMENT_API_LINK,
    timeout: 30000,
});

export class Payment {
    token: string;
    apikey: string;
    constructor() {
        this.token = undefined;
        this.apikey = process.env.PAYMENT_API_KEY;
    }

    async sync() {
        await sequelize.sync({ alter: true });
    }

    getHeaders() {
        return {
            headers: {
                "X-API-KEY": this.apikey,
            },
        };
    }

    async createOrder(
        id: number,
        amount: number,
        pay_currency = "USDTTRC20",
        order_description: string,
    ) : Promise<any> {
        // Request to create payment link
        // api.post(
        //     "/payment",
        //     {
        //         price_amount: amount,
        //         price_currency: "usd",
        //         pay_currency,
        //         ipn_callback_url: `${process.env.PAYMENT_CALLBACK_LINK}/transaction/${id}/fulfill`,
        //         order_id: id,
        //         order_description,
        //         case: 'common'
        //     },
        //     this.getHeaders()
        // ).then(data => payment = data)
        // .catch(err => {
        //     // console.log(err);
        //     throw new Error(err)
        // });

        let response = await axios.post(
            'https://api-sandbox.nowpayments.io/v1/payment',
            {
                price_amount: amount,
                price_currency: "usd",
                pay_currency,
                ipn_callback_url: `${process.env.PAYMENT_CALLBACK_LINK}/transaction/${id}/fulfill`,
                order_id: id,
                order_description,
                case: 'success'
            },
            {
                headers : {
                    "X-API-KEY": '9408VNN-66KME9M-GN5SBS4-QB9D69V',
                }
            }
        );

        return response.data;
    }

    async getPayment(id: number) {
        await this.JWTCheker();

        let status = await api.get(`/payment/${id}`, this.getHeaders());
        return status.data;
    }

    // Проверяем статус JWT, шлюз без refresh токенов работает, поэтому вручную проверяем актуальность 
    async JWTCheker() {
        // Пока что просто всю дорогу авторизовываемся сначала
        let auth = undefined;
        try {
            auth = await api.post("/auth", {
                email: "info@bnetex.com",
                password: "3VdpETtZ",
            });
        } catch (e) {
            throw new Error(e);
        }

        this.token = auth.data.token;
    }
}