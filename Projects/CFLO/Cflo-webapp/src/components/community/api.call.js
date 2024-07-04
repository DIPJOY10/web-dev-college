const { default: Api } = require("../../helpers/Api");

export const getCommunityCategoryCount = async (obj) => {
    try {
        const res = await Api.post("community/get/category/count", obj);
        const result = res?.data;
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const getCommunityPostWithFilter = async (obj) => {
    try {
        const res = await Api.post("post/communities-posts/with-filter", obj);
        const result = res?.joinedCommunitiesPosts;
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const updateCategory = async (obj) => {
    try {
        const res = await Api.post("community/update", obj);
        const result = res?.data;
        return result;
    } catch (error) {
        console.log(error);
    }
};