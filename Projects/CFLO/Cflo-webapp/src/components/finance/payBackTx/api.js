import Api from '../../../helpers/Api.js';


export const getTx = async (txId)=>{
  try {
    if (txId) {
      const txResponse = await Api.post('transaction/get', { txId });
      const txData = txResponse?.data;
      return txData;
    }
  }
  catch (error) {
    return null;
  }
};

export const createStripePaymentIntentExpense = async (obj) =>{
  try {
    if (obj) {
      const intentRes = await Api.post('stripe/createpaymentintent/expense', obj);
      const newPaymentIntent = intentRes?.data;
      return newPaymentIntent;
    }
  }
  catch (error) {
    return null;
  }
}

export const createStripePaymentIntentAccPay = async (obj) =>{
  try {
    if (obj) {
      const intentRes = await Api.post('stripe/createpaymentintent/accpay', obj);
      const newPaymentIntent = intentRes?.data;
      return newPaymentIntent;
    }
  }
  catch (error) {
    return null;
  }
}

export const retrievePaymentIntentTx = async (obj) =>{
  try {
    if (obj) {
      const intentRes = await Api.post('stripe/retrievePaymentIntent/fortx', obj);
      const paymentIntent = intentRes?.data;
      return paymentIntent;
    }
  }
  catch (error) {
    return null;
  }
}

export const txPaymentUpdate = async (obj) =>{
  try {
    if (obj) {
      const txRes = await Api.post('transaction/paymentupdate', obj);
      const txData = txRes?.data;
      return txData;
    }
  }
  catch (error) {
    return null;
  }
}

export const checkAvaliablePaymentMethod = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('wallet/payment/checkpaymethods', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const getAllDwollaBankAccounts = async(obj) => {
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

export const makePayment = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/make/payment', obj);
      const checkData = checkRes?.data;
      return checkRes
    }
  }catch (error) {
    return null;
  }
}


export const getDwollaTx = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/get/transaction', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const updateTx = async(obj) => {
  try{
    if(obj){
      const checkRes = await Api.post('transaction/update', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  } 
}

export const getAccessableProjectsAndOrgs = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/get/accessableprojectsandorgs', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const getDwollaBankAccountByProject = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/get/dwollaaccount/byprojects', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const getStripeAccountByWallet = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('stripe/get/account/bywallet', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const getDwollaAccountByUrl = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/get/dwollaaccount', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const getStripeAccountByStripeConnectId = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('stripe/get/account/bystripeconnectid', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}



export const getWallet = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/payment/getwalletanddwolla', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const getPlaidBankAccounts = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('plaid/get/bankaccounts', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const createDwollaCustomerForPal = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/payment/create/dwollaaccountforpal', obj);
      const checkData = checkRes?.data;
      return checkRes
    }
  }catch (error) {
    return null;
  }
}


export const getDwollaCustomerForPalAndAnonymousUser = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/payment/get/dwollaCustomerforPal', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const getDwollaBankAccount = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/get/dwollaBankAccount', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}

export const createRrceiveonlyCustomer = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/create/receiveonly/customer', obj);
      const checkData = checkRes?.data;
      return checkData
    }
  }catch (error) {
    return null;
  }
}


export const addRrceiveonlyBankAccounts = async (obj)=>{
  try{
    if(obj){
      const checkRes = await Api.post('dwolla/add/receiveonly/fundingsource', obj);
      const checkData = checkRes?.data;
      return checkRes
    }
  }catch (error) {
    return null;
  }
}






