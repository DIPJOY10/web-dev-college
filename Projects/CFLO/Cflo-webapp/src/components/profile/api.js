const { default: Api } = require("../../helpers/Api");

//CRUD for User Description Section

export const updateUserInfo = async (userData) => {
  try {
    const updatedData = await Api.post("/user/updateInfo", userData);
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserInfoArray = async (userData) => {
  try {
    const updatedData = await Api.post("/user/updateInfoArray", userData);
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserInfo = async (userData) => {
  try {
    const userInfo = await Api.post("/user/fetchUserInfo", userData);
    return userInfo.data;
  } catch (error) {
    console.log(error);
  }
};

export const editUserArray = async (userData) => {
  try {
    const updatedData = await Api.post("/user/edit/array", userData);
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteArrayItem = async (userData) => {
  try {
    const updatedData = await Api.post("/user/delete/array", userData);
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const saveProjectInfo = async (projectData) => {
  try {
    const updatedData = await Api.post("/user/update/project", projectData);
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteProjectPic = async (projectData) => {
  try {
    const updatedData = await Api.post("/user/delete/projectPic", projectData);
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};
export const updateFileFlag = async (fileData) => {
  try {
    await Api.post("/user/updateFileDelete", fileData);
  } catch (error) {
    console.log(error);
  }
};
