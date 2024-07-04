import { saleProperties, similarPropertiesRent } from "./dummyData"
const { default: Api } = require("../../helpers/Api");

//CRUD for Project Description Section
export const getPropertyType = async () => {
  try {
    const propertyType = await Api.post("property/type");
    const data = propertyType?.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateData = async (ProjectData, DescriptionObject) => {
  try {
    const res = await Api.post("property/description/updateData", {
      ...ProjectData,
      ...DescriptionObject,
    });
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const findProject = async (teamId) => {
  try {
    const projectData = await Api.post(
      "property/description/findPropertyByTeamId",
      { teamId }
    );
    return projectData.data;
  } catch (error) {
    console.log(error);
  }
};

//CRUD for Report section

export const createAnalysisReport = async (reportData, teamId) => {
  try {
    let res = await Api.post("/property/report/create", {
      ...reportData,
      teamId,
    });
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchReports = async (teamId) => {
  try {
    const reports = await Api.post("/property/report/getReports", { teamId });
    return reports.data;
  } catch (error) {
    console.log(error);
  }
};

export const getReport = async (reportId) => {
  try {
    const report = await Api.post("/property/report/getReport", { reportId });
    return report.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteReport = async (reportId, teamId) => {
  try {
    const res = await Api.post("/property/report/delete", { reportId, teamId });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateAnalysisReport = async (reportData) => {
  try {
    const pulledData = await Api.post("/property/report/update", reportData);
    return pulledData.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateAnalysisReportById = async (reportData) => {
  try {
    const pulledData = await Api.post("property/report/update/byId", reportData);
    return pulledData.data;
  } catch (error) {
    console.log(error);
  }
};

//CRUD for Itemized Section

export const createItem = async (ItemData) => {
  try {
    const res = await Api.post("/property/report/reportItem/create", ItemData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchItems = async (searchFields) => {
  try {
    const items = await Api.post(
      "/property/report/reportItem/fetch",
      searchFields
    );
    return items.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteItem = async (ItemData) => {
  try {
    const res = await Api.post("/property/report/reportItem/delete", ItemData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateItem = async (ItemData) => {
  try {
    const res = await Api.post("/property/report/reportItem/update", ItemData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPropertiesByAddress = async (obj) => {
  try {
    const res = await Api.post("/get/properties/from/zillow", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const selectedPropertyUse = async (obj) => {
  try {
    const res = await Api.post("/get/property/from/selectedone", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getProjectByTeamId = async (obj) => {
  try {
    const res = await Api.post("/property/description/findPropertyByTeamId", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSimilerProperties = async (obj) => {
  try {
    const res = await Api.post("/get/properties/similar/forsale", obj);
    return res.data;
    // return saleProperties;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSimilerPropertiesForRent = async (obj) => {
  try {
    const res = await Api.post("get/properties/similar/forrent", obj);
    return res.data;
    // return similarPropertiesRent;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRentEstimate = async (obj) => {
  try {
    const res = await Api.post("get/estimate/forRent/fromZillow", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPropertyByZpid = async (obj) => {
  try {
    const res = await Api.post("/get/property/byZpid/fromZillow", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPropertyImages = async (obj) => {
  try {
    const res = await Api.post("/get/property/images/byZpid/fromZillow", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addDefaultPolicy = async (obj) => {
  try {
    const res = await Api.post("/get/findAndAdd/purchase/policy", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updatePurchaseCriteria = async (obj) => {
  try {
    const res = await Api.post("/update/purchase/criteria", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllAdminProfileCriteria = async (obj) => {
  try {
    const res = await Api.post("/get/allAdmin/profile/criteria", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateProjectData = async (obj) => {
  try {
    const res = await Api.post("/project/update/withpopulate", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createPolicy = async (obj) => {
  try {
    const res = await Api.post("/create/policy/criteria/new", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getReports = async (obj) => {
  try {
    const res = await Api.post("/property/report/get/reports/byObj", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getReportsByIdsArr = async (obj) => {
  try {
    const res = await Api.post("/property/report/get/reports/by/idsarr", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createCompareReports = async (obj) => {
  try {
    const res = await Api.post("create/compare/reports/new", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCompareReports = async (obj) => {
  try {
    const res = await Api.post("/get/compare/reports/byId", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateCompareReport = async (obj) => {
  try {
    const res = await Api.post("/update/compare/reports/byId/obj", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const projectDataUpdate = async (obj) => {
  try {
    const res = await Api.post("/project/update", obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};