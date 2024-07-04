const { 
    create,
    addWallet,
    removeWallet,
} = require('../controllers/accounting/platform.credit.controller');

module.exports = app => {
    app.post('/api/platform/credit/create', create);
    app.post('/api/platform/credit/addWallet', addWallet);
    app.post('/api/platform/credit/removeWallet',removeWallet);
}