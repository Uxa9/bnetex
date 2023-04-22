import express from 'express';

const BinanceRouter = express.Router();

import PatternController from './patterns.controller.js';

// const { binanceSettings } = require("../../lib/core/middlewares/binance");
// const requestValidator = require("../../lib/core/middlewares/request.validator");
// // Controller
// const BinanceController = require('./Binance.controller');

// // Auth Middleware
// const AuthMiddleware = require('../../lib/core/middlewares/auth')()

// Array of Middlewares
//let middlewares = [AuthMiddleware, requestValidator, binanceSettings];

//BinanceRouter.use('*', middlewares);

// // Route for authentification
// UsersRouter.get('/:id', [requestValidator], (req,res) => new PaymentController(req,res).call('getSignlePayment'))

// // Route for authentification
// UsersRouter.post('/create', [middlewares], (req,res) => new PaymentController(req,res).call('createSignlePayment'))

BinanceRouter.get('/listBySymbol', (req: any, res: any) => {
  //  #swagger.summary = 'Get List Of Patterns'
  //  #swagger.path = '/patterns/listBySymbol'
  //  #swagger.tags = ['Patterns']
  /*
    #swagger.parameters = [{
      "name" : "symbol",
      "required": true
    }] 
  */

  /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/PatternResponse" },
               description: 'List of Patterns' 
  } */

  new PatternController(req, res).call('listBySymbol');
});

BinanceRouter.get('/listByWorkingGroup', (req: any, res: any) => {
  //  #swagger.summary = 'Get List Of Patterns By Working Group'
  //  #swagger.path = '/patterns/listByWorkingGroup'
  //  #swagger.tags = ['Patterns']
  /*
    #swagger.parameters['symbol'] = {"required": true} 
    #swagger.parameters['WORKING_GROUP'] = {"required": true}     
  */

  /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/PatternResponse" },
               description: 'List of Patterns' 
  } */

  new PatternController(req, res).call('listByWorkingGroup');
});



BinanceRouter.get('/listByLogicalGroup', (req: any, res: any) => {
  //  #swagger.summary = 'Get List Of Patterns By Logical Group'
  //  #swagger.path = '/patterns/listByLogicalGroup'
  //  #swagger.tags = ['Patterns']
  /*
    #swagger.parameters['symbol'] = {"required": true} 
    #swagger.parameters['LOGICAL_GROUP'] = {"required": true}     
  */

  /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/PatternResponse" },
               description: 'List of Patterns' 
  } */

  new PatternController(req, res).call('listByLogicalGroup');
});


BinanceRouter.get('/getLogicalGroups', (req: any, res: any) => {
  //  #swagger.summary = 'Get List of Logical Groups'
  //  #swagger.path = '/patterns/getLogicalGroups'
  //  #swagger.tags = ['Patterns']
  /*
    #swagger.parameters['symbol'] = {"required": true}     
  */

  /* #swagger.responses[200] = { 
               description: 'List of Logical Groups' 
  } */

  new PatternController(req, res).call('getLogicalGroups');
});




// 404 handler
BinanceRouter.use('*', (req, res) => {
  res.status(404);
  res.json({ detail: 'Page Not Found' });
});

export default BinanceRouter;
