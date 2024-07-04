const { 
    get,
    createCheckoutOneTimePayment 
} = require('../controllers/accounting/checkout.controller');

module.exports = app => {
    app.post('/api/checkout/get',get)
    app.post('/api/checkout/create', createCheckoutOneTimePayment);
}