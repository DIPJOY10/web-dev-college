import Api from '../../../helpers/Api.js';

export const updateWallet = async (obj)=>{
    try {
      if (obj) {
        const walletRes = await Api.post('wallet/update', obj);
        const resData = walletRes?.data;
        return resData;
      }
    }
    catch (error) {
      return null;
    }
  };

export const removeDwollaBankAccount = async (obj)=>{
    try {
      if (obj) {
        const removeRes = await Api.post('dwolla/remove/dwollaBankAccount', obj);
        const resData = removeRes?.data;
        return resData;
      }
    }
    catch (error) {
      return null;
    }
  };










