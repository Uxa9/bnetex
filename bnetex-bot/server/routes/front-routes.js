
const positions = require('../services/positions');

var express = require("express"),
  router = express.Router();


  router.use('/history', async (req,res) => {
    console.log(req)

    if(!req.requestParams.periodMonth){
        res.status(400);
        res.json({error: true, detail: 'periodMonth is required'})
        return;
    }

    let position = await positions.getByPeriod(req.requestParams.periodMonth)

    res.json({status: 'ok', response: position})

  })

module.exports = router;

