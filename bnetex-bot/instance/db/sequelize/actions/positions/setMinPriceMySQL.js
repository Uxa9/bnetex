const db = require("../../dbseq");

module.exports = async (id, close) => {
  position = await db.models.Position.update(
    { minPrice: close },
    { where: { id } }
  );
};
