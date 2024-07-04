const { default: Api } = require("../../helpers/Api");


export const getCategoryWithCount = async (obj) => {
    try {
        const updatedData = await Api.post("get/docs/category/count", obj);
        let result = updatedData.data
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const searchDocsByFilter = async (obj) => {
    try {
        const updatedData = await Api.post("search/docs/by/filter", obj);
        let result = updatedData.data
        return result;
    } catch (error) {
        console.log(error);
    }
};