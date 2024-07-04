const {
    findProfileRelation,
    findTypeRelation,
    findWalletRelation,
    findExistingRelation,
    addRelation,
    getFullRelationByWallet,
    getAllRelationsByProfile,
} = require("../controllers/accounting/financial.relation.controller");

const {
    addConnection,
    getWallet,
    getWalletData,
    update,
    updateWallet,
    getProfileByWallet,
} = require("../controllers/accounting/wallet.controller");

const {
    create: createChart,
    update: updateChart,
    getTypes,
    getAccts,
    getAcctsByType,
} = require("../controllers/accounting/chart.account.controller");

const {
    updateOfferingRelation,
    getOfferingRelationByWallet,
    createOffering,
    createOfferingWithRelation,
    getOfferingWithRelation,
    getOfferingByName,
    createOfferingAndRelation,
} = require("../controllers/accounting/financial.offering.controller");

const {
    create: createInvoice,
    update: updateInvoice,
    getInvoice,
    getWalletInvoices,
    updateInvoiceCounter,
    saveInvoice,
    editSavedInvoice,
    markInvoiceAsPaid,
    markSubmitedInvoiceAsPaid,
} = require("../controllers/accounting/invoice.controller");

const {
    saveBill,
    editSavedBill,
    markBillAsPaid,
    markSubmitedBillAsPaid,
} = require("../controllers/accounting/bill.controller");

const {
    create: createPaymentConfig,
    update: updatePaymentConfig,
    getWalletConfig,
    checkAvaliablePaymentMethods,
} = require("../controllers/accounting/payment.config.controller");

const {
    update: updateList,
    updateItem,
    addListItem,
    deleteItem,
} = require("../controllers/accounting/bill.list.controller");

const {
    create: createBillingAccount,
    update: updateBillingAccount,
    getBillingAccount,
    findBillingAccounts,
} = require("../controllers/accounting/billing.account.controller");

const {
    create: createTerm,
    update: updateTerm,
    getTerms,
    getPublicTerms,
} = require("../controllers/accounting/term.controller");
const {
    createJournalEntry,
    getJournalWithLines,
    updateJournalEntry,
    getAllJournalEntryNumbers,
    getJournalEntrys,
    submitJournalEntry,
    deleteJournalEntry,
} = require("../controllers/accounting/journal.entry.controller");
const {
    createTwoJournalLines,
    deleteJournalLine,
    updateJournalLine,
} = require("../controllers/accounting/journal.line.controller");

