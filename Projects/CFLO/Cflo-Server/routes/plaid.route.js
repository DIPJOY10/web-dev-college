const {
    createLinkToken, 
    exchangePublicToken, 
    getTransactions, 
    getTransactionsByWallet,
    getPlaidBankAccountByWallet
} = require('../controllers/accounting/plaid.controller')

module.exports = app => {
     
    app.post('/api/plaid/token/create', createLinkToken);
    app.post('/api/plaid/token/exchange', exchangePublicToken);
    app.post('/api/plaid/get/transactions', getTransactions);
    app.post('/api/plaid/get/transactionsbywallet', getTransactionsByWallet);
    app.post('/api/plaid/get/bankaccounts',  getPlaidBankAccountByWallet);

}