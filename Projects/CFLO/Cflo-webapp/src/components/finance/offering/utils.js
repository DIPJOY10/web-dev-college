import Api from '../../../helpers/Api';

export const getIncomeChartAccounts = async (obj)=>{
  try {
    const res = await Api.post('wallet/incomeandexpense/chartaccounts/get', obj);
    const dataRes = res.data;
    return dataRes;
  }
  catch (error) {
    return null;
  }
};

export const getChartAccounts = async (obj)=>{
  try {
    const res = await Api.post('wallet/chart/get', obj);
    const dataRes = res.data;
    return dataRes;
  }
  catch (error) {
    return null;
  }
};

export const getOfferingsRelation = async (obj)=>{
  try {
    const res = await Api.post('wallet/offeringRelation/get', obj);
    const dataRes = res.data;
    return dataRes;
  }
  catch (error) {
    return null;
  }
};

export const updateOfferingRelation = async (obj)=>{
  try {
    const res = await Api.post('wallet/offeringRelation/update', obj);
    const dataRes = res.data;
    return dataRes;
  }
  catch (error) {
    return null;
  }
};

export const getOfferingByName = async (obj)=>{
  try {
    const resData = await Api.post('wallet/offering/get/byname', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
   console.log(error)
  }
};

export const createOfferingAndRelation = async (obj)=>{
  try {
    const resData = await Api.post('wallet/offering/create/offeringandrelation', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
   console.log(error)
  }
};

export const createOfferingRelation = async (obj)=>{
  try {
    const resData = await Api.post('wallet/offering/newrelation/create', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
  }
};

export const getOfferingWithRelation = async (obj)=>{
  try {
    const resData = await Api.post('wallet/offering/relation/get', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
  }
};

 