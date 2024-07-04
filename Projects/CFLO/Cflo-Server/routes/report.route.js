const {
    createReport,
    getReports,
    getReport,
    deleteReport,
    updateReport,
    updateReportById,
    getReportsByObj,
    getReportsByTeamIdsArr
} = require("../controllers/report.controller");

const {
    getPropertiesByAddress,
    afterSelectProperty,
    salesSimilarProperties,
    rentSimilarProperties,
    getRentEstimate,
    getPropertyByZpid,
    getPropertyImgs
} = require("../controllers/property.analysis.controller");

const {
    findOrCreateAndAddPolicy,
    updatePurchaseCriteria,
    getAllAdminProfileCriterias,
    createPurchasePolicy,
    createCompareReport,
    getComparePopulate,
    updateCompareReport
} = require("../controllers/purchase.policy.controller")

module.exports = app => {
    app.post("/api/property/report/create", createReport);
    app.post("/api/property/report/getReports", getReports);
    app.post("/api/property/report/get/reports/byObj", getReportsByObj);
    app.post("/api/property/report/get/reports/by/idsarr", getReportsByTeamIdsArr);
    app.post("/api/property/report/getReport", getReport);
    app.post("/api/property/report/delete", deleteReport);
    app.post("/api/property/report/update", updateReport);
    app.post("/api/property/report/update/byId", updateReportById);

    app.post("/api/get/properties/from/zillow", getPropertiesByAddress)
    app.post("/api/get/property/from/selectedone", afterSelectProperty)
    app.post("/api/get/property/byZpid/fromZillow", getPropertyByZpid)
    app.post("/api/get/property/images/byZpid/fromZillow", getPropertyImgs)

    app.post("/api/get/properties/similar/forsale", salesSimilarProperties)
    app.post("/api/get/properties/similar/forrent", rentSimilarProperties)
    app.post("/api/get/estimate/forRent/fromZillow", getRentEstimate)

    app.post("/api/get/findAndAdd/purchase/policy", findOrCreateAndAddPolicy)
    app.post("/api/update/purchase/criteria", updatePurchaseCriteria)
    app.post("/api/get/allAdmin/profile/criteria", getAllAdminProfileCriterias)
    app.post("/api/create/policy/criteria/new", createPurchasePolicy)
    app.post("/api/create/compare/reports/new", createCompareReport)
    app.post("/api/get/compare/reports/byId", getComparePopulate)
    app.post("/api/update/compare/reports/byId/obj", updateCompareReport)
};
