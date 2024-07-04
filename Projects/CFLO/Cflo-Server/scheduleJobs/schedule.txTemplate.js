const { txGenerator } = require('../controllers/accounting/tx.template.controller');

const schedule = require('node-schedule');

const scheduleTxTemplate = ()=>{
  schedule.scheduleJob('* * * * *', txGenerator)
}

module.exports = {
  scheduleTxTemplate
};