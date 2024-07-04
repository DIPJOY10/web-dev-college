const {
    create,
    update,
    attach,
    detach,
    getAppById,
    appPaid,
    getTeamApps,
    getProfileApps,
    updateAmount,
} = require("../controllers/brand.app/brand.app.controller");

const {
    create: createNetwork,
    update: updateNetwork,
    findOrCreate,
    matchPasscode,
    getDetail,
    addProject,
    removeProject,
    getAllProjects,
    getRequests,
    updateReq,
    getReqById,
    deleteReq,
} = require("../controllers/brand.app/app.network.controller");

const {
    create: createRelation,
    update: updateRelation,
    assign,
    getRelationById,
    getByProject,
    getByNetwork,
    initTenantConv,
    createRentalRelationWithUnits,
    createRentalRelationforUnit,
    getAllUnitsForTenant,
} = require("../controllers/brand.app/rental.relation.controller");
const {
    getPolicyByTeam,
    updatePolicy,
    createRentalPolicy,
} = require("../controllers/brand.app/rental.policy.controller");

module.exports = app => {
    app.post("/api/brand/app/create", create);
    app.post("/api/brand/app/update", update);
    app.post("/api/brand/app/updateamount", updateAmount);
    app.post("/api/brand/app/attach", attach);
    app.post("/api/brand/app/detach", detach);
    app.post("/api/brand/app/paid", appPaid);
    app.post("/api/brand/app/get", getTeamApps);
    app.post("/api/brand/app/getByProfile", getProfileApps);

    app.post("/api/brand/app/getById", getAppById);

    app.post("/api/brand/app/network/create", createNetwork);
    app.post("/api/brand/app/network/getDetail", getDetail);
    app.post("/api/brand/app/network/addProject", addProject);
    app.post("/api/brand/app/network/removeProject", removeProject);
    app.post("/api/brand/app/network/getProjects", getAllProjects);

    app.post("/api/brand/app/network/matchPasscode", matchPasscode);
    app.post("/api/brand/app/network/update", updateNetwork);
    app.post("/api/brand/app/network/updateReq", updateReq);
    app.post("/api/brand/app/network/deleteReq", deleteReq);

    app.post("/api/brand/app/network/getReqById", getReqById);
    app.post("/api/brand/app/network/findOrCreate", findOrCreate);
    app.post("/api/brand/app/network/getRequests", getRequests);

    app.post("/api/brand/app/relation/assign", assign);
    app.post("/api/brand/app/relation/get", getRelationById);
    app.post("/api/brand/app/relation/initConv", initTenantConv);

    app.post("/api/brand/app/relation/getByProject", getByProject);
    app.post("/api/brand/app/relation/getByNetwork", getByNetwork);
    app.post("/api/brand/app/relation/create", createRelation);
    app.post("/api/brand/app/rentalrelationwithunit/create", createRentalRelationWithUnits);
    app.post("/api/brand/app/rentalrelationforunit/create", createRentalRelationforUnit);
    app.post("/api/brand/app/relation/update", updateRelation);
    app.post("/api/get/rental/relation/fortenant", getAllUnitsForTenant);
    app.post("/api/brand/app/getPolicyByTeamId", getPolicyByTeam);
    app.post("/api/brand/app/updatePolicyByTeamId", updatePolicy);
    app.post("/api/brand/app/createPolicyByTeamId", createRentalPolicy);
};