module.exports = app => {
    app.post("/api/wallet/billing/account/create", createBillingAccount);
    app.post("/api/wallet/billing/account/update", updateBillingAccount);
    app.post("/api/wallet/billing/account/find", findBillingAccounts);
    app.post("/api/wallet/billing/account/get", getBillingAccount);

    app.post("/api/wallet/relation/find/profile", findProfileRelation);
    app.post("/api/wallet/relation/find/type", findTypeRelation);
    app.post("/api/wallet/relation/find/wallet", findWalletRelation);
    app.post("/api/wallet/relation/findOrAdd", addRelation);
    app.post("/api/wallet/relation/get/all", getFullRelationByWallet);
    app.post("/api/wallet/relation/getfullprofile/all", getAllRelationsByProfile);

    // used in table
    app.post("/api/wallet/offeringRelation/get", getOfferingRelationByWallet);
    app.post("/api/wallet/offeringRelation/update", updateOfferingRelation);
    app.post("/api/wallet/offering/create", createOffering);
    app.post("/api/wallet/offering/newrelation/create", createOfferingWithRelation);
    app.post("/api/wallet/offering/relation/get", getOfferingWithRelation);
    app.post("/api/wallet/offering/get/byname", getOfferingByName);
    app.post("/api/wallet/offering/create/offeringandrelation", createOfferingAndRelation);

    app.post("/api/wallet/get", getWallet);
    app.post("/api/wallet/update", updateWallet);
    app.post("/api/wallet/getData", getWalletData);
    app.post("/api/wallet/addConnection", addConnection);
    app.post("/api/wallet/chart/create", createChart);
    app.post("/api/wallet/chart/update", updateChart);
    app.post("/api/wallet/chart/types", getTypes);
    app.post("/api/wallet/chart/get", getAccts);
    app.post("/api/wallet/incomeandexpense/chartaccounts/get", getAcctsByType);

    app.post("/api/wallet/get", getWallet);
    app.post("/api/profile/get/by/wallet", getProfileByWallet);
    app.post("/api/wallet/update", updateWallet);
    app.post("/api/wallet/getData", getWalletData);
    app.post("/api/wallet/addConnection", addConnection);
    app.post("/api/wallet/chart/create", createChart);
    app.post("/api/wallet/chart/update", updateChart);
    app.post("/api/wallet/chart/types", getTypes);
    app.post("/api/wallet/chart/get", getAccts);
    app.post("/api/wallet/incomeandexpense/chartaccounts/get", getAcctsByType);

    app.post("/api/wallet/journal/entry/create", createJournalEntry);
    app.post("/api/wallet/journal/entry/get", getJournalWithLines);
    app.post("/api/wallet/journal/entry/update", updateJournalEntry);
    app.post("/api/wallet/journal/entry/getnumbers", getAllJournalEntryNumbers);
    app.post("/api/wallet/journal/entries/getall", getJournalEntrys);
    app.post("/api/wallet/journal/entry/submit", submitJournalEntry);
    app.post("/api/wallet/journal/entry/delete", deleteJournalEntry);

    app.post("/api/wallet/journal/line/create", createTwoJournalLines);
    app.post("/api/wallet/journal/line/deleted", deleteJournalLine);
    app.post("/api/wallet/journal/line/update", updateJournalLine);

    app.post("/api/wallet/term/create", createTerm);
    app.post("/api/wallet/term/update", updateTerm);
    app.post("/api/wallet/term/get", getTerms);
    app.post("/api/wallet/term/getPublic", getPublicTerms);

    app.post("/api/wallet/invoice/create", createInvoice);
    app.post("/api/wallet/invoice/update", updateInvoice);
    app.post("/api/wallet/invoice/update/counter", updateInvoiceCounter);
    app.post("/api/wallet/invoice/initial/submit", saveInvoice);
    app.post("/api/wallet/invoice/submitted/edit", editSavedInvoice);
    app.post("/api/wallet/invoice/initial/markaspaid", markInvoiceAsPaid);
    app.post("/api/wallet/invoice/submitted/markaspaid", markSubmitedInvoiceAsPaid);

    app.post("/api/wallet/bill/initial/submit", saveBill);
    app.post("/api/wallet/bill/submitted/edit", editSavedBill);
    app.post("/api/wallet/bill/initial/markaspaid", markBillAsPaid);
    app.post("/api/wallet/bill/submitted/markaspaid", markSubmitedBillAsPaid);

    app.post("/api/wallet/journal/line/create", createTwoJournalLines);
    app.post("/api/wallet/journal/line/deleted", deleteJournalLine);
    app.post("/api/wallet/journal/line/update", updateJournalLine);

    app.post("/api/wallet/term/create", createTerm);
    app.post("/api/wallet/term/update", updateTerm);
    app.post("/api/wallet/term/get", getTerms);
    app.post("/api/wallet/term/getPublic", getPublicTerms);

    app.post("/api/wallet/invoice/create", createInvoice);
    app.post("/api/wallet/invoice/update", updateInvoice);
    app.post("/api/wallet/invoice/update/counter", updateInvoiceCounter);
    app.post("/api/wallet/invoice/initial/submit", saveInvoice);
    app.post("/api/wallet/invoice/submitted/edit", editSavedInvoice);
    app.post("/api/wallet/invoice/initial/markaspaid", markInvoiceAsPaid);
    app.post("/api/wallet/invoice/submitted/markaspaid", markSubmitedInvoiceAsPaid);

    app.post("/api/wallet/payment/config/create", createPaymentConfig);
    app.post("/api/wallet/payment/config/update", updatePaymentConfig);
    app.post("/api/wallet/payment/config/get", getWalletConfig);
    app.post("/api/wallet/payment/checkpaymethods", checkAvaliablePaymentMethods);

    app.post("/api/wallet/invoice/get", getInvoice);
    app.post("/api/wallet/invoice/wallet/get", getWalletInvoices);

    app.post("/api/wallet/payment/config/create", createPaymentConfig);
    app.post("/api/wallet/payment/config/update", updatePaymentConfig);
    app.post("/api/wallet/payment/config/get", getWalletConfig);
    app.post("/api/wallet/payment/checkpaymethods", checkAvaliablePaymentMethods);

    app.post("/api/wallet/billList/add/item", addListItem);
    app.post("/api/wallet/billList/update", updateList);
    app.post("/api/wallet/billList/delete/item", deleteItem);
    app.post("/api/wallet/billList/update/item", updateItem);
};
