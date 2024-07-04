const {
    sample,
    create,
    createBranch,
    update,
    newUpdate,
    getSortedProjects,
    getUserProject,
    getTopProjectInfo,
    getData,
    savePropertyDesc,
    getProjectByTeamId,
    updateData,
    getAdminProjects,
    getAccessibleProjects,
    updateProjectWithPopulate,
    getProjectByIdCode,
    updatePicture,
    updateForTransaction
} = require("../controllers/project.controller");

const {
    createMany,
    update: updateRentalUnit,
    getUnits,
    getUnitAndTenants,
} = require("../controllers/brand.app/rental.unit.controller");

const {
    createPublicProject,
    addFilesWithProject,
    removeFileFromProject,
    shareProject,
    cloneProject
} = require("../controllers/public.project.controller")

module.exports = app => {
    app.post("/api/project/sample", sample);
    app.post("/api/project/topInfo", getTopProjectInfo);
    app.post("/api/project/create", create);
    app.post("/api/project/branch/create", createBranch);
    app.post("/api/project/update", update);
    app.post("/api/project/newUpdate", newUpdate);
    app.post("/api/project/update/withpopulate", updateProjectWithPopulate);
    app.post("/api/project/getSortedProjects", getSortedProjects);
    app.post("/api/project/getUserProject", getUserProject);
    app.post("/api/project/getAdminProjects", getAdminProjects);
    app.post("/api/project/get/byprojectidcode", getProjectByIdCode);

    app.post("/api/project/unit/createMany", createMany);
    app.post("/api/project/unit/update", updateRentalUnit);
    app.post("/api/project/unit/getUnits", getUnits);
    app.post("/api/project/unit/getTenants", getUnitAndTenants);
    app.post("/api/project/accessible/get", getAccessibleProjects);

    app.post("/api/property/type", getData);
    app.post("/api/property/description", savePropertyDesc);
    app.post("/api/property/description/findPropertyByTeamId", getProjectByTeamId);
    app.post("/api/property/description/updateData", updateData);
    app.post("/api/project/updatePicture", updatePicture);
    app.post("/api/project/update/for/transaction", updateForTransaction);

    app.post("/api/public/project/create", createPublicProject);
    app.post("/api/public/project/addFiles", addFilesWithProject);
    app.post("/api/public/project/removeFile", removeFileFromProject);
    app.post("/api/public/project/shareProject", shareProject);
    app.post("/api/public/project/cloneProject", cloneProject);
};
