const {
    create,
    update,
    getInvestmentDetail,
    getSavedInvestments
} = require('../controllers/investment.controller')


module.exports = app => {
    app.post('/api/investment/create', create);
    app.post('/api/investment/update', update);
    app.post('/api/investment/getDetails', getInvestmentDetail);
    app.post('/api/investment/getSavedInvestments', getSavedInvestments);
}