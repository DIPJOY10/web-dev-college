const keys = require('../../keys/keys');
const BillingAccount = require('../../models/wallet.billing.account');
var _ = require('lodash');
const stripe = require("stripe")(keys.secretKey);
const {
    plaidClient,
    PLAID_PRODUCTS,
    PLAID_COUNTRY_CODES,
    PLAID_REDIRECT_URI,
    PLAID_ANDROID_PACKAGE_NAME
} = require('../../plaid.setting');
const Wallet = require('../../models/wallet.model');
const PlaidBankAccount = require('../../models/wallet.plaid.bank.account');
const async = require('async');
const BankAccount = require('../../models/wallet.bank.account.model');

const createLinkToken = async (req, res) => {
 
    try {

        const walletId = req.body.walletId
        const redirect_uri = req.body.redirectUrl || PLAID_REDIRECT_URI
        const client_name = req.body.client_name


        var configs = {
            user: {
                // This should correspond to a unique id for the current user.
                client_user_id: walletId,
            },
            client_name,
            products: PLAID_PRODUCTS,
            country_codes: PLAID_COUNTRY_CODES,
            language: 'en',
        }


        if (PLAID_REDIRECT_URI !== '') {
            configs.redirect_uri = redirect_uri;
        }

        if (PLAID_ANDROID_PACKAGE_NAME !== '') {
            configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
        }

        const createTokenResponse = await plaidClient.linkTokenCreate(configs);

        res.json({
            status: 200,
            data: createTokenResponse.data
        })

    } catch (error) {
        console.log(error, ' is the error')
        res.json({
            status: 200,
            data: null
        })
    }

}

const getStripeToken = async (plaidReqBody) => {
    try {

        const stripeTokenResponse = await plaidClient.processorStripeBankAccountTokenCreate(plaidReqBody);
        const stripeToken = stripeTokenResponse.data.stripe_bank_account_token;
        return stripeToken
    } catch (error) {
        console.log(error, ' is the error')
    }
}

const handleStripeMultipleAccount = async (accounts, accessToken) => {
    var promises = accounts.map(account => {
        return new Promise(async (resolve, reject) => {
            try {
                const plaidReqBody = {
                    access_token: accessToken,
                    account_id: account.id
                }
                return getStripeToken(plaidReqBody)
                    .then(stripeToken => {
                        resolve({
                            ...account,
                            stripeTokenCreated: true,
                            stripeToken
                        })
                    })


            } catch (error) {
                resolve(account)
            }
        })
    })

    return Promise.allSettled(promises)
        .then((results) => {
            var newAccounts = []
            results.map(result => {
                if (result.status == "fulfilled") {
                    newAccounts.push(result.value)
                }
            })
            return newAccounts
        });
}



const exchangePublicToken = async (req, res) => {

    try {
        var walletId = req.body.walletId
        const metadata = req.body.metadata

        console.log(JSON.stringify(metadata))


        const publicToken = metadata.public_token;
        const accounts = metadata.accounts

        const wallet = await Wallet.findById(walletId)
        const plaidBankAccount = new PlaidBankAccount({
            institution: metadata.institution,
        })

        const bankAccount = new BankAccount({
            wallet: walletId,
            account: plaidBankAccount._id,
            accountType: 'PlaidBankAccount'
        })

        const plaidBankAccountId = plaidBankAccount._id;
        const bankAccountOldArray = wallet.plaidBankAccounts || [];
        wallet.plaidBankAccounts = _.concat(bankAccountOldArray, plaidBankAccountId)

        await wallet.save();
        // Exchange the client-side public_token for a server access_token
        const tokenResponse = await plaidClient.itemPublicTokenExchange({
            public_token: metadata.public_token
        });
        // Save the access_token and item_id to a persistent database
        const accessToken = tokenResponse.data.access_token;
        const itemId = tokenResponse.data.item_id;
        plaidBankAccount.exchangeToken = {
            accessToken,
            itemId,
            publicToken
        }

        const accts = await handleStripeMultipleAccount(accounts, accessToken)

        const newAccounts = accts?.map((acc) => {
            return {
                ...acc,
                access_token: accessToken
            }
        })

        plaidBankAccount.accounts = newAccounts;




        await plaidBankAccount.save()
        await bankAccount.save()

        res.json({
            status: '200',
            data: {
                plaidBankAccount,
                wallet
            }
        })

    } catch (error) {

        console.log(error, ' is the error')

        res.json({
            status: 400,
            data: null
        })

    }

}

const dwollaPlaidHelper = async (accessToken, item) => {

    const request = {
        access_token: accessToken,
        account_id: item.id,
        processor: 'dwolla',
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
        request,
    );


    console.log(processorTokenResponse)

    const processorToken = processorTokenResponse.data.processor_token;

    return processorToken
}

