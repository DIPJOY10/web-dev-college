const {
    getProfileIssues,
    getMoreIssues,
    getIssueDetail,
    create,
    update,
    deleteIssue,
    getIssuesByIds,
    getRentalRelationIssues,
    openCloseIssues,
    updateTemplateStatus,
} = require("../controllers/issue.controller");
const {
    createIssueProject,
    getAllIssueProjects,
    updateIssueProject,
    deleteProject,
    getIssueProject,
} = require("../controllers/issue.project.controller");

const {
    defaultStates,
    createStatus,
    updateStatus,
    deleteStatus,
    create: createTemplate,
    update: updateTemplate,
    getTemplateDetail,
    deleteTemplate,
    getTemplates,

    createForm,

    getProfileData,
    // getJobTemplates,
    getTypeTemplates,
    getDataFromList,
    changeIssueState,
    importTemplate,
    cloneTemplate,
} = require("../controllers/issue.template.controller");

module.exports = app => {
    app.post("/api/issue/getProfileIssues", getProfileIssues);
    app.post("/api/issue/get/Issues/byrentalrelation", getRentalRelationIssues);
    app.post("/api/issue/getMoreIssues", getMoreIssues);
    app.post("/api/issue/getIssueDetail", getIssueDetail);
    app.post("/api/issue/updateFromKanban", changeIssueState);

    app.post("/api/issue/create", create);
    app.post("/api/issue/update", update);
    app.post("/api/issue/updateTemplateStatus", updateTemplateStatus);
    app.post("/api/issue/updateMultiple", openCloseIssues);
    app.post("/api/issue/delete", deleteIssue);
    app.post("/api/issue/getIssuesByIds", getIssuesByIds);

    app.post("/api/issue/status/default", defaultStates);
    app.post("/api/issue/status/create", createStatus);
    app.post("/api/issue/status/update", updateStatus);
    app.post("/api/issue/status/delete", deleteStatus);

    app.post("/api/issue/template/create", createTemplate);
    app.post("/api/issue/template/import", importTemplate);
    app.post("/api/issue/template/clone", cloneTemplate);
    app.post("/api/issue/template/update", updateTemplate);
    app.post("/api/issue/template/delete", deleteTemplate);
    app.post("/api/issue/template/getTemplateDetail", getTemplateDetail);
    app.post("/api/issue/template/getAll", getTemplates);
    app.post("/api/issue/template/getTypeAll", getTypeTemplates);
    app.post("/api/issue/template/getDataFromList", getDataFromList);
    app.post("/api/issue/profile/data", getProfileData);
    app.post("/api/issue/template/create/form", createForm);

    // Project Units routes
    app.post("/api/issue/project/create", createIssueProject);
    app.post("/api/issue/project/getAll", getAllIssueProjects);
    app.post("/api/issue/project/getProject", getIssueProject);
    app.post("/api/issue/project/update", updateIssueProject);
    app.post("/api/issue/project/delete", deleteProject);
};
