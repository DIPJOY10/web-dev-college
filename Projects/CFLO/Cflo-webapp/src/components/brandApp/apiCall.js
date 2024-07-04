import Api from '../../helpers/Api.js';

export const createBrandApp = async (obj) => {
    try {
        const dataRes = await Api.post('brand/app/create', obj);
        const getData = dataRes?.data;
        return getData;
    }
    catch (error) {
        return null;
    }
};

export const getBrandApp = async (obj) => {
    try {
        const dataRes = await Api.post('brand/app/getByProfile', obj);
        const getData = dataRes?.data;
        return getData;
    }
    catch (error) {
        return null;
    }
};

export const getBrandAppById = async (obj) => {
    try {
        const dataRes = await Api.post('brand/app/getById', obj);
        const getData = dataRes?.data;
        return getData;
    }
    catch (error) {
        return null;
    }
};

export const updateBrandApp = async (obj) => {
    try {
        const dataRes = await Api.post('brand/app/update', obj);
        const getData = dataRes?.data;
        return getData;
    }
    catch (error) {
        return null;
    }
};