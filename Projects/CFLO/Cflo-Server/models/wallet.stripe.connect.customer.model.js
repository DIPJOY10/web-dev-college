const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const StripeConnectCustomerSchema = new Schema(
    {
        //the new customer created for stripe connect account (customer.id)
        stripeConnectCustomer: {
            type: String,
        },

        //the old customer created on contractFlo
        stripeCustomer: {
            type: String,
        },

        //the customer's wallet in contractFlo
        customerWallet: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        },

        //the stripe connect accountId of the receiver
        stripeConnectAccountId: {
            type: String,
        },

        //the contractFLo walletId of the receiver
        stripeConnectWallet: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        },

    }
);

const StripeConnectCustomer = model('StripeConnectCustomer', StripeConnectCustomerSchema);

module.exports = StripeConnectCustomer;
