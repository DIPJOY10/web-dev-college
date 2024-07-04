const Wallet = require("../../models/wallet.model");

function isNumber(val){
    return typeof val==='number';
}

const subBalance = async ( amount, walletId ) => {
    const oldWallet = await Wallet.findById(walletId)
    const oldBalance = oldWallet.cfloBalance || 0
    const newBalance = oldBalance - isNumber(amount)?amount:0
    const newWallet = await Wallet.findByIdAndUpdate(walletId, { cfloBalance: newBalance}, {new: true});
    return newWallet
}

const addBalance = async ( amount, walletId ) => {
    const oldWallet = await Wallet.findById(walletId)
    const oldBalance = oldWallet.cfloBalance || 0
    const newBalance = oldBalance + isNumber(amount)?amount:0
    const newWallet = await Wallet.findByIdAndUpdate(walletId, { cfloBalance: newBalance}, {new: true});
    return newWallet
}

module.exports = {
    subBalance, addBalance
}