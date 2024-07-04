const { default: Api } = require("../../helpers/Api");


export const updateDeleteFlagForManyFiles = async (obj) => {
  try {
    const updatedData = await Api.post("user/updateFileDelete/many", obj);
    console.log(updatedData);
    return updatedData;
  } catch (error) {
    console.log(error);
  }
};

export const updateDeleteFlagForSingleFiles = async (obj) => {
  try {
    const updatedData = await Api.post("user/updateFileDelete", obj);
    console.log(updatedData);
    return updatedData;
  } catch (error) {
    console.log(error);
  }
};

export const updateConversation = async (obj) => {
  try {
    const updatedData = await Api.post("chat/conversation/update", obj);
    console.log(updatedData);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const initConversation = async (obj) => {
  try {
    const updatedData = await Api.post("chat/initConv", obj);
    console.log(updatedData);
    return updatedData;
  } catch (error) {
    console.log(error);
  }
};

export const addParticipantsWithConv = async (obj) => {
  try {
    const updatedData = await Api.post("chat/add/participants/conv", obj);
    console.log(updatedData);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateAccessRole = async (obj) => {
  try {
    const updatedData = await Api.post("accessrole/update", obj);
    console.log(updatedData);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};
