import Api from '../../../helpers/Api';


export const getRelatedCustomer = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/get/alldwollaBankAccounts', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const getRelationWithType = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('wallet/relation/find/type', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const getRelatedTxs = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('transaction/get/byrelation', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const findAndAddRelation = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('wallet/relation/findOrAdd', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const getTxAnalysisData = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('transaction/get/totalamount/groupby', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}