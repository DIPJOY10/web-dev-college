const { default: Api } = require("../../helpers/Api");

export const getFiles = async (obj) => {
    try {
        const res = await Api.post("file/get", obj);
        const data = res?.result;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteFiles = async (obj) => {
    try {
        const res = await Api.post("file/delete/by/update", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getBlog = async (obj) => {
    try {
        const res = await Api.post("blog/getBlog", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getCategoryByName = async (obj) => {
    try {
        const res = await Api.post("category/getCats", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getAllPublishedBlogs = async () => {
    try {
        const res = await Api.post("blog/all");
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const createNewBlog = async (obj) => {
    try {
        const res = await Api.post("blog/admin/create", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getAllAdminBlog = async (obj) => {
    try {
        const res = await Api.post("blog/admin/all", obj);
        const data = res?.data;
        return data;
    } catch (error) {
        console.log(error);
    }
};