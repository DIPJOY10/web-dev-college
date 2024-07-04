const async = require("async");
const Wallet = require("../../models/wallet.model");
const BillList = require("../../models/wallet.bill.list.model");
const {billListInitHelper, billListShortInvoiceHelper} = require("./bill.list.controller");
const {createPaymentConfigHelper} = require("./payment.config.controller");
const Sale = require("../../models/wallet.sales.model");
const JournalLine = require("../../models/wallet.journal.line.model");
const {processJournalLinesForAuto} = require("./journal.line.controller");
const ChartAccount = require("../../models/wallet.chart.account.model");
const Transaction = require("../../models/wallet.transaction.model");
const moment = require("moment");
const _ = require("lodash");

const billSubmitHelper = async tx => {
    try {
        const billList = tx?.billList?.items;
        let totalAmount = 0;
        let linesArr = [];

        // for listItems

        billList.length > 0 &&
            billList.map(item => {
                const amount = item?.qTy * item?.rate;
                totalAmount = totalAmount + amount;

                const newObj = {
                    chartId: item?.chartAccount?._id,
                    chartAccount: item?.chartAccount,
                    debit: true,
                    amount: amount,
                };
                linesArr.push(newObj);
            });

        const linesGroupById = _.groupBy(linesArr, "chartId");
        let finalJLine = [];

        for (const key in linesGroupById) {
            let totalAmount = 0;
            const arr = linesGroupById[key];
            const chartAcc = arr[0].chartAccount;

            arr.map(line => {
                totalAmount += line.amount;
            });

            if (totalAmount) {
                const newObj = {
                    chartId: chartAcc._id,
                    chartAccount: chartAcc,
                    amount: totalAmount,
                    debit: true,
                };
                finalJLine.push(newObj);
            }
        }

        return {
            lines: finalJLine,
            total: totalAmount,
        };
    } catch (err) {
        return null;
    }
};

