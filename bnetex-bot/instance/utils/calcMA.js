// Скользящая средняя
module.exports = (klines) => {
  let sumPrice = klines
    .map((i) => {
      return {
        close: parseFloat(i.close),
      };
    })
    .reduce((p, c) => p + c.close, 0);

  return sumPrice / klines.length;
};
