const User = require('../../models/user.model');
const Checkout = require('../../models/checkout.model');
const Wallet = require('../../models/wallet.model')
const StripeCustomer = require('../../models/stripe.customer.model');
const BillingAccount = require('../../models/wallet.billing.account')
const StripePaymentIntent = require('../../models/stripe.payment.intent.model')
const Transaction = require('../../models/wallet.transaction.model')

const keys = require('../../keys/keys');
const stripe = require("stripe")(keys.secretKey);
var _ = require('lodash');
const { findStripeCustomerIdHelper, createStripeConnectCustomerHelper } = require('./stripe.connect.customer.controller.js')

const createCustomerToken = async (req, res) => {

  var billingAccount = new BillingAccount(req.body);
  var customer = await stripe.customers.create({
    name: req.body.name,
    address: req.body.address
  });
  billingAccount.stripeCustomerId = customer.id
  billingAccount = await billingAccount.save();
  var wallet = await Wallet.findById(req.body.wallet);
  if (wallet.billingAccount) { } else {
    wallet.billingAccount = billingAccount._id;
    await wallet.save()
  }

  res.json({
    status: 200,
    data: billingAccount
  });
}

const attachAchDebitSource = async (req, res) => {

  try {
    var stripeCustomerId = req.body.stripeCustomerId;
    var stripeToken = req.body.stripeToken;
    const bankAccount = await stripe.customers.createSource(
      stripeCustomerId,
      { source: stripeToken }
    );
    billingAccount.stripeBankAccount = bankAccount.id
    billingAccount.plaidBankAccountToken = stripeToken
    var oldBankAccounts = billingAccount.stripeBankAccounts || []
    var newAccount = {
      plaidToken: {
        type: String,
      },
      stripeBankAccount: {
        type: String,
      },
    }
    billingAccount.stripeBankAccounts = _.concat(oldBankAccounts, [newAccount])
    billingAccount.save()


    res.json({
      status: 200,
      data: billingAccount
    });

  } catch (error) {
    console.log(error, ' is the error')
    res.json({
      status: 200,
      data: null
    });
  }

}

const createAchDebitSource = async (req, res) => {

  try {
    var achDebitSource = await stripe.sources.create({
      type: 'ach_debit',
      currency: 'usd',
      owner: {
        email: 'jenny.rosen@example.com'
      }
    });


    res.json({
      status: 200,
      data: achDebitSource
    });
  } catch (error) {

    console.log(error, ' is the error')

    res.json({
      status: 200,
      data: null
    });

  }


}


const createAchCharge = async (req, res) => {

  try {
    const customer = req.body.customer;
    const source = req.body.source;
    const amount = req.body.amount;
    const connectId = req.body.connectId

    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer,
      source, // Previously stored, then retrieved
      transfer_data: {
        amount,
        destination: connectId,
      },
    });

    res.json({
      status: 200,
      data: charge
    });

  } catch (error) {

    console.log(error, ' is the error')
    res.json({
      status: 200,
      data: null
    });

  }
}


const createPaymentIntentHelper = async (customerObject) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create(customerObject);
    return paymentIntent;
  } catch (error) {
    console.log('get error')
    console.log(error)
    return null
  }
}

const createPaymentIntentWithStripeAccountHelper = async (amount, currency, stripeAccount) => {
  try {

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      automatic_payment_methods: {
        enabled: true
      },
      application_fee_amount: 10000,
    }, {
      stripeAccount: stripeAccount,
    })

    return paymentIntent;

  } catch (error) {
    console.log('get error')
    console.log(error)
    return null
  }
}


const createPaymentIntentForExpense = async (req, res) => {
  const amount = parseInt(req.body.amount)
  const currency = req.body.currency
  const stripeAccount = req.body.stripeAccount

  await createPaymentIntentWithStripeAccountHelper(amount, currency, stripeAccount)
    .then(async (data) => {

      res.json({
        status: 200,
        data: data
      })

    })
    .catch(err => {
      res.json({
        status: 400,
        data: err
      })
    })
}


const createPaymentStripeIntentForAccPayHelper = async (amount, currency, stripeAccount, customerId) => {
  try {

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      payment_method_types: ['us_bank_account'],
      setup_future_usage: 'off_session',
      customer: customerId,
    }, {
      stripeAccount: stripeAccount,
    })

    return paymentIntent;

  } catch (error) {
    return error
  }
}


const createPaymentIntentForAccPay = async (req, res) => {

  const stripeCustomerIdCFlo = req.body.secondPartyStripeCustomerIdCFlo
  const secondPartyWalletId = req.body.secondPartyWalletId
  const firstPartyWalletId = req.body.firstPartyWalletId
  const txId = req.body.txId

  const amount = parseInt(req.body.amount)
  const currency = req.body.currency
  const stripeAccount = req.body.stripeAccount
  const email = req.body.email
  const name = req.body.name
  const address = req.body.address

  let customerId

  await findStripeCustomerIdHelper(secondPartyWalletId, firstPartyWalletId)
    .then(async (data) => {
      if (data) {

        customerId = data?.stripeConnectCustomer

      } else {

        const customer = await stripe.customers.create({
          email: email,
          name,
          address
        },
          {
            stripeAccount: stripeAccount,
          })

        customerId = customer.id

        await createStripeConnectCustomerHelper({
          stripeConnectCustomer: customer.id,
          stripeCustomer: stripeCustomerIdCFlo,
          customerWallet: secondPartyWalletId,
          stripeConnectAccountId: stripeAccount,
          stripeConnectWallet: firstPartyWalletId
        })
          .then((resData) => {
            console.log(resData)
          })
          .catch((err) => console.log(err))
      }
    })
    .catch((err) => console.log(err))

  await createPaymentStripeIntentForAccPayHelper(amount, currency, stripeAccount, customerId)
    .then(async (data) => {

      res.json({
        status: 200,
        data: data
      })

    })
    .catch(err => {
      res.json({
        status: 400,
        data: err
      })
    })
}


