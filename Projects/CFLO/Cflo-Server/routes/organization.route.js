const {
    create,
    update,
    newUpdate,
    getDetail,
    getUserOrganizations,
    goPublic,
    updatePicture,
    updateOrgInfo,
    updateOrgInfoArray,
    editOrgInfoArray,
    deleteOrgArrayItem,
    deleteOrgProjectPic,
    updateFileOnDeletion,
    updateForTransaction
} = require("../controllers/organization.controller");

module.exports = app => {
    app.post("/api/organization/create", create);
    app.post("/api/organization/update", update);
    app.post("/api/organization/newUpdate", newUpdate);
    app.post("/api/organization/getDetail", getDetail);
    app.post("/api/organization/goPublic", goPublic);
    app.post("/api/organization/get", getUserOrganizations);
    app.post("/api/organization/updatePicture", updatePicture);
    app.post("/api/organization/updateOrgInfo", updateOrgInfo);
    app.post("/api/organization/updateOrgInfoArray", updateOrgInfoArray);
    app.post("/api/organization/edit/array", editOrgInfoArray);
    app.post("/api/organization/delete/array", deleteOrgArrayItem);
    app.post("/api/organization/updateFileDelete", updateFileOnDeletion);
    app.post("/api/organization/delete/projectPic", deleteOrgProjectPic);
    app.post("/api/organization/update/for/transaction", updateForTransaction);
};
