const {createItem, fetchItems, deleteItem, updateItem} = require("../controllers/reportItem.controller");

module.exports = app => {
    app.post("/api/property/report/reportItem/create", createItem);
    app.post("/api/property/report/reportItem/fetch", fetchItems);
    app.post("/api/property/report/reportItem/delete", deleteItem);
    app.post("/api/property/report/reportItem/update", updateItem);
};
