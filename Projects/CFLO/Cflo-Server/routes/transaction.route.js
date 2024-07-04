const {
    create,
    update,
    deleteTx,
    getTx,
    getTxByWallet,
    getTxByTemplateId,
    txPaymentUpdate,
    createPaymentTx,
    getTxForRelation,
    getTotalAmount,
    getBothSidesTxByWallet,
    createTransactionForRentalRelation,
    getTxByRentalRelation,
    getTxForTenant,
} = require("../controllers/accounting/transaction.controller");

module.exports = app => {
    app.post("/api/transaction/create", create);
    app.post("/api/transaction/create/for/rentalrelation", createTransactionForRentalRelation);
    app.post("/api/transaction/create/payment", createPaymentTx);
    app.post("/api/transaction/update", update);
    app.post("/api/transaction/delete", deleteTx);
    app.post("/api/transaction/get", getTx);
    app.post("/api/transaction/bywalletget", getTxByWallet);
    app.post("/api/transaction/get/by/rentalrelation", getTxByRentalRelation);
    app.post("/api/transaction/bywalletget/bothside", getBothSidesTxByWallet);
    app.post("/api/transaction/bytemplate", getTxByTemplateId);
    app.post("/api/transaction/paymentupdate", txPaymentUpdate);
    app.post("/api/transaction/get/byrelation", getTxForRelation);
    app.post("/api/transaction/get/totalamount/groupby", getTotalAmount);
    app.post("/api/transaction/get/for/tenant", getTxForTenant);
};
