const {getAllSavesOfProfiles, getSavePosts, createSave, deleteSave} = require("../controllers/save.controller.js");
module.exports = app => {
    app.post("/api/save/create", createSave);
    app.post("/api/save/get", getAllSavesOfProfiles);
    app.post("/api/save/get-post", getSavePosts);
    app.post("/api/save/delete", deleteSave);
};
