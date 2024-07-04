import Api from '../../../helpers/Api';


export const getPlaidTxsAndAccounts = async (walletId)=>{
  try {
    if (walletId) {
      const plaidTxDataRes = await Api.post('plaid/get/transactionsbywallet', { walletId });
      const plaidTxData = plaidTxDataRes?.data;
      return plaidTxData;
    }
  }
  catch (error) {
    return null;
  }
};





