const express = require('express');

const { 
    createPaymentIntent, 
    stripeWebhook,
    createCustomerToken, 
    createAchDebitSource,
    attachAchDebitSource,
    createAchCharge,
    createPaymentIntentForExpense,
    createPaymentIntentForAccPay,
    retrievePaymentIntent,
    retrievePaymentIntentPlatform,
    getStripeAccountByWallet,
    findWalletByStripe
} = require('../controllers/accounting/stripe.controller');
const { createSubscription, setDefaultPaymentMethod } = require('../controllers/accounting/stripe.subscription.controller');

const {
    createConnectAccount, createConnectAccountLink
} = require('../controllers/accounting/stripe.connect.controller')

module.exports = app => {

    
    app.post('/api/stripe/createPaymentIntent', createPaymentIntent);
    app.post('/api/stripe/connect/account/create', createConnectAccount);
    app.post('/api/stripe/connect/account/link', createConnectAccountLink);

    app.post('/api/stripe/createpaymentintent/expense',createPaymentIntentForExpense)
    app.post('/api/stripe/createpaymentintent/accpay',createPaymentIntentForAccPay)


    app.post('/api/stripe/retrievePaymentIntent/fortx', retrievePaymentIntent)
    app.post('/api/stripe/retrievePaymentIntent/atbrandapp', retrievePaymentIntentPlatform)




    app.post('/api/stripe/subscription/create', createSubscription);
    app.post('/api/stripe/subscription/defaultPM',setDefaultPaymentMethod);

    
    app.post('/api/stripe/hooks', express.raw({type: 'application/json'}), stripeWebhook);


    app.post('/api/stripe/create-customer',createCustomerToken);




    app.post('/api/stripe/create/source/ach_debit',createAchDebitSource)
    app.post('/api/stripe/attach/source/ach_debit',attachAchDebitSource)
    app.post('/api/stripe/create/ach_charge', createAchCharge)


    app.post('/api/stripe/get/account/bywallet',  getStripeAccountByWallet)
    app.post('/api/stripe/get/account/bystripeconnectid',  findWalletByStripe)

}