const fs = require('fs');
const path = require("path");

/**
 * Дергаем конфиг в соответствии с режимом работы приложения
 * @returns 
 */
module.exports = () => {
    let serverConfig = {};
    switch(process.env.MODE){        
        case 'DEV' : {
            serverConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "server-dev.json")));
            break;
        }
        default : {
            serverConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "server-prod.json")));
        }
    }
    return serverConfig;
}
