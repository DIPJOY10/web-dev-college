var async = require('async');
const Wallet = require('../../models/wallet.model');
const Checkout =  require('../../models/checkout.model')

const createCheckoutOneTimePayment = async (req,res)=>{
    try {
        var checkout = new Checkout(req.body);
        checkout = await checkout.save()
        res.json({
            status: 200,
            data:checkout
        })    
    } catch (error) {
        res.json({
            status: 400,
            data:null,
            error
        })  
    }
 
}

const get = async (req, res)=>{
    var checkoutId = req.body.checkoutId
    Checkout.findById(checkoutId)
        .populate('user')
        .populate('creator')
        .then(checkout=>{
            res.json(checkout)
        })
} 

module.exports = {
    createCheckoutOneTimePayment,
    get
}