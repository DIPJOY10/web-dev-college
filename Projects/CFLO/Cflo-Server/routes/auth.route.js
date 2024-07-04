const {
    signIn,
    getUserByToken,
    dpChange,
    updateInfo,
    updateInfoArray,
    editUserArray,
    fetchUserInfo,
    deleteArrayItem,
    deleteProjPic,
    updateFileOnDeletion,
    saveProjectInfo,
    updateFileOnDeletionMany
} = require("../controllers/auth.controller");

module.exports = app => {
    app.post("/api/signIn", signIn);
    app.post("/api/getUserByToken", getUserByToken);
    app.post("/api/user/dpChange", dpChange);
    app.post("/api/user/fetchUserInfo", fetchUserInfo);
    app.post("/api/user/updateInfo", updateInfo);
    app.post("/api/user/updateInfoArray", updateInfoArray);
    app.post("/api/user/edit/array", editUserArray);
    app.post("/api/user/delete/array", deleteArrayItem);
    app.post("/api/user/update/project", saveProjectInfo);
    app.post("/api/user/delete/projectPic", deleteProjPic);
    app.post("/api/user/updateFileDelete", updateFileOnDeletion);
    app.post("/api/user/updateFileDelete/many", updateFileOnDeletionMany);
};
