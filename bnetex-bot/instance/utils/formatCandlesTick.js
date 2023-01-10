module.exports = (candlesticks) => {
  let { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks;
  let tick = {
    open: ticks.o,
    interval: ticks.i,
    high: ticks.h,
    low: ticks.l,
    close: ticks.c,
    volume: ticks.v,
    isFinal: ticks.x,
    trades: ticks.n,
    startTime: ticks.t,
    endTime: ticks.T,
    symbol: ticks.s,
  };

  return tick;
};
