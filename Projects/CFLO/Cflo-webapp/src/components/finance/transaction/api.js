const {default: Api} = require('../../../helpers/Api');

export const createTx = async (obj)=>{
  try {
    const billRes = await Api.post('transaction/create', obj);
    const data = billRes?.data;
    return data;
  }
  catch (error) {
   console.log(error)
  }
};

export const createTxTemplate = async (obj)=>{
  try {
    const templateRes = await Api.post('txtemplate/create', obj);
    const data = templateRes?.data;
    return data;
  }
  catch (error) {
   console.log(error);
  }
};

export const getProfileByWallet = async (obj)=>{
  try {
    const templateRes = await Api.post('profile/get/by/wallet', obj);
    const data = templateRes?.data;
    return data;
  }
  catch (error) {
   console.log(error);
  }
};

export const getTxByWallet = async (obj)=>{
  try {
    const allTxs = await Api.post('transaction/bywalletget', obj);
    const txArr = allTxs?.data;
    console.log(allTxs);
    return txArr;
  }
  catch (error) {
    return [];
  }
};

export const createFileDocs = async (obj) => {
  try {
    const updatedData = await Api.post("doc/create", obj);
    const getData = updatedData?.data;
    return getData;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFileDocs = async (obj) => {
  try {
    const updatedData = await Api.post("doc/delete", obj);
    const getData = updatedData?.data;
    return getData;
  } catch (error) {
    console.log(error);
  }
};

export const updateDeleteFlagForManyFiles = async (obj) => {
  try {
    const updatedData = await Api.post("user/updateFileDelete/many", obj);
    console.log(updatedData);
    return updatedData;
  } catch (error) {
    console.log(error);
  }
};

export const getBothSideTxByWallet = async (obj)=>{
  try {
    const allTxs = await Api.post('transaction/bywalletget/bothside', obj);
    const txArr = allTxs?.data;
    console.log(allTxs);
    return txArr;
  }
  catch (error) {
    return [];
  }
};

export const getTxTemplateByWallet = async (obj)=>{
  try {
    const allTemplateTxs = await Api.post('txtemplate/bywalletget', obj);
    const txTemplateArr = allTemplateTxs?.data;
    console.log(txTemplateArr);
    return txTemplateArr;
  }
  catch (error) {
    return [];
  }
};

export const constrcutArrayOfBillNo = async (txs, typeNo)=>{
    try{
         const newArr = await txs.map((tx)=>{ 
           if(tx?.[typeNo]){
             return tx?.[typeNo];
           }
          })
         return newArr;
    }
    catch (error) {
       return []; 
    }
};

export const updateTx = async (obj)=>{
  try {
    const billRes = await Api.post('transaction/update', obj);
    const data = billRes?.data;
    console.log(data);
    return data;
  }
  catch (error) {
    return null;
  }
};

export const updateTxTemplate = async (obj)=>{
  try {
    const temlateRes = await Api.post('txtemplate/update', obj);
    const data = temlateRes?.data;
    console.log(data);
    return data;
  }
  catch (error) {
    return null;
  }
};


export const updateTxTemplateScheduleData = async (obj)=>{
  try {
    console.log(obj);
    const temlateRes = await Api.post('txtemplate/updateScheduleData', obj);
    const data = temlateRes?.data;
    console.log(data);
    return data;
  }
  catch (error) {
    return null;
  }
};

export const deleteTx = async (obj)=>{
  try {
    const billRes = await Api.post('transaction/delete', obj);
    const data = billRes?.data;
    return billRes;
  }
  catch (error) {
    return null
  }
};

export const deleteTxTemplate = async (obj)=>{
  try {
    const billRes = await Api.post('txtemplate/delete', obj);
    const data = billRes?.data;
    return billRes;
  }
  catch (error) {
    return null
  }
};

export const getTxByTemplateId = async (obj)=>{
  try {
    const data = await Api.post('transaction/bytemplate', obj);
    const allTxs = data?.data;
    return allTxs;
  }
  catch (error) {
  return null
  }
};

export const createJournalEntryandLine = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/entry/create', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const getDiscountOrTaxes = async (obj)=>{
  try {
    const resData = await Api.post('discountortax/relation/get', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const invoiceInitialSubmit = async (obj)=>{
  try {
    const resData = await Api.post('wallet/invoice/initial/submit', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const billInitialSubmit = async (obj)=>{
  try {
    const resData = await Api.post('wallet/bill/initial/submit', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const editSubmittedInvoice = async (obj)=>{
  try {
    const resData = await Api.post('wallet/invoice/submitted/edit', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const editSubmittedBill = async (obj)=>{
  try {
    const resData = await Api.post('wallet/bill/submitted/edit', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};


export const markInvoiceAsPaid = async (obj)=>{
  try {
    const resData = await Api.post('wallet/invoice/initial/markaspaid', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const markBillAsPaid = async (obj)=>{
  try {
    const resData = await Api.post('/wallet/bill/initial/markaspaid', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const markSubmittedInvoiceAsPaid = async (obj)=>{
  try {
    const resData = await Api.post('wallet/invoice/submitted/markaspaid', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const markSubmittedBillAsPaid = async (obj)=>{
  try {
    const resData = await Api.post('wallet/bill/submitted/markaspaid', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const getUserByName = async (obj)=>{
  try {
    const resData = await Api.post('search/users', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const getOrgByName = async (obj)=>{
  try {
    const resData = await Api.post('search/org', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const getOwnUsers = async (obj)=>{
  try {
    const resData = await Api.post('wallet/relation/get/all', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

export const getAccessibleProject = async (obj)=>{
  try {
    const resData = await Api.post('project/accessible/get', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
    return null;
  }
};

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

export const projectUpdateForTx = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('project/update/for/transaction', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const orgUpdateForTx = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('organization/update/for/transaction', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const userUpdateForTx = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('user/update/for/transaction', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const walletUpdateForTx = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('wallet/update', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}





