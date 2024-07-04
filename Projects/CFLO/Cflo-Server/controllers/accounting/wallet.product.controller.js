var async = require('async');
const keys = require('../../keys/keys');
const Wallet = require('../../models/wallet.model');
const Product = require('../../models/wallet.offering.model');

const createProduct = async (req, res) => {
    try {
        var newProduct = new Product(req.body);
        await newProduct.save()

        console.log(newProduct);

        res.json({
            status: 200,
            data: newProduct
        })
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        })
    }
}




module.exports = {
    createProduct
}