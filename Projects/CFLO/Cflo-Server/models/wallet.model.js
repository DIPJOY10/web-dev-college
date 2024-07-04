const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const WalletSchema = new Schema(
    {

        currency: {
            type: String,
            default: 'usd'
        },

        cfloBalance : {
            type: Number,
            default: 0
        },

        chartOfAccounts: [{
            type: Schema.Types.ObjectId,
            ref: 'ChartAccount'
        }],

        parent: {
            type: Schema.Types.ObjectId,
            refPath: 'parentModelName'
        },

        parentModelName: {
            type: String
        },

        sentAmountOnPlatform: {
            type: Number,
            default: 0
        },

        recAmountOnPlatform: {
            type: Number,
            default: 0
        },

        sentAmountNotOnPlatform: {
            type: Number,
            default: 0
        },

        recAmountNotOnPlatform: {
            type: Number,
            default: 0
        },

        numCustomers: {
            type: Number,
            default: 0
        },

        numVendors: {
            type: Number,
            default: 0
        },

        numEmployees: {
            type: Number,
            default: 0
        },

        numContractors: {
            type: Number,
            default: 0
        },

        printLogo: {
            type: Schema.Types.ObjectId,
            ref: "File",
        },

        note: {
            type: String,
            default: "",
        },

        numInvestors: {
            type: Number,
            default: 0
        },

        numLenders: {
            type: Number,
            default: 0
        },

        billingAccount: {
            type: Schema.Types.ObjectId,
            ref: 'BillingAccount'
        },

        providers: [{
            type: String
        }],

        stripeCustomerId: {
            type: String, default: ''  ///to pay
        },

        stripeConnectAccountId: {
            type: String,
        },

        stripeConnectDone: {
            type: Boolean,
            default: false
        },

        stripeCustomer: {
            type: Schema.Types.ObjectId,
            ref: 'StripeCustomer'
        },

        dwollaCustomer: {
            type: Schema.Types.ObjectId,
            ref: 'DwollaCustomer'
        },

        defaultDwollaBankAccount: {
            type: Schema.Types.ObjectId,  /// to pay
            ref: 'DwollaBankAccount'
        },


        //dwolla managed by parent
        managedDwolla: {
            type: Boolean,
            default: false
        },

        managerDwollaCustomer: {
            type: String
        },

        managerDwollaWallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet"
        },



        plaidBankAccounts: [{
            type: Schema.Types.ObjectId,
            ref: 'PlaidBankAccount'
        }],

        invoiceCounter: {
            type: Number,
            default: 1000
        },

        templateInvCounter: {
            type: Number,
            default: 1000
        },
        templateBillCounter: {
            type: Number,
            default: 1000
        },

        billCounter: {
            type: Number,
            default: 1000
        },

        journalCounter: {
            type: Number,
            default: 1000
        },
    }
);

const Wallet = model('Wallet', WalletSchema);

module.exports = Wallet;
