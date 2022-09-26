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
    baseURL: "https://api.nowpayments.io/v1",
    timeout: 30000,
});

export class Payment {
    token: string;
    apikey: string;
    constructor() {
        this.token = undefined;
        this.apikey = "DNXQPER-87QM9HR-NGC3A7E-2CRZF4E";
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
        orderid: any,
        amount: any,
        pay_currency = "USDTTRC20",
        order_description: any
    ) : Promise<any> {
        // Request to create payment link
        let invoice = await api.post(
            "/invoice",
            {
                price_amount: amount,
                price_currency: "usd",
                pay_currency,
                ipn_callback_url: "https://pay.bnetex.com",
                order_id: orderid,
                order_description,
            },
            this.getHeaders()
        );

        // Create payment by invoice
        let payment = await api.post('/invoice-payment', {
            iid: invoice.data.id,
            pay_currency
        }, this.getHeaders())

        invoice = invoice.data;
        payment = payment.data;

        return { invoice, payment };
    }

    async getPayment(orderid) {
        await this.JWTCheker();

        let status = await api.get(`/payment/${orderid}`, this.getHeaders());
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