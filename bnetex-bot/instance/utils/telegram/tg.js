//import { tg } from './axios';
//import config from '../../configs/server.json';

const {tg} = require('./axios')

const config = require("../../../config/config")();

const botId = config.tgBotKey;
const chat_id = config.tgGroupId;


const sendMessageToMainChanel = (text) => {    
    console.log('Send Message to Telegram')
    try {
        tg.get(`/bot${botId}/sendMessage`, {
            params: {
                chat_id, text, parse_mode: 'html'
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports.sendMessageToMainChanel = sendMessageToMainChanel;