const getTransactions = async (req, res) => {

    /* accessTokens = from PlaidBankAccount exchangeToken
     * start_date, end_date, offset
     * https://plaid.com/docs/api/products/#transactionsget
     */



    const accounts = req.body.accounts
    console.log("accounts : " + accounts)

    try {
        var promises = accounts.map(account => {
            console.log("account : " + account)
            return new Promise(async (resolve, reject) => {
                try {
                    const access_token = account.access_token
                    const start_date = account.start_date || '2020-01-01';
                    const end_date = account.end_date || '2021-02-01';
                    const offset = account.offset || 0;
                    const count = account.count || 30;

                    const request = {
                        access_token,
                        start_date,
                        end_date,
                        options: {
                            offset,
                            count
                        }
                    };

                    const response = await plaidClient.transactionsGet(request);

                    let transactions = response.data.transactions || [];


                    console.log("response : " + response.data)
                    console.log("transactions : " + JSON.stringify(response.data.transactions))

                    let accounts = response.data.accounts || [];


                    const total_transactions = response.data.total_transactions;


                    resolve({
                        transactions: transactions.map(tr => {
                            return {
                                account_id: tr.account_id,
                                amount: tr.amount,
                                merchant_name: tr.merchant_name,
                                category: tr.category,
                                date: tr.date
                            }

                        }),
                        total_transactions,
                        accounts
                    })


                } catch (error) {
                    reject(error)
                }
            })
        })

        Promise.allSettled(promises)
            .then((results) => {
                var allTransactions = []
                results.map(result => {
                    if (result.status == "fulfilled") {
                        allTransactions.push(result.value)
                    }
                })

                res.json({
                    status: 200,
                    data: allTransactions
                })
            });
    } catch (err) {
        // handle error
    }
}

const getTransactionsByWallet = async (req, res) => {

    const walletId = req.body.walletId;
    const walletData = await Wallet.findById(walletId).populate('plaidBankAccounts')
    const responseData = walletData.plaidBankAccounts;
    const accountArr = [];
    responseData.map((response) => {
        console.log(response.institution.name);
        response?.accounts.map((account) => {
            const newObj = {
                ...account._doc,
                bankName: response.institution.name
            }
            accountArr.push(newObj);
        })
    })

    var newPromises = accountArr.map(async (account) => {
        return new Promise(async (resolve, reject) => {
            try {
                const access_token = account.access_token
                const start_date = account.start_date || '2020-01-01';
                const end_date = account.end_date || '2021-02-01';
                const offset = account.offset || 0;
                const count = account.count || 30;

                const request = { 
                    access_token,
                    start_date,
                    end_date,
                    options: {
                        offset,
                        count
                    }
                };

                const responseTx = await plaidClient.transactionsGet(request);
                let accountAllDit = []
                let allTxs = []

                responseTx.data.accounts.map((acc) => {
                    if (acc.account_id == account.id) {
                        accountAllDit.push({
                            bankName: account.bankName,
                            account_id: acc.account_id,
                            balances: acc.balances,
                            name: acc.name,
                            official_name: acc.official_name,
                            subtype: acc.subtype,
                            type: acc.type,
                        })
                    }
                })

                responseTx.data.transactions.map((tx) => {
                    if (tx.account_id == account.id) {
                        allTxs.push({
                            account_id: tx.account_id,
                            amount: tx.amount,
                            category: tx.category,
                            category_id: tx.category_id,
                            date: tx.date,
                            iso_currency_code: tx.iso_currency_code,
                            merchant_name: tx.merchant_name,
                            name: tx.name,
                            payment_channel: tx.payment_channel,
                            transaction_id: tx.transaction_id,
                            transaction_type: tx.transaction_type
                        })
                    }
                })
                resolve({
                    account: accountAllDit[0],
                    txs: allTxs
                })

            } catch {
                reject("error")
            }
        })
    })

    Promise.allSettled(newPromises)
        .then((results) => {
            var allDatas = []
            results.map(result => {
                if (result.status == "fulfilled") {
                    allDatas.push(result.value)
                }
            })
            res.json({
                status: 200,
                data: allDatas
            })
        })
        .catch((error) => {
            res.json({
                status: 400,
                data: error
            })
        })
}


const getPlaidBankAccountByWallet = async (req, res) =>{
   try{

    const walletId = req.body.walletId

    const plaidBankAccounts = await BankAccount.find({ wallet: walletId, accountType : "PlaidBankAccount"})
                                               .populate('account')
    res.json({
        status: 200,
        data: plaidBankAccounts
    })
   }catch(err){
    res.json({
        status: 400,
        data: err
    })
   }

}





module.exports = {
    createLinkToken,
    exchangePublicToken,
    dwollaPlaidHelper,
    getTransactions,
    getTransactionsByWallet,
    getPlaidBankAccountByWallet
}