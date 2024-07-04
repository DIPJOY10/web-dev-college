const {default: Api} = require('../../../helpers/Api');

export const getDiscountOrTaxByName = async (obj)=>{
  try {
    const resData = await Api.post('discountortax/get/byname', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
  }
};


export const createDiscountOrTaxAndRelation = async (obj)=>{
  try {
    const resData = await Api.post('discountortax/create/discountortaxandrelation', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
  }
};
export const createDiscountOrTaxRelation = async (obj)=>{
  try {
    const resData = await Api.post('discountortax/newrelation/create', obj);
    const resultData = resData?.data;
    return resultData;
  }
  catch (error) {
   console.log(error)
  }
};