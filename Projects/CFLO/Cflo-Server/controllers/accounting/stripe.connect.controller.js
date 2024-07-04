const keys = require('../../keys/keys');
const Wallet = require('../../models/wallet.model')
const stripe = require("stripe")(keys.secretKey);

const getStripeUrlBase = ()=>{

    var modeBase = 'https://www.contractflo.com/'
    if(process.env.LOCATION=='local'){
        modeBase = 'http://localhost:3000/'
    }

    return modeBase +  'stripe/connect/'

}


const createConnectAccount = async (req,res)=>{
    
    try {
        var walletId = req.body.walletId
        const wallet = await Wallet.findById(walletId)

        if(wallet&&wallet.stripeConnectAccountId){
            res.json({
                status:200, 
                data:null
            })

        }else{

            const account = await stripe.accounts.create({
                type: 'standard',
                // capabilities: {
                //   card_payments: {requested: true},
                //   transfers: {requested: true},
                // },      
            });
    
            wallet.stripeConnectAccountId = account.id
    
            var baseUrlStripe = getStripeUrlBase()
            var refresh_url = baseUrlStripe + 'reauth'
            var return_url = baseUrlStripe + 'return'
            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url,
                return_url,
                type: 'account_onboarding',
            });
    
            await wallet.save()
            
            res.json({
                status:200,
                data:{
                    wallet,
                    accountLink
                }
            })
            
        }



    } catch (error) {
        console.log(error,' is')
        res.json({
            status:200,
            data:null
        })
    }

}

const createConnectAccountLink = async (req,res)=>{
    
    try {
        var walletId = req.body.walletId
        const wallet = await Wallet.findById(walletId)
        const accountId = wallet.stripeConnectAccountId
        
        var baseUrlStripe = getStripeUrlBase(walletId)
        var refresh_url = baseUrlStripe + 'reauth'
        var return_url = baseUrlStripe + 'return'
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url,
            return_url,
            type: 'account_onboarding',
        });

        res.json({
            status:200,
            data:accountLink
        })

    } catch (error) {
        
        console.log(error,' is the error')

        res.json({
            status:400,
            data:null
        })
    }

}

module.exports = {
    createConnectAccount,
    createConnectAccountLink, 
}