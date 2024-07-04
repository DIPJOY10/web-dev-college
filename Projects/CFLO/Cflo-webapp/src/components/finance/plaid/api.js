
import Api from '../../../helpers/Api';
import {appName} from '../../../config/app.config';
import config from "../../../config/index";
export const generateToken = async (walletId, dispatch, history, setLoading)=>{
  if (walletId) {
    if (setLoading) {
      setLoading(true);
    }
    var redirectUrl = config.BASE_URL + 'plaid/oauth'
    console.log(config.BASE_URL,redirectUrl)
    const tokenRes = await Api.post('plaid/token/create', {
      walletId,
      redirectUrl,
      client_name: appName,
    });

    if (setLoading) {
      setLoading(false);
    }


    const data = tokenRes?.data;

    console.log('data token generated ', data);

    if (data) {
      dispatch({
        type: 'AddWallet',
        payload: {
          plaidLinkToken: {
            ...data,
            walletId,
          },
        },
      });

      history.push('/plaid/oauth/');
    } 
  }
};

export const exchangeToken = async (walletId, metadata)=>{
  try {
    if (walletId) {
      const tokenRes = await Api.post('plaid/token/exchange', {
        walletId,
        metadata,
      });

      const data = tokenRes?.data;
      return data;
    }
  }
  catch (error) {
    return null;
  }
};



