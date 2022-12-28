const db = require("./instance/db/sequelize/dbseq");
const InstanceClass = require("./instance/instanceMainClass");

const config = require("./config/config")();

// Тут хранятся все экземпляры торговых классов
let pairInstances = [];

(async () => {
    await db.setup();
})()




config.tradingPairs.map(pair => {

    // Создаем экземпляр класса торговой пары
    let instalceClass = new InstanceClass(pair);

    // Инициализация класса
    instalceClass.initializing();

    // Сохранение класса
    pairInstances.push(instalceClass);
})



