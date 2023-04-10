const { last } = require('rxjs');
const { Telegraf } = require('telegraf');
const Account = require('../binance/account');
const { getBBRulesIndexes, getBBRuleByIddex } = require('../BollZoneRules');
const { convertKlines } = require('../tickerHelper')

const config = require("../../../config/config")();




const moment = require('moment')

const commandArgs = require('./commandsArgs');

const events = require('../events').tgEvents;



module.exports = class TelegramBotClass {
    constructor(token){
        
        this.bot = new Telegraf(token)

        this.candlesticks = {};

        

        this.account = new Account()

    }

    async init(){

        events.on('updateKline', (e) => {
            this.candlesticks[e.symbol] = e;
        })

        console.log("Telegram BOT Initializing")        

        
        

        this.bot.use(commandArgs());
        


        

        this.bot.command('zones', (ctx) => {


            

            //let lastKline = this.candlesticks['BTCUSDT'];

            let zoneRulesBB = getBBRulesIndexes();

            
            
            if(!this.candlesticks || !Object.keys(this.candlesticks) || Object.keys(this.candlesticks).length == 0) return;

            let txtFull = '';

            let dataToLoop = Object.keys(this.candlesticks)


            if(ctx.state.command.args.length > 0){
                
                dataToLoop = Object.keys(this.candlesticks).filter(i => i.toUpperCase() == ctx.state.command.args[0].toUpperCase())
                
            }
            
            console.log(dataToLoop)

            dataToLoop.map(pair => {

                
                let lastKline = this.candlesticks[pair];

                

                let txt = `${lastKline.symbol} | <b>Время свечи:</b> ${lastKline.startTime} | ${moment(lastKline.startTime, 'x').format('DD MM YYYY HH:mm')} \n`;              
                
                for (let index = 0; index < zoneRulesBB.length; index++) {
                    const element = zoneRulesBB[index];

                    const rule = getBBRuleByIddex(element);
                    
                    txt += `<b>Rule: ${rule.intervals}/${rule.sigma}</b> | Zone: ${lastKline[rule.intervals][rule.sigma].zone} | Back: ${lastKline[rule.intervals][rule.sigma].backPattern} | PrevZone: ${lastKline[rule.intervals][rule.sigma].prevZone} \n`
                }

                txtFull += txt + '\n';

            })
            
            
            

            

            ctx.reply(txtFull, {parse_mode: 'html'})
        })


        this.bot.command('binancepositions', async (ctx) => {            

            
            if(!ctx.state.command) return;

            if(ctx.state.command.args.length != 1){
                ctx.reply(`Ошибка: количество аргументов команды должно быть равно 1`, {parse_mode: 'html'});
                return;
            }
                        
            let pair = String(ctx.state.command.args[0]).toLocaleUpperCase()
            let positions = await this.account.getOpenPositions(pair);

            if(!positions){
                ctx.reply(`Ошибка: Открытых позиций по паре ${pair} не найдено`, {parse_mode: 'html'});
                return;
            }            
            

            let txt = `Информация по позиции <b>${pair}</b>\n`;

            ['symbol', 'unrealizedProfit', 'leverage', 'positionAmt'].map(i => {
                txt += `<b>${String(i).toLocaleUpperCase()}</b> : ${positions[i]}\n`;
            })
            
            ctx.reply(txt, {parse_mode: 'html'})
        })

        
        this.bot.startPolling();

    }
}