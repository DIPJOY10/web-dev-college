const { createProduct } = require("../controllers/accounting/wallet.product.controller");

createProduct

module.exports = app => {
    app.post("/api/wallet/product/create", createProduct);
};
