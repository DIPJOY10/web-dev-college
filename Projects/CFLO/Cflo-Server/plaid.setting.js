const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const keys = require('./keys/keys')
const PLAID_CLIENT_ID = keys.PLAID_CLIENT_ID;
const PLAID_SECRET = keys.PLAID_SECRET;
const PLAID_ENV = keys.PLAID_ENV || 'sandbox';

const PLAID_PRODUCTS = (keys.PLAID_PRODUCTS || 'transactions').split(
  ',',
);

const PLAID_COUNTRY_CODES = (keys.PLAID_COUNTRY_CODES || 'US').split(
    ',',
);

const PLAID_REDIRECT_URI = keys.PLAID_REDIRECT_URI || '';

const PLAID_ANDROID_PACKAGE_NAME = keys.PLAID_ANDROID_PACKAGE_NAME || '';
// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

module.exports = {
    plaidClient,
    PLAID_PRODUCTS,
    PLAID_COUNTRY_CODES,
    PLAID_REDIRECT_URI,
    PLAID_ANDROID_PACKAGE_NAME
}