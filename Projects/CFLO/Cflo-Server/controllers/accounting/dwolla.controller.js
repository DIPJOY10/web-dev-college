const Wallet = require('../../models/wallet.model')
const DwollaCustomer = require('../../models/wallet.dwolla.customer.model')
const keys = require('../../keys/keys');
const { dwollaPlaidHelper } = require('./plaid.controller');
var Client = require("dwolla-v2").Client;
var _ = require('lodash');
const DwollaBankAccount = require('../../models/wallet.dwolla.BankAccount.model');

const ENVIRONMENT = {
  sandbox: "https://api-sandbox.dwolla.com",
  production: "https://api.dwolla.com",
};

const env = keys.dwollaEnv;

const dwolla = new Client({
  key: keys.dwollaKey,
  secret: keys.dwollaSecret,
  environment: keys.dwollaEnv, // defaults to 'production'
});

const getDwollaCustomerHelper = async (customerId, walletId) => {
  try {

    const customer = await DwollaCustomer.findById(customerId)
    const dwollaPath = customer.dwollaPath

    const resAcct = await dwolla.get(dwollaPath)
    const acct = resAcct.body

    console.log(walletId)
    console.log(customerId)

    const bankAccounts = await DwollaBankAccount.find({
      wallet: walletId,
      dwollaCustomer: customerId,
      deleteStatus: false
    })

    // const resFundSrcs = await dwolla.get(`${dwollaPath}/funding-sources`)
    // const fundSrcs = resFundSrcs.body
    const fundSrcs = bankAccounts

    console.log(fundSrcs)

    return {
      data: {
        customer,
        acct,
        fundSrcs
      }
    }

  } catch (error) {
    return {
      data: null,
      error
    }
  }
}


const getCustomer = async (req, res) => {

  const customerId = req.body.customerId
  const walletId = req.body.walletId

  console.log('me dwolla')
  console.log(walletId)

  const obj = await getDwollaCustomerHelper(customerId, walletId)

  if (obj.data) {
    res.json({
      status: 200,
      ...obj
    });

  } else {
    res.json({
      status: 400,
      ...obj
    });
  }


}


const getIavToken = async (req, res) => {

  try {

    const walletId = req.body.walletId
    const wallet = await Wallet.findById(walletId)
      .populate('dwollaCustomer')


    const dwollaCustomers = await DwollaCustomer.find({
      wallet: walletId
    })

    const dwollaCustomer = dwollaCustomers[0]
    const dwollaPath = dwollaCustomer.dwollaPath


    const restoken = await dwolla.post(`${dwollaPath}/iav-token`)
    const token = restoken.body

    res.json({
      status: 200,
      data: {
        token
      }
    });

  } catch (error) {

    res.json({
      status: 400,
      data: null,
      error
    });

  }


}




function generateClientToken(action, customerId) {
  const url = `/client-tokens`;
  const body = {
    action: action,
  };

  if (customerId) {
    body._links = {
      customer: {
        href: `${ENVIRONMENT[env]}/customers/${customerId}`,
      },
    };
  }

  return dwolla
    .post(url, body)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      return error;
    });
}

function generateClientTokenWithBody(body) {
  const url = `/client-tokens`;

  return dwolla
    .post(url, body)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      return error;
    });
}


const createCustomerToken = async (req, res) => {


  generateClientToken("customer.create").then((cRes) => {

    console.log(cRes);

    res.json({
      status: 200,
      data: cRes.token
    });
  });
}


const createReceiveOnlyCustomerHelper = async (dwollaPath, fName, lName, email, walletId) => {
  try {

    const dwollaCustomer = new DwollaCustomer({
      dwollaPath: dwollaPath,
      type: 'Pal',
      name: fName + " " + lName,
      email: email,
      verified: false,
      wallet: walletId,
    });

    await dwollaCustomer.save()

    if (dwollaCustomer._id) {
      const wallet = await Wallet.findById(walletId)
      wallet.dwollaCustomer = dwollaCustomer._id
      await wallet.save()

      return { dwollaCustomer, wallet }
    }
  } catch (e) {
    console.log(e)
    return null
  }
}




const createReceiveOnlyCustomer = async (req, res) => {
  try {
    const walletId = req.body.walletId;

    var requestBody = {
      firstName: req.body.fName,
      lastName: req.body.lName,
      email: req.body.email,
      type: "receive-only",
      ipAddress: req.body.ipAddress,
    };

    await dwolla.post("customers", requestBody)
      .then(async (dwollaRes) => {
        const path = dwollaRes.headers.get("location")
        await createReceiveOnlyCustomerHelper(path, req.body.fName, req.body.lName, req.body.email, walletId)
          .then((data) => {
            res.json({
              status: 200,
              data
            });
          })
      })
      .catch((err) => {
        res.json({
          status: 400,
          data: null,
          err
        });
      })
  } catch (err) {
    res.json({
      status: 400,
      data: null,
      err
    });
  }
}



const dwollaAttach = async (req, res) => {


  const resAcct = await dwolla.get(req.body.dwollaPath)

  console.log(resAcct)


  const dwollaCustomer = new DwollaCustomer(
    {
      dwollaPath: req.body.dwollaPath,
      type: req.body.type,
      name: resAcct.body.firstName + " " + resAcct.body.lastName,
      email: resAcct.body.email,
      verified: req.body.verified,
      wallet: req.body.wallet,
    });


  await dwollaCustomer.save()

  const walletId = req.body.wallet
  const wallet = await Wallet.findById(walletId)
  wallet.dwollaCustomer = dwollaCustomer._id

  await wallet.save()

  res.json({
    dwollaCustomer,
    wallet
  })


}




const setDefaultSrc = async (req, res) => {


  try {

    const url = req.body.url;
    const customerId = req.body.customerId;

    let customer = await DwollaCustomer.findByIdAndUpdate(customerId, {
      _id: customerId,
      defaultFundingSrc: url
    }, { new: true });

    res.json({
      status: 200,
      data: customer
    });

  } catch (error) {


    res.json({
      status: 400,
      data: null,
      error
    });

  }

}

// Currently done for plaid only

const addFundingSrc = async (req, res) => {

  try {
    // const customerUrl = 'https://api-sandbox.dwolla.com/customers/c2875bd5-fed7-4017-a481-af545213666b'
    const customerUrl = req.body.customerUrl;
    const plaidAccount = req.body.plaidAccount;
    const item = req.body.item;
    const accessToken = plaidAccount.exchangeToken.accessToken
    console.log(req.body)
    const plaidToken = await dwollaPlaidHelper(accessToken, item)



    var requestBody = {
      plaidToken,
      name: item.name,
    };



    dwolla
      .post(`${customerUrl}/funding-sources`, requestBody)
      .then((dwollaRes) => {

        res.json({
          status: 200,
          data: {
            dwollaRes
          }
        })
      })
      .catch(error => {
        res.json({
          status: 400,
          data: null,
          error
        })
      });

  } catch (error) {

    console.log(error, ' is the error')

    res.json({
      status: 400,
      data: null,
      error
    })
  }
}




// console.log(dwollaToken)

module.exports = {
  dwolla,
  setDefaultSrc,
  getDwollaCustomerHelper,
  dwollaAttach,
  getCustomer,
  getIavToken,
  addFundingSrc,
  createCustomerToken,
  createReceiveOnlyCustomer
}