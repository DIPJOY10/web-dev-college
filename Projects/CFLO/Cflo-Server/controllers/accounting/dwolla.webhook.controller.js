const DwollaWebhook = require('../../models/dwolla.webhook.model');
const { dwolla } = require('./dwolla.controller')
const Transaction = require('../../models/wallet.transaction.model')
const keys = require('../../keys/keys');
const { createJournalLineHelperFromStripePayment } = require('./transaction.controller');

const ENVIRONMENT = {
  sandbox: "https://api-sandbox.dwolla.com",
  production: "https://api.dwolla.com",
};

const env = keys.dwollaEnv;



const webhookSubscription = async () => {
  var requestBody = {
    url: `https://devapi.contractflo.com/api/dwolla/webhook1`,
    secret: "your webhook secret"
  };


  const dwollaWebhook = await DwollaWebhook.find();

  console.log(dwollaWebhook);

  if (dwollaWebhook.length === 0) {

    dwolla
      .post("webhook-subscriptions", requestBody)
      .then(async (dwollaRes) => {
        console.log(dwollaRes, ' is the dwollaRes')
        console.log(dwollaRes.headers.get("location"))

        const newDwollaWebhook = DwollaWebhook({
          subscriptionPath: dwollaRes.headers.get("location")
        })

        const savedWebhook = await newDwollaWebhook.save()

        console.log(savedWebhook)

      })
      .catch(error => {
        console.log(error, ' is the error')
      });


  }

}



const dwollaWebHookController = async (req, res) => {

  const topic = req.body.topic
  let tx
  console.log(req.body)
  const dwollaRes = req?.body?._links

  const strRemove = `${ENVIRONMENT[env]}/transfers/`
  const txUrl = dwollaRes?.resource?.href?.replace(strRemove, "")

  console.log(txUrl)

  switch (topic) {

    case "customer_bank_transfer_created":
    case "customer_transfer_created":
    case "customer_bank_transfer_completed":

      console.log("Processing Tx")
      tx = await Transaction.findOneAndUpdate({ dwollaTxId: txUrl }, { status: "Processing" })

      break;


    case "customer_transfer_failed":
    case "customer_bank_transfer_failed":
    case "customer_bank_transfer_creation_failed":
    case "customer_bank_transfer_cancelled":
    case "customer_transfer_cancelled":

      console.log("Failed Tx")
      tx = await Transaction.findOneAndUpdate({ dwollaTxId: txUrl }, { status: "Failed" })

      break;


    case "customer_transfer_completed":

      console.log("Paid")
      tx = await Transaction.findOne({ dwollaTxId: txUrl })
      if (tx) {
        await createJournalLineHelperFromStripePayment(tx._id)
          .then((data) => {
            console.log(data)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      break;

  }

  console.log(tx)

}


module.exports = {
  webhookSubscription,
  dwollaWebHookController,
}