const saveBill = async (req, res) => {
    try {
        const tx = req.body.tx;
        const walletId = req.body.walletId;

        const freshTx = await Transaction.findOne({_id: tx?._id});

        if (!freshTx.processed && freshTx.status !== "Paid" && freshTx.status !== "Processing") {
            const accPayableRes = await ChartAccount.findOne({
                wallet: walletId,
                name: "Accounts Payables (A/P)",
                qbType: "AccountsPayable",
            });
            const accPayable = {
                ...accPayableRes._doc,
            };
            billSubmitHelper(tx)
                .then(async data => {
                    let finalJLine = [];
                    finalJLine = data?.lines;
                    const accountPayable = {
                        chartId: accPayable._id,
                        chartAccount: accPayable,
                        debit: false,
                        amount: data?.total,
                    };
                    finalJLine.push(accountPayable);
                    let journalLines = [];
                    finalJLine.length > 0 &&
                        finalJLine.map(line => {
                            const newObj = JournalLine({
                                account: line?.chartAccount?._id,
                                wallet: walletId,
                                debit: line?.debit,
                                amount: line?.amount,
                                transaction: tx?._id,
                            });
                            journalLines.push(newObj);
                        });
                    const savedJournalLines = await JournalLine.insertMany(journalLines);
                    await processJournalLinesForAuto(finalJLine)
                        .then(async datakk => {
                            await Transaction.findByIdAndUpdate(tx._id, {processed: true}, {new: true});
                            res.json({
                                status: 200,
                                data: {
                                    data,
                                    savedJournalLines,
                                    datakk,
                                },
                            });
                        })
                        .catch(err => {
                            res.json({
                                status: 400,
                                data: null,
                                err,
                            });
                        });
                })
                .catch(err => {
                    res.json({
                        status: 400,
                        data: null,
                        err,
                    });
                });
        } else {
            res.json({
                status: 400,
                data: "Transaction is submitted",
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const editSavedBill = async (req, res) => {
    try {
        const tx = req.body.tx;
        const walletId = req.body.walletId;
        const getOldJLines = await JournalLine.find({wallet: walletId, transaction: tx?._id}).populate("account");
        const freshTx = await Transaction.findOne({_id: tx?._id});

        if (
            freshTx.processed &&
            getOldJLines.length > 0 &&
            freshTx.status !== "Paid" &&
            freshTx.status !== "Processing"
        ) {
            const accPayableRes = await ChartAccount.findOne({
                wallet: walletId,
                name: "Accounts Payable (A/P)",
                qbType: "AccountsPayable",
            });
            const accPayable = {
                ...accPayableRes._doc,
            };
            let oldLineArr = [];
            let oldLinesIdArr = [];
            getOldJLines.length > 0 &&
                getOldJLines.map(line => {
                    const chartAccDoc = line?.account;
                    oldLinesIdArr.push(line._id);
                    const newObj = {
                        chartId: line?.account?._id,
                        chartAccount: {...chartAccDoc._doc},
                        debit: !line.debit,
                        amount: line?.amount,
                    };
                    oldLineArr.push(newObj);
                });
            billSubmitHelper(tx)
                .then(async data => {
                    let newLines = [];
                    newLines = data?.lines;
                    const accountPayable = {
                        chartId: accPayable._id,
                        chartAccount: accPayable,
                        debit: false,
                        amount: data?.total,
                    };
                    newLines.push(accountPayable);
                    const totallines = [...oldLineArr, ...newLines];
                    const linesGroupById = _.groupBy(totallines, "chartId");
                    const finalJLine = [];
                    for (const key in linesGroupById) {
                        let debitAmount = 0;
                        const arr = linesGroupById[key];
                        const chartAcc = arr[0].chartAccount;
                        arr.map(line => {
                            if (line?.debit) {
                                debitAmount = debitAmount + line.amount;
                            } else {
                                debitAmount = debitAmount - line.amount;
                            }
                        });
                        if (debitAmount) {
                            const newObj = {
                                chartAccount: chartAcc,
                                amount: debitAmount,
                                debit: true,
                            };
                            finalJLine.push(newObj);
                        }
                    }
                    let newJournalLines = [];
                    let savedJournalLines = [];
                    if (finalJLine.length > 0) {
                        newLines.length > 0 &&
                            newLines.map(line => {
                                const newObj = JournalLine({
                                    account: line?.chartAccount?._id,
                                    wallet: walletId,
                                    debit: line?.debit,
                                    amount: line?.amount,
                                    transaction: tx?._id,
                                });
                                newJournalLines.push(newObj);
                            });
                        savedJournalLines = await JournalLine.insertMany(newJournalLines);
                    }
                    await processJournalLinesForAuto(finalJLine)
                        .then(async datakk => {
                            // delete old journalLines
                            if (savedJournalLines.length > 0 && finalJLine.length > 0 && datakk.length > 0) {
                                const deletedData = await JournalLine.deleteMany({_id: {$in: oldLinesIdArr}});
                            }
                            res.json({
                                status: 200,
                                data: {
                                    data,
                                    newLines,
                                    datakk,
                                    totallines,
                                    finalJLine,
                                    oldLinesIdArr,
                                    savedJournalLines,
                                },
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                status: 400,
                                data: null,
                                err,
                            });
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: 400,
                        data: null,
                        err,
                    });
                });
        } else {
            res.json({
                status: 400,
                data: "Transaction is not submitted",
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const markBillAsPaid = async (req, res) => {
    try {
        const walletId = req.body.walletId;

        const lateFeesChartRes = await ChartAccount.findOne({
            wallet: walletId,
            name: "LateFees",
            qbType: "AccountsReceivable",
        });
        const lateFeesChart = {
            ...lateFeesChartRes._doc,
        };

        const freshTx = await Transaction.findOne({_id: tx?._id});
        if (!freshTx.processed && freshTx.status !== "Paid" && freshTx.status !== "Processing") {
            const tx = req.body.tx;
            const cashAccount = tx?.BankChartAccount;
            billSubmitHelper(tx)
                .then(async data => {
                    let finalLines = [];
                    finalLines = data?.lines;

                    const d2 = moment(tx?.dueDate).format("YYYY-M-D");
                    const d1 = moment().format("YYYY-M-D");

                    if (d2 < d1 && tx?.lateFeeAmount > 0) {
                        const lateFeeLine = {
                            chartId: lateFeesChart._id,
                            chartAccount: lateFeesChart,
                            amount: tx?.lateFeeAmount,
                            debit: true,
                        };
                        finalLines.push(lateFeeLine);
                    }

                    const accountPayable = {
                        chartId: cashAccount._id,
                        chartAccount: cashAccount,
                        debit: false,
                        amount: data?.total,
                    };
                    finalLines.push(accountPayable);
                    let journalLines = [];
                    finalLines.length > 0 &&
                        finalLines.map(line => {
                            const newObj = JournalLine({
                                account: line?.chartAccount?._id,
                                wallet: walletId,
                                debit: line?.debit,
                                amount: line?.amount,
                                transaction: tx?._id,
                            });
                            journalLines.push(newObj);
                        });
                    const savedJournalLines = await JournalLine.insertMany(journalLines);
                    await processJournalLinesForAuto(finalLines)
                        .then(async datakk => {
                            await Transaction.findByIdAndUpdate(
                                tx._id,
                                {processed: true, amountPaid: data?.total, status: "Paid"},
                                {
                                    new: true,
                                }
                            );
                            res.json({
                                status: 200,
                                data: {
                                    data,
                                    datakk,
                                    savedJournalLines,
                                },
                            });
                        })
                        .catch(err => {
                            res.json({
                                status: 400,
                                data: null,
                                err,
                            });
                        });
                })
                .catch(err => {
                    res.json({
                        status: 400,
                        data: null,
                        err,
                    });
                });
        } else {
            res.json({
                status: 400,
                data: "Transaction is already paid",
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const markSubmitedBillAsPaid = async (req, res) => {
    try {
        const tx = req.body.tx;
        const walletId = req.body.walletId;
        const cashAccount = tx?.BankChartAccount;

        const lateFeesChartRes = await ChartAccount.findOne({
            wallet: walletId,
            name: "LateFees",
            qbType: "AccountsReceivable",
        });
        const lateFeesChart = {
            ...lateFeesChartRes._doc,
        };

        const getOldJLines = await JournalLine.find({wallet: walletId, transaction: tx?._id}).populate("account");
        const freshTx = await Transaction.findOne({_id: tx?._id});

        if (
            freshTx.processed &&
            getOldJLines.length > 0 &&
            freshTx.status !== "Paid" &&
            freshTx.status !== "Processing"
        ) {
            let oldLineArr = [];
            let oldLinesIdArr = [];
            getOldJLines.length > 0 &&
                getOldJLines.map(line => {
                    const chartAccDoc = line?.account;
                    oldLinesIdArr.push(line._id);
                    const newObj = {
                        chartId: line?.account?._id,
                        chartAccount: {...chartAccDoc._doc},
                        debit: !line.debit,
                        amount: line?.amount,
                    };
                    oldLineArr.push(newObj);
                });
            billSubmitHelper(tx)
                .then(async data => {
                    let newLines = [];
                    newLines = data?.lines;

                    const d2 = moment(tx?.dueDate).format("YYYY-M-D");
                    const d1 = moment().format("YYYY-M-D");

                    if (d2 < d1 && tx?.lateFeeAmount > 0) {
                        const lateFeeLine = {
                            chartId: lateFeesChart._id,
                            chartAccount: lateFeesChart,
                            amount: tx?.lateFeeAmount,
                            debit: true,
                        };
                        newLines.push(lateFeeLine);
                    }

                    const finalAccountPayable = {
                        chartId: cashAccount?._id,
                        chartAccount: cashAccount,
                        debit: false,
                        amount: data?.total,
                    };

                    newLines.push(finalAccountPayable);
                    const totallines = [...oldLineArr, ...newLines];
                    const linesGroupById = _.groupBy(totallines, "chartId");
                    const finalJLine = [];
                    for (const key in linesGroupById) {
                        let debitAmount = 0;
                        const arr = linesGroupById[key];
                        const chartAcc = arr[0].chartAccount;
                        arr.map(line => {
                            if (line?.debit) {
                                debitAmount = debitAmount + line.amount;
                            } else {
                                debitAmount = debitAmount - line.amount;
                            }
                        });
                        if (debitAmount) {
                            const newObj = {
                                chartAccount: chartAcc,
                                amount: debitAmount,
                                debit: true,
                            };
                            finalJLine.push(newObj);
                        }
                    }
                    let newJournalLines = [];
                    let savedJournalLines = [];
                    if (finalJLine.length > 0) {
                        newLines.length > 0 &&
                            newLines.map(line => {
                                const newObj = JournalLine({
                                    account: line?.chartAccount?._id,
                                    wallet: walletId,
                                    debit: line?.debit,
                                    amount: line?.amount,
                                    transaction: tx?._id,
                                });
                                newJournalLines.push(newObj);
                            });
                        savedJournalLines = await JournalLine.insertMany(newJournalLines);
                    }
                    await processJournalLinesForAuto(finalJLine)
                        .then(async datakk => {
                            // delete old journalLines
                            if (savedJournalLines.length > 0 && finalJLine.length > 0 && datakk.length > 0) {
                                const deletedData = await JournalLine.deleteMany({_id: {$in: oldLinesIdArr}});
                            }
                            await Transaction.findByIdAndUpdate(
                                tx._id,
                                {processed: true, amountPaid: data?.total, status: "Paid"},
                                {
                                    new: true,
                                }
                            );
                            res.json({
                                status: 200,
                                data: {
                                    data,
                                    datakk,
                                    totallines,
                                    finalJLine,
                                    oldLinesIdArr,
                                    savedJournalLines,
                                },
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.json({
                                status: 400,
                                data: null,
                                err,
                            });
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: 400,
                        data: null,
                        err,
                    });
                });
        } else {
            res.json({
                status: 400,
                data: "Transaction is not submitted or already paid",
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

module.exports = {
    saveBill,
    editSavedBill,
    markBillAsPaid,
    markSubmitedBillAsPaid,
};
