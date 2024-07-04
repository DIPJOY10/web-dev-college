const Package = require('../../models/wallet.billing.package.model')
const PlaidBankAccount = require('../../models/wallet.plaid.bank.account')
const Wallet = require('../../models/wallet.model')
const _ = require('lodash')

const create = async (req, res)=>{
    try {
        const package = new Package(req.body)
        await package.save()
        res.json({
            status:200,
            data: package
        })
    } catch (error) {
        res.json({
            status:400,
            data: null,
            error
        }) 
    }
}

const addWallet = async (req, res)=>{
    const walletId = req.body.walletId;
    const packageId = req.body.packageId
    const package = await Package.findById(packageId)
   
    const oldWalletIds = package.wallets || []
    var walletSet = new Set(_.concat(oldWalletIds,[walletId]))

    package.wallets  = Array.from(walletSet)
    await package.save()
   
}

const addWallet = async (req, res)=>{
    const walletId = req.body.walletId;
    const packageId = req.body.packageId
    const package = await Package.findById(packageId)
   
    const oldWalletIds = package.wallets || []
    var walletSet = new Set(_.concat(oldWalletIds,[walletId]))

    package.wallets  = Array.from(walletSet)
    await package.save()
   
}

const removeWallet = async (req, res)=>{
    const walletId = req.body.walletId;
    const packageId = req.body.packageId
    const package = await Package.findById(packageId)
   
    const oldWalletIds = package.wallets || []
    var walletSet = new Set(_.difference(oldWalletIds,[walletId]))

    package.wallets  = Array.from(walletSet)
    await package.save()
   
}


module.exports = {
    create,
    addWallet,
    removeWallet
}