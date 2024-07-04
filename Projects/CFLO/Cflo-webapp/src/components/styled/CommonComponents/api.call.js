const { default: Api } = require("../../../helpers/Api");

export const getCategoryByName = async (obj) => {
    try {
        const res = await Api.post("category/getCats", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const createNewCategory = async (obj) => {
    try {
        const res = await Api.post("create/category/new", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const pinUpBlogAndUnPinBlogs = async (obj) => {
    try {
        const res = await Api.post("blog/pinUpBlogs", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getAllFiles = async (obj) => {
    try {
        const res = await Api.post("file/get", obj);
        const data = res?.result;
        return data;
    } catch (error) {
        console.log(error);
    }
};