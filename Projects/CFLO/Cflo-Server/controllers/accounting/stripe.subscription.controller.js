const User = require('../../models/user.model');

const Wallet = require('../../models/wallet.model')
const StripeCustomer = require('../../models/stripe.customer.model');
const BillingAccount = require('../../models/wallet.billing.account')

const keys = require('../../keys/keys');
const Subscription = require('../../models/subscription.model');
const stripe = require("stripe")(keys.secretKey);


const createSubscription = async (req, res) => {

    const accountId = req.body.accountId;
    const priceId = req.body.priceId;
  
    try {

        var billingAccount = await BillingAccount.findById(accountId)
        var stripeCustomerId = billingAccount.stripeCustomerId
        
        const stripeSubscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });

        const subscription = new Subscription({
            active: true,
            stripeSubscriptionId:stripeSubscription.id,
            user: billingAccount.user,
            stripeCustomerId,
            stripePriceId:priceId,
            stripePaymentIntent: stripeSubscription.latest_invoice.payment_intent.id,
            stripeClientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret,          
        })


    
        await subscription.save()

        res.send({
            status: 200,
            data: subscription
        });

    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }

}

const setDefaultPaymentMethod = async (req, res)=>{
    const subscriptionId = req.body.subscriptionId
    const subscription = await Subscription.findById(subscriptionId)
    const paymentIntentId = subscription.stripePaymentIntent

  
    // Retrieve the payment intent used to pay the subscription
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const stripeSubscriptionId = subscription.stripeSubscriptionId;

    const stripeSubscriptionNew = await stripe.subscriptions.update(
      stripeSubscriptionId,
      {
        default_payment_method: paymentIntent.payment_method,
      },
    );

    var stripeDate = stripeSubscriptionNew.current_period_end

    subscription.current_period_end = stripeDate
    subscription.periodEnd = new Date(Number(stripeDate)*1000)
    
    await subscription.save()

    res.json({
        status: 200,
        data: subscription
    })
}

const cancelSubscription = async (req, res) => {
    // Delete the subscription
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    );

    res.send(deletedSubscription);
}

const updateSubscription = async (req, res) => {
    const subscription = await stripe.subscriptions.retrieve(
      req.body.subscriptionId
    );
    const updatedSubscription = await stripe.subscriptions.update(
      req.body.subscriptionId,
      {
        cancel_at_period_end: false,
        items: [
          {
            id: subscription.items.data[0].id,
            price: "price_H1NlVtpo6ubk0m",
          },
        ],
      }
    );
  
    res.send(updatedSubscription);
}

module.exports = {
    createSubscription,
    setDefaultPaymentMethod,
    cancelSubscription,
    updateSubscription,
}