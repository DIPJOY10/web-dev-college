const PaymentConfig = require('../../models/wallet.payment.config')
const Wallet = require('../../models/wallet.model')
const DwollaBankAccount = require('../../models/wallet.dwolla.BankAccount.model')
const Transaction = require('../../models/wallet.transaction.model')
const {
    getDwollaCustomerHelper
} = require('./dwolla.controller')
var _ = require('lodash');

const getWalletConfigHelper = async (walletId) => {
    try {

        const wallet = await Wallet.findById(walletId)
        const providers = []

        const config = {}

        if (wallet.dwollaCustomer) {
            providers.push('dwolla')

            console.log('me wallet ')
            console.log(walletId)

            const customerId = wallet.dwollaCustomer;
            const dwollaObj = await getDwollaCustomerHelper(customerId, walletId)
            config['dwolla'] = dwollaObj.data;
        }

        if (wallet.stripeConnectAccountId) {

            providers.push('stripe')

            config['stripe'] = {
                connectId: wallet.stripeConnectAccountId
            };
        }

        return {
            data: {
                wallet,
                config,
                providers
            }
        }

    } catch (error) {

        return {
            data: null,
            error
        }
    }
}

const getWalletConfig = async (req, res) => {
    const walletId = req.body.wallet;

    const obj = await getWalletConfigHelper(walletId)

    if (obj.data) {

        res.json({
            status: 200,
            ...obj
        })

    } else {

        res.json({
            status: 400,
            ...obj
        })

    }
}

const createPaymentConfigHelper = async (obj) => {
    try {

        var paymentConfig = new PaymentConfig(obj);
        paymentConfig = await paymentConfig.save()

        return {
            data: paymentConfig
        }

    } catch (error) {

        return {
            data: null,
            error
        }
    }
}

const create = async (req, res) => {

    const obj = await createPaymentConfigHelper(req.body)

    if (obj.data) {

        res.json({
            status: 200,
            ...obj
        })

    } else {

        res.json({
            status: 400,
            ...obj
        })

    }

}

const update = async (req, res) => {
    try {

        const obj = req.body;
        let paymentConfig = await PaymentConfig.findByIdAndUpdate(obj._id, obj, { new: true });

        res.json({
            status: 200,
            data: paymentConfig
        })

    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        });
    }
}


const checkAvaliablePaymentMethodsHelper = async (dwollaAccUrl, stripeAccId, walletId, txId) => {
    try {

        console.log("checkAvaliablePaymentMethodsHelper")
        console.log(dwollaAccUrl)
        console.log(stripeAccId)
        console.log(walletId)

        const wallet = await Wallet.findById(walletId)
            .populate('defaultDwollaBankAccount')

        let newDwolla, newStripe
        let provider = []

        if (dwollaAccUrl) {

            console.log("availableInTx D")

            const dwollaAcc = await DwollaBankAccount.findOne({ deleteStatus: false, url: dwollaAccUrl });

            console.log(dwollaAcc);

            if (!dwollaAcc) {
                if (wallet?.defaultDwollaBankAccount) {

                    console.log("availableInTx D get from defult")

                    newDwolla = wallet.defaultDwollaBankAccount.url
                    provider.push("DwollaACH")
                } else {
                    newDwolla = null
                }
            } else {

                console.log("availableInTx D get from already available")

                newDwolla = dwollaAccUrl
                provider.push("DwollaACH")
            }

        } else {

            console.log("Not AvailableInTx D")

            if (wallet?.defaultDwollaBankAccount) {

                console.log("Not AvailableInTx D geting from wallet")

                newDwolla = wallet?.defaultDwollaBankAccount.url
                provider.push("DwollaACH")
            } else {
                newDwolla = null
            }
        }

        if (wallet?.stripeConnectAccountId) {

            console.log("stripe has in wallet")

            newStripe = wallet.stripeConnectAccountId
            provider.push("StripeCard")
        } else {
            newStripe = null
        }

        const newBankConfig = {
            dwollaConfig: {
                receiverDwollaBankAcc: newDwolla
            },
            stripeConfig: {
                receiverStripeAcc: newStripe
            },
            providers: provider
        }

        console.log(newBankConfig)

        if (newDwolla === dwollaAccUrl && newStripe === stripeAccId) {
            return ({
                newDwolla,
                newStripe
            })
        } else {
            tx = await Transaction.findByIdAndUpdate(txId, newBankConfig, {
                new: true,
            })
            console.log(tx)
            return ({
                newDwolla,
                newStripe
            })

        }

    } catch (err) {
        return null;
    }

}


const checkAvaliablePaymentMethods = async (req, res) => {

    const dwollaAccUrl = req.body.dwollaAccUrl;
    const stripeAccId = req.body.stripeAccId;
    const walletId = req.body.firstPartyWalletId;
    const txId = req.body.txId;

    console.log("check method")
    console.log(req.body);

    try {
        await checkAvaliablePaymentMethodsHelper(dwollaAccUrl, stripeAccId, walletId, txId)
            .then((data) => {

                console.log(data);

                res.json({
                    status: 200,
                    data: data
                });
            })
            .catch((err) => {
                res.json({
                    status: 400,
                    data: null,
                    err
                })
            })
    } catch (error) {
        res.json({
            status: 200,
            data: null,
            error
        })
    }

}



module.exports = {
    getWalletConfigHelper,
    getWalletConfig,
    createPaymentConfigHelper,
    create,
    update,
    checkAvaliablePaymentMethods
}