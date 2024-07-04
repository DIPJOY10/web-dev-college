const StripeConnectCustomer = require('../../models/wallet.stripe.connect.customer.model');


const createStripeConnectCustomerHelper = async (obj)=>{

    try{
        const newStripeConnectCustomer = new StripeConnectCustomer(obj);
        const resData = await newStripeConnectCustomer.save()
        return resData;

    } catch(error){
      console.log(error);
      return null;
    }
}

const findStripeCustomerIdHelper = async (customerWalletId, receiverWalletId)=>{

    try{
        const stripeCustomerId = await StripeConnectCustomer.findOne({ 
            customerWallet : customerWalletId,  
            stripeConnectWallet : receiverWalletId
        });

        return stripeCustomerId;
    }catch(error){
      console.log(error);
      return null;
    }

}

module.exports = {
    createStripeConnectCustomerHelper,
    findStripeCustomerIdHelper
}