const getPaymentIntentForCustomerHelper = async (intentId, stripeAccount) => {

  console.log(intentId)
  console.log(stripeAccount)

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      intentId,
      {
        stripeAccount
      }
    );

    return paymentIntent;


  } catch (error) {
    console.log(error)
    return null
  }
}




const retrievePaymentIntent = async (req, res) => {

  const intentId = req.body.intentId
  const stripeAccount = req.body.stripeAccount

  await getPaymentIntentForCustomerHelper(intentId, stripeAccount)
    .then((data) => {
      res.json({
        status: 200,
        data: data
      })
    })
    .catch((err) => {
      res.json({
        status: 400,
        data: err
      })
    })

}



//http://localhost:3000/?  payment_intent=pi_3KksVLPKmUjK8C4A0oi5Wwkp  &  payment_intent_client_secret=pi_3KksVLPKmUjK8C4A0oi5Wwkp_secret_liwWxTD3iW2mvGa3rhZlU9tl7   &    redirect_status=succeeded




const retrievePaymentIntentPlatform = async (req, res) => {

  const intentId = req.body.intentId

  await getPaymentIntentHelper(intentId)
    .then((data) => {
      res.json({
        status: 200,
        data: data
      })
    })
    .catch((err) => {
      res.json({
        status: 400,
        data: err
      })
    })
}




const getPaymentIntentHelper = async (intentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      intentId
    );

    return paymentIntent;
  } catch (error) {
    console.log(error)
    return null
  }
}

const createPaymentIntent = async (req, res) => {
  const { checkoutId } = req.body;

  var checkout = await Checkout.findById(checkoutId);


  if (checkout) {

    const paymentIntent = await stripe.paymentIntents.create(customerObject);

    var newPaymentIntent = new StripePaymentIntent({
      stripeId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      checkout: checkoutId
    })

    newPaymentIntent = await newPaymentIntent.save();

    res.json(newPaymentIntent);

  } else {
    res.json({
      status: 400
    })
  }

};




const updatePaymentIntentHelper = async (tx, newAmount) => {
  const intentObj = tx.stripePaymentIntent
  const intentId = intentObj && intentObj.intentId
  await stripe.paymentIntents.update(
    intentId,
    { amount: newAmount }
  );

}

const stripeWebhook = async (req, res) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;

  try {
    const dataObject = req.body.data.object;
    console.log(dataObject, ' is the data object')

  } catch (error) {

  }
  // try {
  //   event = stripe.webhooks.constructEvent(
  //     req.body,
  //     req.headers['stripe-signature'],
  //     process.env.STRIPE_WEBHOOK_SECRET
  //   );
  // } catch (err) {
  //   console.log(err);
  //   console.log(`⚠️  Webhook signature verification failed.`);
  //   console.log(
  //     `⚠️  Check the env file and enter the correct webhook secret.`
  //   );
  //   return res.sendStatus(400);
  // }
  // Extract the object from the event.


  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  // switch (event.type) {
  //   case 'invoice.paid':
  //     // Used to provision services after the trial has ended.
  //     // The status of the invoice will show up as paid. Store the status in your
  //     // database to reference when a user accesses your service to avoid hitting rate limits.
  //     break;
  //   case 'invoice.payment_failed':
  //     // If the payment fails or the customer does not have a valid payment method,
  //     //  an invoice.payment_failed event is sent, the subscription becomes past_due.
  //     // Use this webhook to notify your user that their payment has
  //     // failed and to retrieve new card details.
  //     break;
  //   case 'customer.subscription.deleted':
  //     if (event.request != null) {
  //       // handle a subscription cancelled by your request
  //       // from above.
  //     } else {
  //       // handle subscription cancelled automatically based
  //       // upon your subscription settings.
  //     }
  //     break;
  //   default:
  // Unexpected event type
  // }

  res.sendStatus(200);
}

const getStripeAccountByWallet = async (req, res) => {
  try {

    const walletId = req.body.walletId

    const wallet = await Wallet.findById(walletId)
      .select("parent parentModelName stripeConnectAccountId")
      .populate({
        path: 'parent',
        populate: {
          path: 'parent',
          select: { 'displayName': 1 },
        }
      })

    res.json({
      status: 200,
      data: wallet
    })

  } catch (err) {
    res.json({
      status: 400,
      data: null,
      err
    })
  }
}

const findWalletByStripe = async (req, res) => {
  try {

    const stripeConnectId = req.body.stripeConnectId

    const wallet = await Wallet.findOne({ stripeConnectAccountId: stripeConnectId })
      .select("parent parentModelName stripeConnectAccountId")
      .populate({
        path: 'parent',
        populate: {
          path: 'parent',
          select: { 'displayName': 1 },
        }
      })

    res.json({
      status: 200,
      data: wallet
    })

  } catch (err) {
    res.json({
      status: 400,
      data: null,
      err
    })
  }
}








module.exports = {
  createCustomerToken,
  createPaymentIntentHelper,
  updatePaymentIntentHelper,
  getPaymentIntentHelper,
  createPaymentIntent,
  stripeWebhook,

  retrievePaymentIntent,
  retrievePaymentIntentPlatform,
  createPaymentIntentForExpense,
  createPaymentIntentForAccPay,
  /* pay stripe connect business using customer bank account ach payment */

  attachAchDebitSource,
  createAchDebitSource,
  createAchCharge,

  getStripeAccountByWallet,
  findWalletByStripe
}