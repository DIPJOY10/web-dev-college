const async = require("async");
const Invoice = require("../../models/wallet.invoice.model");
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

const create = async (req, res) => {
    try {
        var invoice = new Invoice(req.body);
        const walletId = invoice.wallet;

        const wallet = await Wallet.findById(walletId);
        const defaultCount = wallet.invoiceCounter || 1000;
        const invNo = defaultCount + 1;

        const billList = await billListInitHelper(invoice._id, "Invoice");

        invoice.invNo = invNo;
        invoice.paymentConfig = config._id;
        invoice.billList = billList._id;
        invoice = await invoice.save();
        invoice.billList = billList;

        wallet.invoiceCounter = invNo;
        await wallet.save();

        res.json({
            status: 200,
            data: invoice,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const createShortInvoice = async (req, res) => {
    try {
        var invoice = new Invoice(req.body);
        const memo = invoice.memo;
        const rate = invoice.total;

        const billList = await billListShortInvoiceHelper(memo, rate, invoice._id);

        invoice.billList = billList._id;
        invoice = await invoice.save();
        invoice.billList = billList;

        res.json({
            status: 200,
            data: invoice,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const update = (req, res) => {
    var invoiceObject = req.body;
    var invoiceId = invoiceObject._id;

    Invoice.findByIdAndUpdate(invoiceId, invoiceObject, {new: true}, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                status: 200,
                data: resp,
            });
        }
    });
};

const updateInvoiceCounter = async (req, res) => {
    try {
        if (req.body && req.body.invoice && req.body.invoice._id) {
            const invoiceNew = req.body.invoice;
            const updateCounter = req.body.updateCounter;

            const walletId = invoiceNew.wallet;
            const walletNew = {
                _id: walletId,
                invoiceCounter: invoiceNew.invNo,
            };

            let invoice = await Invoice.findByIdAndUpdate(invoiceNew._id, invoiceNew, {new: true});

            if (!invoice) {
                res.json({
                    status: 400,
                    data: null,
                    error: "Id not found ",
                });
            } else {
                if (updateCounter) {
                    let wallet = await Wallet.findByIdAndUpdate(walletNew._id, walletNew, {new: true});
                }

                res.json({status: 200, data: invoice});
            }
        }
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getInvoice = async (req, res) => {
    var invoiceId = req.body.invoiceId;

    if (invoiceId) {
        var invoice = await Invoice.findById(invoiceId)
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "items",
                    populate: {
                        path: "offering",
                    },
                },
            })
            .populate("paymentConfig")
            .populate({
                path: "customer",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName wallet",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            });

        var resObject = {
            status: 200,
            data: invoice,
        };

        res.json(resObject);
    } else {
        res.json({
            status: 400,
            data: null,
        });
    }
};

const getWalletInvoices = async (req, res) => {
    try {
        const walletIds = req.body.walletIds;
        const invoices = await Invoice.find({
            wallet: {$in: walletIds},
        })
            .populate({
                path: "customer",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "items",
                    populate: {
                        path: "offering",
                    },
                },
            });

        res.json({
            status: 200,
            data: invoices,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const sendInvoice = async (req, res) => {
    const invBody = req.body;
    const invId = invBody._id;
    const invoice = await Invoice.findById(invId)
        .populate({
            path: "customer",
            populate: {
                path: "parent",
                select: "name displayName wallet model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .populate({
            path: "billList",
            model: "BillList",
            populate: {
                path: "items",
                populate: {
                    path: "offering",
                },
            },
        });

    if (invoice._id) {
        const memo = invoice.memo;

        const client = invoice.customer;
        const dueDate = invoice.dueDate;

        var errorMsg = "";

        if (memo && memo.length > 1 && amount >= 0 && dueDate && client) {
            res.json({
                status: 200,
                data: invoice,
            });
        } else {
            res.json({
                status: 400,
                data: null,
                error: errorMsg,
            });
        }
    }
};

const invoiceSubmitHelper = async tx => {
    try {
        const taxAmount = tx?.billList?.tax?.amount;
        const taxPercent = tx?.billList?.tax?.percent;
        const taxType = tx?.billList?.tax?.type;

        const discountAmount = tx?.billList?.discount?.amount;
        const discountPercent = tx?.billList?.discount?.percent;
        const discountType = tx?.billList?.discount?.type;

        const billList = tx?.billList?.items;

        let totalTax = 0;
        let finalTaxAmount = 0;
        let finalDiscountAmount = 0;
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
                    debit: false,
                    amount: amount,
                };

                if (item?.tax && tx?.billList?.tax?.enabled && taxType === "%") {
                    totalTax = totalTax + amount * (taxPercent / 100);
                }

                linesArr.push(newObj);
            });

        //for tax

        if (tx?.billList?.tax?.enabled) {
            if (taxType === "%") {
                finalTaxAmount = totalTax;
            } else if (taxType === "$") {
                finalTaxAmount = taxAmount;
            }

            if (finalTaxAmount > 0) {
                const newObj = {
                    chartId: tx?.billList?.taxRelationModel?.chartAccount?._id,
                    chartAccount: tx?.billList?.taxRelationModel?.chartAccount,
                    debit: false,
                    amount: finalTaxAmount,
                };
                linesArr.push(newObj);
            }
        }

        // for discount

        if (tx?.billList?.discount?.enabled) {
            if (tx?.billList?.orderReverse) {
                const totalAmountWithTax = totalAmount + finalTaxAmount;
                if (discountType === "$") {
                    finalDiscountAmount = discountAmount;
                } else if (discountType === "%") {
                    finalDiscountAmount = totalAmountWithTax * (discountPercent / 100);
                    console.log("discount " + finalDiscountAmount);
                }
            } else {
                if (discountType === "$") {
                    finalDiscountAmount = discountAmount;
                } else if (discountType === "%") {
                    finalDiscountAmount = totalAmount * (discountPercent / 100);
                }
            }

            if (finalDiscountAmount > 0) {
                const newObj = {
                    chartId: tx?.billList?.discountRelationModel?.chartAccount?._id,
                    chartAccount: tx?.billList?.discountRelationModel?.chartAccount,
                    debit: false,
                    amount: -1 * finalDiscountAmount,
                };
                linesArr.push(newObj);
            }
        }

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
                    debit: false,
                };
                finalJLine.push(newObj);
            }
        }

        return {
            lines: finalJLine,
            total: totalAmount + finalTaxAmount - finalDiscountAmount,
        };
    } catch (err) {
        return null;
    }
};

const getTxHelper = async txId => {
    try {
        console.log(txId);
        const tx = await Transaction.findById(txId)
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "items",
                    populate: {
                        path: "offeringRelation",
                        populate: {
                            path: "chartAccount",
                        },
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "items",
                    populate: {
                        path: "offeringRelation",
                        populate: {
                            path: "offering",
                        },
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "items",
                    populate: {
                        path: "offeringRelation",
                        populate: {
                            path: "chartAccount",
                        },
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "items",
                    populate: {
                        path: "chartAccount",
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "discountRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "discountOrTax",
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "discountRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "chartAccount",
                        model: "ChartAccount",
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "taxRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "discountOrTax",
                    },
                },
            })
            .populate({
                path: "billList",
                model: "BillList",
                populate: {
                    path: "taxRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "chartAccount",
                        model: "ChartAccount",
                    },
                },
            });

        return tx;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const saveInvoiceHelperForRental = async (txId, walletId) => {
    try {
        await getTxHelper(txId)
            .then(async txData => {
                const accReceivableRes = await ChartAccount.findOne({
                    wallet: walletId,
                    name: "Account Receivable (A/R)",
                    qbType: "AccountsReceivable",
                });

                invoiceSubmitHelper(txData)
                    .then(async data => {
                        let finalJLine = [];
                        finalJLine = data?.lines;

                        const accountReceivable = {
                            chartId: accReceivableRes._id,
                            chartAccount: accReceivableRes,
                            debit: true,
                            amount: data?.total,
                        };

                        finalJLine.push(accountReceivable);

                        let reStructureFinalJLine = [];

                        finalJLine.map(line => {
                            let chatAcc = line.chartAccount;
                            let reStructureChart = {...chatAcc._doc};

                            let obj = {
                                ...line,
                                chartAccount: reStructureChart,
                            };
                            reStructureFinalJLine.push(obj);
                        });

                        let journalLines = [];

                        finalJLine.length > 0 &&
                            finalJLine.map(line => {
                                const newObj = new JournalLine({
                                    account: line?.chartAccount?._id,
                                    wallet: walletId,
                                    debit: line?.debit,
                                    amount: line?.amount,
                                    transaction: txData?._id,
                                });
                                journalLines.push(newObj);
                            });

                        const savedJournalLines = await JournalLine.insertMany(journalLines);

                        await processJournalLinesForAuto(reStructureFinalJLine)
                            .then(async datakk => {
                                let updatedTx = await Transaction.findByIdAndUpdate(
                                    txId,
                                    {processed: true},
                                    {
                                        new: true,
                                    }
                                );

                                const returnData = {
                                    data: data,
                                    savedJournalLines: savedJournalLines,
                                    datakk: datakk,
                                    updatedTx: updatedTx,
                                };

                                return returnData;
                            })
                            .catch(err => {
                                console.log(err);
                                return null;
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        return null;
                    });
            })
            .catch(err => {
                console.log(err);
                return null;
            });
    } catch (err) {
        console.log(err);
        return null;
    }
};

const saveInvoice = async (req, res) => {
    try {
        const tx = req.body.tx;
        const walletId = req.body.walletId;

        const freshTx = await Transaction.findOne({_id: tx?._id});

        if (!freshTx.processed && freshTx.status !== "Paid" && freshTx.status !== "Processing") {
            const accReceivableRes = await ChartAccount.findOne({
                wallet: walletId,
                name: "Account Receivable (A/R)",
                qbType: "AccountsReceivable",
            });
            const accReceivable = {
                ...accReceivableRes?._doc,
            };

            invoiceSubmitHelper(tx)
                .then(async data => {
                    let finalJLine = [];
                    finalJLine = data?.lines;

                    const accountReceivable = {
                        chartId: accReceivable._id,
                        chartAccount: accReceivable,
                        debit: true,
                        amount: data?.total,
                    };

                    finalJLine.push(accountReceivable);

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
                            await Transaction.findByIdAndUpdate(
                                tx._id,
                                {processed: true},
                                {
                                    new: true,
                                }
                            );

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
                data: "Transaction is already submitted",
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

const editSavedInvoice = async (req, res) => {
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
            const accReceivableRes = await ChartAccount.findOne({
                wallet: walletId,
                name: "Account Receivable (A/R)",
                qbType: "AccountsReceivable",
            });
            const accReceivable = {
                ...accReceivableRes._doc,
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

            invoiceSubmitHelper(tx)
                .then(async data => {
                    let newLines = [];
                    newLines = data?.lines;

                    const accountReceivable = {
                        chartId: accReceivable?._id,
                        chartAccount: accReceivable,
                        debit: true,
                        amount: data?.total,
                    };

                    newLines.push(accountReceivable);

                    let newJournalLines = [];
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

                    console.log(data);
                    console.log(oldLinesIdArr);

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

const markInvoiceAsPaid = async (req, res) => {
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
            ...lateFeesChartRes?._doc,
        };

        const freshTx = await Transaction.findOne({_id: tx?._id});

        if (!freshTx.processed && freshTx.status !== "Paid" && freshTx.status !== "Processing") {
            invoiceSubmitHelper(tx)
                .then(async data => {
                    let finalLines = [];
                    finalLines = data?.lines;

                    const d2 = moment(tx?.dueDate).format("YYYY-M-D");
                    const d1 = moment().format("YYYY-M-D");

                    if (d2 > d1 && tx?.lateFeeAmount > 0) {
                        const lateFeeLine = {
                            chartId: lateFeesChart._id,
                            chartAccount: lateFeesChart,
                            amount: tx?.lateFeeAmount,
                            debit: true,
                        };
                        finalLines.push(lateFeeLine);
                    }

                    const finalReceivableAcc = {
                        chartId: cashAccount?._id,
                        chartAccount: cashAccount,
                        debit: true,
                        amount: data?.total,
                    };
                    finalLines.push(finalReceivableAcc);

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

const markSubmitedInvoiceAsPaid = async (req, res) => {
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

            invoiceSubmitHelper(tx)
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

                    const finalReceivableAcc = {
                        chartId: cashAccount?._id,
                        chartAccount: cashAccount,
                        debit: true,
                        amount: data?.total,
                    };
                    newLines.push(finalReceivableAcc);

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

                    console.log(data);
                    console.log(oldLinesIdArr);

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

module.exports = {
    create,
    createShortInvoice,
    update,
    updateInvoiceCounter,
    getInvoice,
    getWalletInvoices,
    sendInvoice,
    saveInvoice,
    editSavedInvoice,
    markInvoiceAsPaid,
    markSubmitedInvoiceAsPaid,
    invoiceSubmitHelper,
    saveInvoiceHelperForRental,
};
