const {
    createRelation,
    getRelations
} = require("../controllers/property.manage.controller");



module.exports = app => {
    app.post("/api/property/relation/create", createRelation);
    app.post("/api/property/relation/list", getRelations);
};
