const {default: Api} = require('../../../helpers/Api');

export const getJournalEntry = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/entry/get', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
   return null
  }
};

export const getJournalEntryAllNumbers = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/entry/getnumbers', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
   return null
  }
};

export const updateJournalEntry = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/entry/update', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
   return null
  }
};

export const getAllJournalEntries = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/entries/getall', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
   return null
  }
};

export const createTwoJournalLines = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/line/create', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
   return null
  }
};

export const deleteJournalLines = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/line/deleted', obj);
    const resultData = resData?.data;
    return resData;
  }
  catch (error) {
   console.log(error)
   return null
  }
};


export const updateJournalLines = async (obj)=>{
  try {
    const resData = await Api.post('wallet/journal/line/update', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
   return null
  }
}

export const getChartAccounts = async (obj)=>{
    try {
      const resData = await Api.post('wallet/chart/get', obj);
      const resultData = resData?.data;
      return resultData;
    }
    catch (error) {
      console.log(error)
      return null;
    }
  }


export const submitJournalEntryToProcess  = async (obj)=>{
    try {
      const resData = await Api.post('wallet/journal/entry/submit', obj);
      const resultData = resData?.data;
      return resultData;
    }
    catch (error) {
      console.log(error)
      return null;
    }
  }


export const deleteJournalEntry = async (obj)=>{
    try {
      const resData = await Api.post('wallet/journal/entry/delete', obj);
      const resultData = resData?.data;
      return resultData;
    }
    catch (error) {
      console.log(error)
      return null;
    }
  }