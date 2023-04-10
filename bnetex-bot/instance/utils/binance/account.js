const PositionsModule = require("../../classes/PositionsModule");
const binance = require("../binance");

const config = require("../../../config/config")();

module.exports = class Account {
  constructor() {}

  async getAvaiableBalance(asset) {
    // Фьючерсный Баланс аккаунта
    let accountbalance = await binance.futuresBalance({ recvWindow: 60000 });

    accountbalance = accountbalance.filter((i) => i.asset == asset);

    if (accountbalance.length == 0) return 0;
    return accountbalance[0];
  }

  async getBalance(symbol) {
    let accountBalance = await account.getAvaiableBalance();
    return accountBalance.filter((i) => i.asset == symbol);
  }

  // Возвращает текущие позиции
  async getOpenPositions(pair, actualPosition = null) {
    if (config.simulate) {
      if (!actualPosition) return null;

      let mock = {
        positionAmt: actualPosition.volumeACTIVE,
      };

      return mock;
    }

    let a = await binance.futuresAccount({ recvWindow: 60000 });

    a = a.positions.filter((i) => i.symbol == pair);
    if (a.length == 0) undefined;
    return a[0];
  }
};
