const {default: Api} = require('../../../helpers/Api');

export const updateIntentAmount = async (obj)=>{
  try {
    const receivedData = await Api.post('brand/app/updateamount', obj);
    const updatedIntentAndTx = receivedData?.data;
    return updatedIntentAndTx;
  }
  catch (error) {
   console.log(error)
  }
};

export const getCouponData = async (obj)=>{
  try {
    const receivedData = await Api.post('coupon/get', obj);
    console.log(receivedData);
    const couponData = receivedData?.data;
    return couponData ; 
  }
  catch (error) {
   console.log(error)
  }
};

export const makeTxPaid = async (obj)=>{
  try {
    const receivedData = await Api.post('brand/app/paid', obj);
    console.log(receivedData);
    const updatedData = receivedData?.data;
    return updatedData ;
  }
  catch (error) {
   console.log(error)
  }
};

export const retrievePaymentIntentPlatform  = async (obj) =>{
  try {
    if (obj) {
      const intentRes = await Api.post('stripe/retrievePaymentIntent/platform', obj);
      const paymentIntent = intentRes?.data;
      return paymentIntent;
    }
  }
  catch (error) {
    return null;
  }
}