import fs from 'fs'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import {serverStarter} from './bin/www.js';

import {models, setup} from './modules/db/sequelize/dbseq.js'


const swaggerFile = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf-8'))

const app = express()

app.use(express.json())

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Setup db;
setup();



serverStarter(app)


// app.listen(3000, () => {
//   console.log('🚀 Server ready')
// })

