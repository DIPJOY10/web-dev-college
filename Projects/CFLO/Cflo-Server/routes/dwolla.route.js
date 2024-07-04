const {
    createCustomerToken,
    dwollaAttach,
    getIavToken,
    addFundingSrc,
    getCustomer,
    setDefaultSrc,
    createReceiveOnlyCustomer
} = require('../controllers/accounting/dwolla.controller');
const { 
    createDwollaBankAccount ,
    getDwollaBanksAccounts,
    removeDwollaBankAccount,
    ACHPayment,
    getDwollaTransaction,
    usersAccessableProjectsAndOrgs,
    getDwollaBanksAccountsByProjectIds,
    getWalletAndDwollaCustomer,
    createDwollaAccountForPal,
    getDwollaCustomerForPalAndAnonUser,
    findAllPersonlBankAccount,
    getDwollaAccountByUrl,
    addReceiveOnlyBankAccount
} = require('../controllers/accounting/wallet.dwolla.bankAccount.controller');

const { dwollaWebHookController } = require('../controllers/accounting/dwolla.webhook.controller')


module.exports = app => {
    app.post('/api/dwolla/createCustomerToken', createCustomerToken);
    app.post('/api/dwolla/attach', dwollaAttach);
    app.post('/api/dwolla/setDefaultSrc',setDefaultSrc);
    app.post('/api/dwolla/addFundingSrc', addFundingSrc);
    app.post('/api/dwolla/get/customer', getCustomer);
    app.post('/api/dwolla/get/iav/token', getIavToken);
    app.post('/api/dwolla/create/dwollaBankAccount', createDwollaBankAccount)
    app.post('/api/dwolla/get/dwollaBankAccount', getDwollaBanksAccounts)
    app.post('/api/dwolla/remove/dwollaBankAccount', removeDwollaBankAccount)
    app.post('/api/dwolla/get/alldwollaBankAccounts', findAllPersonlBankAccount)
    app.post('/api/dwolla/make/payment',  ACHPayment)
    app.post('/api/dwolla/get/transaction',  getDwollaTransaction)
    app.post('/api/dwolla/get/accessableprojectsandorgs',  usersAccessableProjectsAndOrgs )
    app.post('/api/dwolla/get/dwollaaccount/byprojects',  getDwollaBanksAccountsByProjectIds)
    app.post('/api/dwolla/payment/getwalletanddwolla', getWalletAndDwollaCustomer)
    app.post('/api/dwolla/payment/create/dwollaaccountforpal', createDwollaAccountForPal)
    app.post('/api/dwolla/payment/get/dwollaCustomerforPal', getDwollaCustomerForPalAndAnonUser)
    app.post('/api/dwolla/get/dwollaaccount', getDwollaAccountByUrl)
    app.post('/api/dwolla/create/receiveonly/customer', createReceiveOnlyCustomer)
    app.post('/api/dwolla/add/receiveonly/fundingsource', addReceiveOnlyBankAccount)

    //dwolla webhook 
    app.post('/api/dwolla/webhook1', dwollaWebHookController)
}