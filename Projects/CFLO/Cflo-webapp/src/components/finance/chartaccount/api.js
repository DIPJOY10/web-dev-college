const {default: Api} = require('../../../helpers/Api');


export const getChartAccountTypes = async ()=>{
  try {
    const resData = await Api.post('wallet/chart/types');
    const allTypes = resData?.data;
    return resData;
  }
  catch (error) {
    return null;
  }
};


export const getChartAccounts = async (walletId)=>{
  try {
    const billRes = await Api.post('wallet/chart/get', {
        walletId
    });
    const data = billRes?.data;
    return data;
  }
  catch (error) {
    console.log(error)
    return null;
  }
};

export const createChartAccount = async (obj)=>{
  try {
    const resData = await Api.post('wallet/chart/create', obj);
    const data = resData?.data;
    return resData;
  }
  catch (error) {
    console.log(error);
    return null;
  }
};

export const updateChartAccounts = async (obj)=>{
  try {
    const resData = await Api.post('wallet/chart/update', obj);
    const data = resData?.data;
    return resData;
  }
  catch (error) {
    console.log(error);
    return null;
  }
};
