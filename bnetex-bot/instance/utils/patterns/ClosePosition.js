const mongoose = require("mongoose");

const Positions = require("../../db/schemes/positions/Positions");

var moment = require("moment");
const getSinglePattern = require("./getSinglePattern");
const db = require("../../db/db");
const deactivateAll = require("../positions/deactivateAll");
const Account = require("../binance/account");
const marketSell = require("../binance/marketSell");
const { sendMessageToMainChanel } = require("../telegram/tg");
const { api } = require("../telegram/axios");

module.exports.ClosePosition = async (
  pair,
  position,
  close,
  time,
  force = false
) => {
  let md = await db(Positions);

  // Провекряем разницу в % и в факте
  let minPercentProfit = 0.5;

  let pattern = await getSinglePattern(position.patternEnter);


  // Минимальный профит для закрытия
  if (pattern) {
    minPercentProfit = pattern.minPercentProfit;
  }

  if (!close) {
    close = position.lastEnterPrice;
  }

  let account = new Account();

  let position__server = await account.getOpenPositions(pair);

  let server__amt = position__server.positionAmt;

  let averagePrice = parseFloat(position__server.entryPrice);

  averagePrice = 15000;

  // Надо деактивировать все паттерны
  await deactivateAll();

  // Текущий процент профита
  let percentCurrent = (close * 100) / averagePrice - 100;x



  
  
  

  if (percentCurrent > minPercentProfit || force) {

    // Продаем по рынку
    await marketSell(pair, server__amt);

    let data = await md.updateOne(
      { _id: position._id },
      {
        $set: {
          status: false,
          closeTime: time,
          closePrice: close,
          percentProfit: percentCurrent,
          sumProfit: (percentCurrent * position.volumeUSDT) / 100,
          lastEnterPrice: close,
          minPricePercent:
            100 - (position.minPrice * 100) / position.avegarePrice,
        },
      }
    );

    // Сообщаем на SiteAPI о закрыти позиции
    await api.post('/invest-sessions');

    return data;
  } else {
    sendMessageToMainChanel(`Ошибка выхода из позиции: \nМинимальный профит не достигнут \n<b>SYMBOL:</b> ${position__server.symbol} \n<b>Минимальный профит:</b> ${minPercentProfit}% \n<b>Текущий порфит:</b> ${parseFloat(percentCurrent).toFixed(3)}%`)
  }
};

