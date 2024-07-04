const async = require('async');
const Wallet = require('../../models/wallet.model')
const BillingAccount = require('../../models/wallet.billing.account')
const keys = require('../../keys/keys');
const stripe = require("stripe")(keys.secretKey);


const create = async (req, res) => {

    try {
        var billingAccount = new BillingAccount(req.body);

        var customer = await stripe.customers.create({
            name: req.body.name,
            address: req.body.address
        });
    
        billingAccount.stripeCustomerId = customer.id
    
        billingAccount = await billingAccount.save();
    
    
        res.json({
            status:200,
            data: billingAccount
        });

    } catch (error) {
        console.log(error,' is the error')
        res.json({
            status:400,
            data:null
          })
    }

}

const update = (req, res) => {
    var billingAccountObject = req.body;
    var billingAccountId = billingAccountObject._id;

    BillingAccount.findByIdAndUpdate(billingAccountId, billingAccountObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
             
                res.json(resp);
            }

        })
}

const findBillingAccounts =  async (req, res) =>{

    var walletIds = req.body.walletIds;

    if(walletIds){
        var billingAccounts = await BillingAccount.find({
            wallet: { $in: walletIds }
        })
        .populate({
            path: 'wallet', select:'parent parentModelName', populate:{ path: 'parent',select:'displayName'}
        })

        res.json({
            status:400,
            data:billingAccounts
        })
    }else{
        res.json({
            status:400,
            data:[]
        })
    }

   
}

const getBillingAccount = async (req, res) =>{
    var billingAccountId = req.body.billingAccountId;

    if(billingAccountId){
        var billingAccount = await BillingAccount.findById(billingAccountId)
        var resObject = {
            status: 200,
            data: billingAccount
        }

        res.json(resObject)
    }else{
        res.json({
            status:400,
            data:null
        })
    }

}


module.exports = {
    create,
    update,
    findBillingAccounts,
    getBillingAccount
}