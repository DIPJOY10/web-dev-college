import Api from '../../helpers/Api';


export const createPortfolio = async (obj) => {
  try {
    const updatedData = await Api.post("property/portfolio/create", obj);
    const getData = updatedData?.data;
    return getData;
  } catch (error) {
    console.log(error);
  }
};

export const editPortfolio = async (obj) => {
  try {
    const updatedData = await Api.post("property/portfolio/update", obj);
    const getData = updatedData?.data;
    return getData;
  } catch (error) {
    console.log(error);
  }
};

export const getProfileById = async (obj) => {
  try {
    if (obj) {
      const dataRes = await Api.post('profile/getProfile', obj);
      const getData = dataRes?.data;
      return getData;
    }
  }
  catch (error) {
    return null;
  }
};

export const getPortfolioByProfile = async (obj) => {
  try {
    if (obj) {
      const dataRes = await Api.post('property/portfolio/find/byprofile', obj);
      const getData = dataRes?.data;
      return getData;
    }
  }
  catch (error) {
    return null;
  }
};

export const getPortfolioDataById = async (obj) => {
  try {
    if (obj) {
      const dataRes = await Api.post('property/get/portfolio/byid', obj);
      const getData = dataRes?.data;
      return getData;
    }
  }
  catch (error) {
    return null;
  }
};

export const createManyAccessRoles = async (obj) => {
  try {
    if (obj) {
      const dataRes = await Api.post('accessroles/create/many', obj);
      const getData = dataRes?.data;
      return getData;
    }
  }
  catch (error) {
    return null;
  }
};


export const updateAccessRole = async (obj) => {
  try {
    if (obj) {
      const dataRes = await Api.post('accessrole/update', obj);
      const getData = dataRes?.data;
      return getData;
    }
  }
  catch (error) {
    return null;
  }
};



