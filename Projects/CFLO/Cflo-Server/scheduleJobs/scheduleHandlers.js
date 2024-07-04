const Transaction = require("../models/wallet.transaction.model");
const TxTemplate = require("../models/wallet.transaction.template.model");
const Wallet = require("../models/wallet.model");

const rentalScheduleHandler = schedule => {
    console.log("schedule occured", schedule);
};

const txTemplateScheduleHandler = async schedule => {
    const txTemplate = await TxTemplate.findById(schedule?.parent);
    const myWalletId = txTemplate.firstPartyWallet;
    let walletData = await Wallet.findById(myWalletId);
    let myInvoiceNo = walletData.invoiceCounter || 1000;
    let myBillNo = walletData.billCounter || 1000;

    if (!txTemplate?._id) throw new Error("Parent of Schedule not found");

    let newTx = new Transaction({
        status: txTemplate.status, //Ask for status
        type: txTemplate.type,
        templateId: txTemplate._id,
        memo: txTemplate.memo,
        description: txTemplate.description,
        amount: txTemplate.amount,
        amountPaid: txTemplate.amountPaid,
        currency: txTemplate.currency,
        files: txTemplate.files,
        dueDate: txTemplate.dueDate,
        invoiceDate: txTemplate.invoiceDate, //ask id date is nextDate, Date.Now or txTemplate.invoiceDate
        lateFeeApplicable: txTemplate.lateFeeApplicable,
        lateFeeAmount: txTemplate.lateFeeAmount,
        lateFeeDate: txTemplate.lateFeeDate, //how to handle lateFeeDate
        term: txTemplate.term,
        billList: txTemplate.billList,
        firstPartyWallet: txTemplate.firstPartyWallet,
        firstParty: txTemplate.firstParty,
        secondPartyWallet: txTemplate.secondPartyWallet,
        secondParty: txTemplate.secondParty,
        wallets: txTemplate.wallets,
        paymentType: txTemplate.paymentType,
        paymentProvider: txTemplate.paymentProvider,
        stripePaymentIntent: txTemplate, //what is this
        user: txTemplate.user,
    });

    if (txTemplate.type === "Bill") {
        newTx.billNo = myBillNo++;
    } else if (txTemplate.type === "Invoice") {
        newTx.invNo = myInvoiceNo++;
    }

    await Wallet.findByIdAndUpdate(walletData?._id, {invoiceCounter: myInvoiceNo, billCounter: myBillNo});

    newTx = await newTx.save();

    return newTx;
    // allGeneratedTxs.push(newTx);
};

module.exports = {
    rentalScheduleHandler,
};
