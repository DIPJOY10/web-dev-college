const {
    getDocs,
    create,
    update,
    simpleDocUpdate,
    deleteDoc,
    getDocDetail,
    getDocDetailWithPopulatedFiles,
    getDocAllVersions,
    getDraftDoc,
    updateDraft,
} = require("../controllers/doc.controller");

const { getFolders, createFolder, updateFolder, getFolderDetail } = require("../controllers/doc.folder.controller");

module.exports = app => {
    app.post("/api/doc/create", create);
    app.post("/api/doc/update", update);
    app.post("/api/doc/simple/update", simpleDocUpdate);

    app.post("/api/doc/delete", deleteDoc);
    app.post("/api/doc/get", getDocs);
    app.post("/api/doc/getDocDetail", getDocDetail);
    app.post("/api/doc/getDocDetail/withfile", getDocDetailWithPopulatedFiles);
    app.post("/api/doc/getDocVersions", getDocAllVersions);
    // draft document
    app.post("/api/doc/updateDraft", updateDraft);
    app.post("/api/doc/getDraft", getDraftDoc);

    app.post("/api/doc/folder/get", getFolders);
    app.post("/api/doc/folder/get/byId", getFolderDetail);
    app.post("/api/doc/folder/create", createFolder);
    app.post("/api/doc/folder/update", updateFolder);
};
