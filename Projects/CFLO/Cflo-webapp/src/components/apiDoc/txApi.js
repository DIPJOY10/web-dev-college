import Api from "../../helpers/Api";

export const createTx = async (obj)=>{
  try {
    const billRes = await Api.post('transaction/create', obj);
    const data = billRes?.data;
    return data;
  }
  catch (error) {

  }
};
  
export const updateTx = async (obj)=>{
  try {
    const billRes = await Api.post('transaction/create', obj);
    const data = billRes?.data;
    return data;
  }
  catch (error) {

  }
};

export const deleteTx = async (obj)=>{
  try {
    const billRes = await Api.post('transaction/create', obj);
    const data = billRes?.data;
    return data;
  }
  catch (error) {

  }
};


export const apiData = [
    {
        name:''
    },
]