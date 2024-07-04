const Transaction = require("../../models/wallet.transaction.model");
const {billListInitHelper} = require("./bill.list.controller");
const JournalLine = require("../../models/wallet.journal.line.model");
const Wallet = require("../../models/wallet.model");
const _ = require("lodash");
const {processJournalLines, findOrCreateRule} = require("./journal.entry.controller");
const {onInvoiceSave} = require("./invoice");
const mongoose = require("mongoose");
const {processJournalLinesForAuto} = require("./journal.line.controller");
const moment = require("moment");
const ChartAccount = require("../../models/wallet.chart.account.model");
const BillItem = require("../../models/wallet.bill.item.model");
const BillList = require("../../models/wallet.bill.list.model");
const {saveInvoiceHelperForRental} = require("./invoice.controller");

const create = async (req, res) => {
    var tx = new Transaction(req.body);
    const billList = await billListInitHelper(tx._id, "Transaction");
    tx.billList = billList._id;
    const walletId = tx.firstPartyWallet;

    if (tx.type === "Bill") {
        const wallet = await Wallet.findById(walletId);
        const defaultCount = wallet.billCounter || 1000;
        const billNo = defaultCount + 1;
        tx.billNo = billNo;
        wallet.billCounter = billNo;
        await wallet.save();
    } else if (tx.type === "Invoice") {
        const wallet = await Wallet.findById(walletId);
        const defaultCount = wallet.invoiceCounter || 1000;
        const invNo = defaultCount + 1;
        tx.invNo = invNo;
        wallet.invoiceCounter = invNo;
        await wallet.save();
    }
    try {
        tx = await tx.save();
        res.json({
            status: 200,
            data: tx,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const createPaymentTx = async (req, res) => {
    console.log(req.body);

    const provider = [];
    if (req.body.dwollaBankAcc) {
        provider.push("DwollaACH");
    }
    if (req.body.stripeAcc) {
        provider.push("StripeCard");
    }

    const newTx = new Transaction({
        type: "Payment",
        description: req.body.desc,
        amount: req.body.amount,
        amountPaid: 0,
        firstPartyWallet: req.body.firstPartyWallet,
        firstParty: req.body.firstPartyProfile,
        secondPartyWallet: req.body.secondPartyWallet,
        secondParty: req.body.secondPartyProfile,
        paymentType: "Marketplace",
        providers: provider,
        dwollaConfig: {
            receiverDwollaBankAcc: req.body.dwollaBankAcc,
        },
        stripeConfig: {
            receiverStripeAcc: req.body.stripeAcc,
        },
    });

    const billList = await billListInitHelper(newTx._id, "Transaction", req.body.amount);
    newTx.billList = billList._id;

    try {
        const resTx = await newTx.save();
        console.log(resTx);

        res.json({
            status: 200,
            data: resTx,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const update = async (req, res) => {
    try {
        var entries = req.body.entries;
        delete req.body.entries;
        var tx;
        const editCounter = req.body.editCounter;
        const walletId = req.body.walletId;
        const defaultCounter = req.body.defaultCounter;

        if (editCounter && walletId && defaultCounter) {
            await Wallet.findByIdAndUpdate(walletId, defaultCounter, {new: true}, function (err, updatedWallet) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(updatedWallet);
                }
            });
        }

        if (req.body && req.body._id) {
            const txOld = req.body;
            tx = await Transaction.findByIdAndUpdate(txOld._id, txOld, {
                new: true,
            });
            console.log(tx);
            if (!tx) {
                res.json({
                    status: 400,
                    data: null,
                    error: "Id not found ",
                });
            } else {
                res.json({status: 200, data: tx});
            }
        }

        if (entries && entries.length > 0) {
            var lines = await JournalLine.insertMany(entries);

            await processJournalLines(lines);
        }

        switch (req.body.type) {
            case "Invoice": // Do something
                await onInvoiceSave(tx);
                break;
            case "Bill":
                break; // Do SomeThing
        }
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const deleteTx = async (req, res) => {
    const txId = req.body._id;
    try {
        console.log(txId);
        let tx = await Transaction.findByIdAndDelete(txId);
        res.json({status: 200, data: tx});
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
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
            })
            .populate("term")
            .populate({
                path: "secondParty",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "firstParty",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "firstPartyWallet",
                populate: {
                    path: "parent",
                    populate: {
                        path: "parent",
                    },
                },
            })
            .populate({
                path: "firstPartyWallet",
                populate: {
                    path: "printLogo",
                },
            })
            .populate({
                path: "secondPartyWallet",
                populate: {
                    path: "parent",
                    populate: {
                        path: "parent",
                    },
                },
            })
            .populate("BankChartAccount")
            .populate("attachedFiles");

        return tx;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const getTx = async (req, res) => {
    var txId = req.body.txId;
    console.log(txId);
    if (txId) {
        await getTxHelper(txId)
            .then(txData => {
                res.json({
                    status: 200,
                    data: txData,
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
            data: null,
            err,
        });
    }
};

const getTxByWallet = async (req, res) => {
    const walletId = req.body.walletId;
    const type = req.body.type;

    let opositeType;
    if (type === "Bill") {
        opositeType = "Invoice";
    } else if (type === "Invoice") {
        opositeType = "Bill";
    }

    if (walletId) {
        var tx = await Transaction.find({firstPartyWallet: req.body.walletId, type: type, deleteStatus: false})
            .sort({createdAt: -1})
            .populate({
                path: "secondParty",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "firstParty",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            });
        res.json({
            status: 200,
            data: tx,
        });
    } else {
        res.json({
            status: 400,
            data: null,
        });
    }
};

const getBothSidesTxByWallet = async (req, res) => {
    const walletId = req.body.walletId;
    const type = req.body.type;

    let opositeType;
    if (type === "Bill") {
        opositeType = "Invoice";
    } else if (type === "Invoice") {
        opositeType = "Bill";
    }

    if (walletId) {
        var tx = await Transaction.find({
            $and: [
                {deleteStatus: false},
                {
                    $or: [
                        {firstPartyWallet: req.body.walletId, type: type},
                        {secondPartyWallet: req.body.walletId, type: opositeType, processed: true},
                    ],
                },
            ],
        })
            .sort({createdAt: -1})
            .populate({
                path: "secondParty",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "firstParty",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            });
        res.json({
            status: 200,
            data: tx,
        });
    } else {
        res.json({
            status: 400,
            data: null,
        });
    }
};

const getTxByTemplateId = async (req, res) => {
    const templateId = req.body.templateId;
    if (templateId) {
        var tx = await Transaction.find({templateId: req.body.templateId, deleteStatus: false})
            .sort({createdAt: -1})
            .populate({
                path: "secondParty",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            });
        res.json({
            status: 200,
            data: tx,
        });
    } else {
        res.json({
            status: 400,
            data: null,
        });
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

                const chartAcc = item?.chartAccount;

                const newObj = {
                    chartId: item?.chartAccount?._id,
                    chartAccount: {...chartAcc._doc},
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
                const chartAcc = tx?.billList?.taxRelationModel?.chartAccount;

                const newObj = {
                    chartId: tx?.billList?.taxRelationModel?.chartAccount?._id,
                    chartAccount: {...chartAcc._doc},
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
                const chartAcc = tx?.billList?.discountRelationModel?.chartAccount;

                const newObj = {
                    chartId: tx?.billList?.discountRelationModel?.chartAccount?._id,
                    chartAccount: {...chartAcc._doc},
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

                const chartAcc = item?.chartAccount;

                const newObj = {
                    chartId: item?.chartAccount?._id,
                    chartAccount: {...chartAcc._doc},
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

const createJournalLineHelperFromStripePayment = async txId => {
    try {
        await getTxHelper(txId)
            .then(async txData => {
                const walletId = txData.firstPartyWallet;
                const docCashAcc = txData.BankChartAccount;
                const cashAccount = {
                    ...docCashAcc._doc,
                };
                if ((txData.type === "Bill" || txData.type === "Payment") && txData.processed) {
                    const lateFeesChartRes = await ChartAccount.findOne({
                        wallet: walletId,
                        name: "LateFees",
                        qbType: "AccountsReceivable",
                    });
                    const lateFeesChart = {
                        ...lateFeesChartRes._doc,
                    };

                    const getOldJLines = await JournalLine.find({wallet: walletId, transaction: txData?._id}).populate(
                        "account"
                    );

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

                    billSubmitHelper(txData)
                        .then(async data => {
                            let newLines = [];
                            newLines = data?.lines;

                            const d2 = moment(txData?.dueDate).format("YYYY-M-D");
                            const d1 = moment().format("YYYY-M-D");

                            if (d2 < d1 && txData?.lateFeeAmount > 0) {
                                const lateFeeLine = {
                                    chartId: lateFeesChart._id,
                                    chartAccount: lateFeesChart,
                                    amount: txData?.lateFeeAmount,
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
                                            transaction: txData?._id,
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
                                        txData._id,
                                        {processed: true, amountPaid: data?.total, status: "Paid"},
                                        {
                                            new: true,
                                        }
                                    );

                                    const resObj = {
                                        data,
                                        datakk,
                                        totallines,
                                        finalJLine,
                                        oldLinesIdArr,
                                        savedJournalLines,
                                    };

                                    return resObj;
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
                } else if (txData.type === "Invoice" && txData.processed) {
                    const lateFeesChartRes = await ChartAccount.findOne({
                        wallet: walletId,
                        name: "LateFees",
                        qbType: "AccountsReceivable",
                    });
                    const lateFeesChart = {
                        ...lateFeesChartRes._doc,
                    };

                    const getOldJLines = await JournalLine.find({wallet: walletId, transaction: txData?._id}).populate(
                        "account"
                    );

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

                    invoiceSubmitHelper(txData)
                        .then(async data => {
                            let newLines = [];
                            newLines = data?.lines;

                            const d2 = moment(txData?.dueDate).format("YYYY-M-D");
                            const d1 = moment().format("YYYY-M-D");

                            if (d2 < d1 && txData?.lateFeeAmount > 0) {
                                const lateFeeLine = {
                                    chartId: lateFeesChart._id,
                                    chartAccount: lateFeesChart,
                                    amount: txData?.lateFeeAmount,
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
                                            transaction: txData?._id,
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
                                        txData._id,
                                        {processed: true, amountPaid: data?.total, status: "Paid"},
                                        {
                                            new: true,
                                        }
                                    );

                                    const resObj = {
                                        data,
                                        datakk,
                                        totallines,
                                        finalJLine,
                                        oldLinesIdArr,
                                        savedJournalLines,
                                    };

                                    return resObj;
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
                }
            })
            .catch(err => {
                return null;
                console.log(err);
            });
    } catch (err) {
        return null;
        console.log(err);
    }
};

const txPaymentUpdate = async (req, res) => {
    const txId = req.body.transactionId;
    const paymentType = req.body.paymentType;
    const paymentProvider = req.body.paymentProvider;
    const achBankPaymentAccount = req.body.achBankPaymentAccount;
    const clientSecret = req.body.client_secret;
    const intentId = req.body.intentId;
    const status = req.body.status;
    const amountPaid = req.body.amount;

    const freshTx = await Transaction.findOne({_id: txId});

    const newTxObj = {
        stripePaymentIntent: {
            intentId,
            clientSecret,
        },
        achBankPaymentAccount,
        paymentProvider,
        paymentType,
        amountPaid,
        status,
    };

    if (status === "Paid" && freshTx?.status !== "Paid" && freshTx.status !== "Processing") {
        await createJournalLineHelperFromStripePayment(txId)
            .then(async data => {
                if (txId) {
                    const changedTx = await Transaction.findByIdAndUpdate(txId, newTxObj);
                    res.json({
                        status: 200,
                        data: {
                            changedTx,
                            data,
                        },
                    });
                } else {
                    res.json({
                        status: 400,
                        data: null,
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        if (txId) {
            const changedTx = await Transaction.findByIdAndUpdate(txId, newTxObj);
            res.json({
                status: 200,
                data: {
                    changedTx,
                },
            });
        } else {
            res.json({
                status: 400,
                data: null,
            });
        }
    }
};

const getTxForRelation = async (req, res) => {
    const secondPartyWallet = req.body.secondPartyWallet;
    const firstPartyWallet = req.body.firstPartyWallet;
    const txCount = req.body.count;

    console.log(req.body);

    try {
        const billTxs = Transaction.find({
            $or: [
                {$and: [{firstPartyWallet: firstPartyWallet}, {secondPartyWallet: secondPartyWallet}, {type: "Bill"}]},
                {$and: [{firstPartyWallet: secondPartyWallet}, {secondPartyWallet: firstPartyWallet}, {type: "Bill"}]},
            ],
        })
            .sort({createdAt: -1})
            .limit(txCount);

        const invoiceTxs = Transaction.find({
            $or: [
                {
                    $and: [
                        {firstPartyWallet: firstPartyWallet},
                        {secondPartyWallet: secondPartyWallet},
                        {type: "Invoice"},
                    ],
                },
                {
                    $and: [
                        {firstPartyWallet: secondPartyWallet},
                        {secondPartyWallet: firstPartyWallet},
                        {type: "Invoice"},
                    ],
                },
            ],
        })
            .sort({createdAt: -1})
            .limit(txCount);

        const paymentTxs = Transaction.find({
            $or: [
                {
                    $and: [
                        {firstPartyWallet: firstPartyWallet},
                        {secondPartyWallet: secondPartyWallet},
                        {type: "Payment"},
                    ],
                },
                {
                    $and: [
                        {firstPartyWallet: secondPartyWallet},
                        {secondPartyWallet: firstPartyWallet},
                        {type: "Payment"},
                    ],
                },
            ],
        })
            .sort({createdAt: -1})
            .limit(txCount);

        const allTxs = Transaction.find({
            $or: [
                {$and: [{firstPartyWallet: firstPartyWallet}, {secondPartyWallet: secondPartyWallet}]},
                {$and: [{firstPartyWallet: secondPartyWallet}, {secondPartyWallet: firstPartyWallet}]},
            ],
        })
            .sort({createdAt: -1})
            .limit(txCount);

        const promises = [allTxs, billTxs, invoiceTxs, paymentTxs];

        Promise.allSettled(promises).then(results => {
            const allTxs = results[0].value;
            const billTxs = results[1].value;
            const invoiceTxs = results[2].value;
            const paymentTxs = results[3].value;

            res.json({
                status: 200,
                data: {
                    billTxs,
                    invoiceTxs,
                    paymentTxs,
                    allTxs,
                },
            });
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getTotalAmount = async (req, res) => {
    const firstPartyWalletId = req.body.firstPartyWalletId;
    const secondPartyWalletId = req.body.secondPartyWalletId;

    try {
        const totalAmountGroupBy = Transaction.aggregate([
            {
                $match: {
                    $and: [
                        {firstPartyWallet: mongoose.Types.ObjectId(firstPartyWalletId)},
                        {secondPartyWallet: mongoose.Types.ObjectId(secondPartyWalletId)},
                    ],
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: {
                        $sum: "$amount",
                    },
                    totalPaidAmount: {
                        $sum: "$amountPaid",
                    },
                    count: {
                        $sum: 1,
                    },
                    txs: {
                        $push: "$$ROOT",
                    },
                },
            },
        ]);

        const totalAmounSecondPartyGroupBy = Transaction.aggregate([
            {
                $match: {
                    $and: [
                        {firstPartyWallet: mongoose.Types.ObjectId(secondPartyWalletId)},
                        {secondPartyWallet: mongoose.Types.ObjectId(firstPartyWalletId)},
                    ],
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: {
                        $sum: "$amount",
                    },
                    totalPaidAmount: {
                        $sum: "$amountPaid",
                    },
                    count: {
                        $sum: 1,
                    },
                    txs: {
                        $push: "$$ROOT",
                    },
                },
            },
        ]);

        const allTxs = Transaction.find({
            $or: [
                {$and: [{firstPartyWallet: firstPartyWalletId}, {secondPartyWallet: secondPartyWalletId}]},
                {$and: [{firstPartyWallet: secondPartyWalletId}, {secondPartyWallet: firstPartyWalletId}]},
            ],
        });

        const promises = [totalAmountGroupBy, totalAmounSecondPartyGroupBy, allTxs];

        Promise.allSettled(promises).then(results => {
            const firstPartyTotalAmount = results[0].value;
            const secondPartyTotalAmount = results[1].value;
            const allTxs = results[2].value;

            res.json({
                status: 200,
                data: {
                    firstPartyTotalAmount,
                    secondPartyTotalAmount,
                    allTxs,
                },
            });
        });
    } catch (err) {
        console.log(err);

        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const createTransactionForRentalRelation = async (req, res) => {
    try {
        console.log(req.body);

        let walletId = req.body.walletId;
        let bankChartAccountName = req.body.bankChartAccountName;
        let bankChartAccountQbType = req.body.bankChartAccountQbType;
        let billItems = req.body.billItems;
        let firstPartyWallet = req.body.firstPartyWallet;
        let secondPartyWallet = req.body.secondPartyWallet;
        let firstParty = req.body.firstParty;
        let secondParty = req.body.secondParty;
        let user = req.body.user;
        let rentalRelationId = req.body.rentalRelationId;
        let isOneTimeBill = req.body.isOneTimeBill;

        const wallet = await Wallet.findById(walletId);
        let currentInvoiceCounter = parseInt(wallet?.invoiceCounter) + 1;

        const accReceivableRes = await ChartAccount.findOne({
            wallet: walletId,
            name: bankChartAccountName,
            qbType: bankChartAccountQbType,
        });

        const refundableItemChartAcc = await ChartAccount.findOne({
            wallet: walletId,
            name: "collectedSecurityMoney",
            qbType: "OtherCurrentLiabilities",
        });

        const rentalIncomeChartAcc = await ChartAccount.findOne({
            wallet: walletId,
            name: "Rental Income",
            qbType: "ServiceFeeIncome",
        });

        let amount = 0;
        let billItemObjs = [];
        let billItemIds = [];

        if (billItems.length > 0) {
            let newBillList = new BillList({
                parentModelName: "Transaction",
            });

            billItems.length > 0 &&
                billItems.map(item => {
                    amount = amount + item.amount;

                    let newbillItem;

                    if (item.refundable) {
                        newbillItem = new BillItem({
                            chartAccount: refundableItemChartAcc._id,
                            name: item.type,
                            description: item.type,
                            qTy: 1,
                            rate: parseInt(item.amount),
                            billList: newBillList._id,
                        });
                    } else {
                        newbillItem = new BillItem({
                            chartAccount: rentalIncomeChartAcc._id,
                            name: item.type,
                            description: item.type,
                            qTy: 1,
                            rate: parseInt(item.amount),
                            billList: newBillList._id,
                        });
                    }

                    billItemObjs.push(newbillItem);
                    billItemIds.push(newbillItem._id);
                });

            await BillItem.insertMany(billItemObjs);

            newBillList.items = billItemIds;

            const newTx = new Transaction({
                invNo: currentInvoiceCounter,
                BankChartAccount: accReceivableRes._id,
                type: "Invoice",
                amount: amount,
                finalAmount: amount,
                dueDate: billItems[0].dueDate,
                lateFeeApplicable: false,
                lateFeeAmount: billItems[0].Latefees,
                firstPartyWallet: firstPartyWallet,
                firstParty: firstParty,
                secondPartyWallet: secondPartyWallet,
                secondParty: secondParty,
                user: user,
                parent: rentalRelationId,
                parentModelName: "RentalRelation",
                billList: newBillList._id,
                isOneTimeBill: isOneTimeBill,
            });

            if (req.body.LateFeesDueDate) {
                newTx.dueDate = req.body.LateFeesDueDate;
            }

            newBillList.parent = newTx._id;
            await newBillList.save();

            wallet.invoiceCounter = currentInvoiceCounter;
            await wallet.save();

            await newTx.save();

            await saveInvoiceHelperForRental(newTx._id, walletId)
                .then(Jurnaldata => {
                    res.json({
                        status: 200,
                        data: {
                            newBillList,
                            newTx,
                            billItemObjs,
                            Jurnaldata,
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
        }
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const getTxByRentalRelation = async (req, res) => {
    try {
        const rentalRelationId = req.body.rentalRelationId;
        const isOneTimeBill = req.body.isOneTimeBill;

        const txs = await Transaction.find({parent: rentalRelationId, isOneTimeBill: isOneTimeBill});

        res.json({
            status: 200,
            data: txs,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const checkTenantPresent = async (secondPartyWallet, secondParty, rentalId) => {
    try {
        const getTxs = await Transaction.find({parent: rentalId});

        let txWithOutSecondParty = [];
        let txIdWithOutSecondParty = [];

        getTxs.length > 0 &&
            getTxs.map(tx => {
                if (!tx.secondPartyWallet || !tx.secondParty) {
                    let reStructuredTx = {
                        ...tx._doc,
                    };

                    const updatedTx = new Transaction({
                        ...reStructuredTx,
                        secondPartyWallet: secondPartyWallet,
                        secondParty: secondParty,
                    });

                    txWithOutSecondParty.push(updatedTx);
                    txIdWithOutSecondParty.push(tx._id);
                }
            });

        if (txWithOutSecondParty.length > 0) {
            const deletedData = await Transaction.deleteMany({_id: {$in: txIdWithOutSecondParty}});

            const updatedTxs = await Transaction.insertMany(txWithOutSecondParty);

            return updatedTxs;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
};

const getTxForTenant = async (req, res) => {
    try {
        console.log(req.body);

        let secondPartyWallet = req.body.secondPartyWallet;
        let secondParty = req.body.secondParty;
        let rentalId = req.body.rentalId;

        await checkTenantPresent(secondPartyWallet, secondParty, rentalId)
            .then(async data => {
                const getTxs = await Transaction.find({parent: rentalId})
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
                    })
                    .populate("term")
                    .populate({
                        path: "secondParty",
                        populate: {
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })
                    .populate({
                        path: "firstParty",
                        populate: {
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })
                    .populate("firstPartyWallet")
                    .populate("secondPartyWallet")
                    .populate("BankChartAccount")
                    .populate("attachedFiles");

                res.json({
                    status: 200,
                    data: getTxs,
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
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

module.exports = {
    create,
    createPaymentTx,
    update,
    deleteTx,
    getTx,
    getTxByWallet,
    getTxByTemplateId,
    txPaymentUpdate,
    getTxForRelation,
    getTotalAmount,
    getBothSidesTxByWallet,
    createJournalLineHelperFromStripePayment,
    getTxHelper,
    createTransactionForRentalRelation,
    getTxByRentalRelation,
    getTxForTenant,
};
