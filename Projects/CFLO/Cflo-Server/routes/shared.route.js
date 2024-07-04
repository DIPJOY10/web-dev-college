const {
    getAdminProfilesAndData,
    getMoreProjects,
    getUserData,
    getAssignableProfiles,
} = require("../controllers/shared.controller");

module.exports = app => {
    app.post("/api/shared/getBasicData", getAdminProfilesAndData);
    app.post("/api/shared/getMoreProjects", getMoreProjects);
    app.post("/api/shared/getUserData", getUserData);
    app.post("/api/shared/assignable", getAssignableProfiles);
};
