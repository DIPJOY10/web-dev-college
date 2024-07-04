const TxTemplate = require("../../models/wallet.transaction.template.model");
const Transaction = require("../../models/wallet.transaction.model");
const {billListInitHelper} = require("./bill.list.controller");
const JournalLine = require("../../models/wallet.journal.line.model");
const Wallet = require("../../models/wallet.model");
const _ = require("lodash");
const {processJournalLines, findOrCreateRule} = require("./journal.entry.controller");
const {onInvoiceSave} = require("./invoice");
const {findNextDateUpdate, findNextDateGenerator} = require("../../scheduleJobs/scheduleHelper.js");
const moment = require("moment");
const ChartAccount = require("../../models/wallet.chart.account.model");
const BillList = require("../../models/wallet.bill.list.model");
const BillItem = require("../../models/wallet.bill.item.model");
const Scheduler = require("../../models/scheduler.model");
const {createSchedulerFromObject} = require("../scheduler.controller");

const createTxTemplateFromObj = async txTemplateObj => {
    var txTemplate = new TxTemplate(txTemplateObj);
    const billList = await billListInitHelper(txTemplate._id, "Transaction");
    let scheduler = await createSchedulerFromObject({
        ...(txTemplateObj.schedulingData || {}),
        parent: txTemplate?._id,
        parentModelName: "TxTemplate",
    });

    console.log("scheduler ", scheduler);
    // scheduler = await scheduler.save();
    txTemplate.billList = billList._id;
    txTemplate.schedulingData = scheduler?._id;

    const walletId = txTemplate.firstPartyWallet;
    if (txTemplate.type === "Bill") {
        const wallet = await Wallet.findById(walletId);
        const defaultCount = wallet.templateBillCounter || 1000;
        const billNo = defaultCount + 1;
        txTemplate.billNo = billNo;
        wallet.templateBillCounter = billNo;
        await wallet.save();
    } else if (txTemplate.type === "Invoice") {
        const wallet = await Wallet.findById(walletId);
        const defaultCount = wallet.templateInvCounter || 1000;
        const invNo = defaultCount + 1;
        txTemplate.invNo = invNo;
        wallet.templateInvCounter = invNo;
        await wallet.save();
    }

    txTemplate = await txTemplate.save();

    return txTemplate;
};

const create = async (req, res) => {
    try {
        var txTemplate = await createTxTemplateFromObj(req.body);

        txTemplate = await txTemplate.save();
        res.json({
            status: 200,
            data: txTemplate,
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
        var txTemplate;

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
            txTemplate = await TxTemplate.findByIdAndUpdate(txOld._id, txOld, {
                new: true,
            })
                .populate({
                    path: "billList",
                    model: "BillList",
                    populate: [
                        {
                            path: "items",
                            populate: {
                                path: "offeringRelation",
                                populate: {
                                    path: "chartAccount",
                                },
                            },
                        },
                        {
                            path: "items",
                            populate: {
                                path: "offeringRelation",
                                populate: {
                                    path: "offering",
                                },
                            },
                        },
                        {
                            path: "items",
                            populate: {
                                path: "offeringRelation",
                                populate: {
                                    path: "chartAccount",
                                },
                            },
                        },
                        {
                            path: "items",
                            populate: {
                                path: "chartAccount",
                            },
                        },
                        {
                            path: "discountRelationModel",
                            model: "DiscountOrTaxRelation",
                            populate: {
                                path: "discountOrTax",
                            },
                        },
                        {
                            path: "discountRelationModel",
                            model: "DiscountOrTaxRelation",
                            populate: {
                                path: "chartAccount",
                                model: "ChartAccount",
                            },
                        },
                        {
                            path: "taxRelationModel",
                            model: "DiscountOrTaxRelation",
                            populate: {
                                path: "discountOrTax",
                            },
                        },
                        {
                            path: "taxRelationModel",
                            model: "DiscountOrTaxRelation",
                            populate: {
                                path: "chartAccount",
                                model: "ChartAccount",
                            },
                        },
                    ],
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
                .populate("attachedFiles")
                .populate("schedulingData");
            console.log(txTemplate);
            if (!txTemplate) {
                res.json({
                    status: 400,
                    data: null,
                    error: "Id not found ",
                });
            } else {
                res.json({
                    status: 200,
                    data: txTemplate,
                });
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

const updateScheduleData = async (req, res) => {
    try {
        if (req.body && req.body._id) {
            const txOld = req.body;
            const txTemplate = await TxTemplate.findByIdAndUpdate(txOld._id, txOld, {
                new: true,
            });
            const nextDate = findNextDateUpdate(txTemplate, txTemplate?.schedulingData?.startDate);

            const oldSchedulingData = txTemplate?.schedulingData;
            const updatedTxTemp = {
                _id: txTemplate._id,
                schedulingData: {
                    ...oldSchedulingData,
                    nextDate: nextDate,
                },
            };
            console.log(updatedTxTemp);

            const newTxTemplate = await TxTemplate.findByIdAndUpdate(txTemplate._id, updatedTxTemp, {
                new: true,
            });

            if (!newTxTemplate) {
                res.json({
                    status: 400,
                    data: null,
                    error: "Id not found ",
                });
            } else {
                console.log(newTxTemplate);
                res.json({
                    status: 200,
                    data: newTxTemplate,
                });
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

const deleteTxTemplate = async (req, res) => {
    const txTemplateId = req.body._id;
    try {
        let deletedTemplate = await TxTemplate.findByIdAndDelete(txTemplateId);
        res.json({
            status: 200,
            data: deletedTemplate,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getTxTemplate = async (req, res) => {
    var txTemplateId = req.body.txTemplateId;

    if (txTemplateId) {
        var txTemplate = await TxTemplate.findById(txTemplateId)
            .populate({
                path: "billList",
                model: "BillList",
                populate: [
                    {
                        path: "items",
                        populate: {
                            path: "offeringRelation",
                            populate: {
                                path: "chartAccount",
                            },
                        },
                    },
                    {
                        path: "items",
                        populate: {
                            path: "offeringRelation",
                            populate: {
                                path: "offering",
                            },
                        },
                    },
                    {
                        path: "items",
                        populate: {
                            path: "offeringRelation",
                            populate: {
                                path: "chartAccount",
                            },
                        },
                    },
                    {
                        path: "items",
                        populate: {
                            path: "chartAccount",
                        },
                    },
                    {
                        path: "discountRelationModel",
                        model: "DiscountOrTaxRelation",
                        populate: {
                            path: "discountOrTax",
                        },
                    },
                    {
                        path: "discountRelationModel",
                        model: "DiscountOrTaxRelation",
                        populate: {
                            path: "chartAccount",
                            model: "ChartAccount",
                        },
                    },
                    {
                        path: "taxRelationModel",
                        model: "DiscountOrTaxRelation",
                        populate: {
                            path: "discountOrTax",
                        },
                    },
                    {
                        path: "taxRelationModel",
                        model: "DiscountOrTaxRelation",
                        populate: {
                            path: "chartAccount",
                            model: "ChartAccount",
                        },
                    },
                ],
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
            .populate("attachedFiles")
            .populate("schedulingData");
        // .populate({
        //     path: "billList",
        //     model: "BillList",
        //     populate: {
        //         path: "items",
        //         populate: {
        //             path: "offeringRelation",
        //             populate: {
        //                 path: "offering",
        //             },
        //         },
        //     },
        //     //
        // })
        // .populate({
        //     path: "billList",
        //     model: "BillList",
        //     populate: {
        //         path: "items",
        //         populate: {
        //             path: "offeringRelation",
        //             populate: {
        //                 path: "chartAccount",
        //             },
        //         },
        //     },
        //     //
        // })
        // .populate({
        //     path: "billList",
        //     model: "BillList",
        //     populate: {
        //         path: "items",
        //         populate: {
        //             path: "chartAccount",
        //         },
        //     },
        //     //
        // })
        // .populate({
        //     path: "billList",
        //     model: "BillList",
        //     populate: {
        //         path: "discountRelationModel",
        //         model: "DiscountOrTaxRelation",
        //         populate: {
        //             path: "discountOrTax",
        //         },
        //     },
        //     //
        // })
        // .populate({
        //     path: "billList",
        //     model: "BillList",
        //     populate: {
        //         path: "discountRelationModel",
        //         model: "DiscountOrTaxRelation",
        //         populate: {
        //             path: "chartAccount",
        //             model: "ChartAccount",
        //         },
        //     },
        //     //
        // })
        // .populate({
        //     path: "billList",
        //     model: "BillList",
        //     populate: {
        //         path: "taxRelationModel",
        //         model: "DiscountOrTaxRelation",
        //         populate: {
        //             path: "discountOrTax",
        //         },
        //     },
        //     //
        // })
        // .populate({
        //     path: "billList",
        //     model: "BillList",
        //     populate: {
        //         path: "taxRelationModel",
        //         model: "DiscountOrTaxRelation",
        //         populate: {
        //             path: "chartAccount",
        //             model: "ChartAccount",
        //         },
        //     },
        //     //
        // })

        console.log(txTemplate);

        var resObject = {
            status: 200,
            data: txTemplate,
        };

        res.json(resObject);
    } else {
        res.json({
            status: 400,
            data: null,
        });
    }
};

const getTxTemplateByWallet = async (req, res) => {
    const walletId = req.body.walletId;
    const type = req.body.type;
    if (walletId) {
        var tx = await TxTemplate.find({firstPartyWallet: walletId, type: type, deleteStatus: false}).populate({
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

// if "txTemplates" is a array of template data then this function is ok because
// if "txTemplates" is a array of template ids then we have to changes the code

const instantTxGenerator = async txTemplatesIds => {
    const txTemplates = await TxTemplate.find({_id: {$in: [txTemplatesIds]}});

    const myWalletId = txTemplates[0].firstPartyWallet;
    let walletData = await Wallet.findById(myWalletId);
    let myInvoiceNo = walletData.invoiceCounter || 1000;
    let myBillNo = walletData.billCounter || 1000;
    let allGeneratedTxs = [];
    let allUpdatedTemplates = [];
    let arrayOfTemplateId = [];

    txTemplates.forEach(async txTemplate => {
        if (txTemplate?.schedulingData.endType === "By") {
            const nextDate = txTemplate.schedulingData.nextDate;
            const oldSchedulingData = txTemplate?.schedulingData;
            const nextDateStr = findNextDateGenerator(txTemplate, nextDate);

            const updatedTxTemp = new TxTemplate({
                ...txTemplate._doc,
                schedulingData: {
                    ...oldSchedulingData,
                    nextDate: nextDateStr,
                },
            });

            arrayOfTemplateId.push(txTemplate?._id);
            allUpdatedTemplates.push(updatedTxTemp);

            const newTx = new Transaction({
                status: txTemplate.status,
                type: txTemplate.type,
                templateId: txTemplate._id,
                memo: txTemplate.memo,
                description: txTemplate.description,
                amount: txTemplate.amount,
                amountPaid: txTemplate.amountPaid,
                currency: txTemplate.currency,
                files: txTemplate.files,
                dueDate: txTemplate.dueDate,
                invoiceDate: txTemplate.invoiceDate,
                lateFeeApplicable: txTemplate.lateFeeApplicable,
                lateFeeAmount: txTemplate.lateFeeAmount,
                lateFeeDate: txTemplate.lateFeeDate,
                term: txTemplate.term,
                billList: txTemplate.billList,
                firstPartyWallet: txTemplate.firstPartyWallet,
                firstParty: txTemplate.firstParty,
                secondPartyWallet: txTemplate.secondPartyWallet,
                secondParty: txTemplate.secondParty,
                wallets: txTemplate.wallets,
                paymentType: txTemplate.paymentType,
                paymentProvider: txTemplate.paymentProvider,
                stripePaymentIntent: txTemplate,
                user: txTemplate.user,
            });

            if (txTemplate.type === "Bill") {
                newTx.billNo = myBillNo++;
            } else if (txTemplate.type === "Invoice") {
                newTx.invNo = myInvoiceNo++;
            }
            allGeneratedTxs.push(newTx);
        }
        if (txTemplate?.schedulingData.endType === "After") {
            const oldSchedulingData = txTemplate?.schedulingData;
            const numOccurrences = txTemplate?.schedulingData?.NumberOfOccurrences;
            const nextDateStr = findNextDateGenerator(txTemplate, txTemplate?.schedulingData?.nextDate);

            const updatedTxTemp = new TxTemplate({
                ...txTemplate._doc,
                schedulingData: {
                    ...oldSchedulingData,
                    nextDate: nextDateStr,
                    NumberOfOccurrences: numOccurrences - 1 < 0 ? 0 : numOccurrences - 1,
                },
            });

            arrayOfTemplateId.push(txTemplate?._id);
            allUpdatedTemplates.push(updatedTxTemp);

            const newTx = new Transaction({
                status: txTemplate.status,
                type: txTemplate.type,
                templateId: txTemplate._id,
                memo: txTemplate.memo,
                description: txTemplate.description,
                amount: txTemplate.amount,
                amountPaid: txTemplate.amountPaid,
                currency: txTemplate.currency,
                files: txTemplate.files,
                dueDate: txTemplate.dueDate,
                invoiceDate: txTemplate.invoiceDate,
                lateFeeApplicable: txTemplate.lateFeeApplicable,
                lateFeeAmount: txTemplate.lateFeeAmount,
                lateFeeDate: txTemplate.lateFeeDate,
                term: txTemplate.term,
                billList: txTemplate.billList,
                firstPartyWallet: txTemplate.firstPartyWallet,
                firstParty: txTemplate.firstParty,
                secondPartyWallet: txTemplate.secondPartyWallet,
                secondParty: txTemplate.secondParty,
                wallets: txTemplate.wallets,
                paymentType: txTemplate.paymentType,
                paymentProvider: txTemplate.paymentProvider,
                stripePaymentIntent: txTemplate,
                user: txTemplate.user,
            });

            if (txTemplate.type === "Bill") {
                newTx.billNo = myBillNo++;
            } else if (txTemplate.type === "Invoice") {
                newTx.invNo = myInvoiceNo++;
            }
            allGeneratedTxs.push(newTx);
        }
    });

    if (allGeneratedTxs.length > 0) {
        await Transaction.insertMany(allGeneratedTxs)
            .then(() => {
                console.log("Tx inserted");
            })
            .catch(error => {
                console.log(error);
            });

        walletData.billCounter = myBillNo;
        walletData.invoiceCounter = myInvoiceNo;
        await walletData.save();
    }
    if (allUpdatedTemplates.length > 0) {
        await TxTemplate.deleteMany({_id: {$in: arrayOfTemplateId}})
            .then(() => {
                console.log("Delete template");
            })
            .catch(error => {
                console.log(error);
            });

        await TxTemplate.insertMany(allUpdatedTemplates)
            .then(() => {
                console.log("Template inserted");
            })
            .catch(error => {
                console.log(error);
            });
    }
};

const txGenerator = async () => {
    const d = new Date();
    const today = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

    const allTxTemplates = await TxTemplate.find({generatorRunning: true});

    const allModifiedTxTemplates = _.chain(allTxTemplates)
        .groupBy("firstPartyWallet")
        .map((value, key) => ({firstPartyWallet: key, data: value}))
        .value();

    allModifiedTxTemplates.forEach(async allModifiedTxTemplate => {
        const myWalletId = allModifiedTxTemplate.firstPartyWallet;
        let walletData = await Wallet.findById(myWalletId);
        let myInvoiceNo = walletData.invoiceCounter || 1000;
        let myBillNo = walletData.billCounter || 1000;
        let allGeneratedTxs = [];
        let allUpdatedTemplates = [];
        let arrayOfTemplateId = [];

        allModifiedTxTemplate.data.forEach(async txTemplate => {
            if (txTemplate.scheduleType !== "Unschedule") {
                if (txTemplate?.schedulingData.endType === "By") {
                    const d = new Date(txTemplate.schedulingData.stopDate).getDate();
                    const m = new Date(txTemplate.schedulingData.stopDate).getMonth();
                    const y = new Date(txTemplate.schedulingData.stopDate).getFullYear();
                    const endDate = m + "/" + d + "/" + y;
                    const nextDate = txTemplate.schedulingData.nextDate;

                    if (new Date(endDate) > new Date(nextDate)) {
                        if (today === nextDate) {
                            const oldSchedulingData = txTemplate?.schedulingData;
                            const nextDateStr = findNextDateGenerator(txTemplate, nextDate);

                            const updatedTxTemp = new TxTemplate({
                                ...txTemplate._doc,
                                schedulingData: {
                                    ...oldSchedulingData,
                                    nextDate: nextDateStr,
                                },
                            });

                            arrayOfTemplateId.push(txTemplate?._id);

                            allUpdatedTemplates.push(updatedTxTemp);

                            const newTx = new Transaction({
                                status: txTemplate.status,
                                type: txTemplate.type,
                                templateId: txTemplate._id,
                                memo: txTemplate.memo,
                                description: txTemplate.description,
                                amount: txTemplate.amount,
                                amountPaid: txTemplate.amountPaid,
                                currency: txTemplate.currency,
                                files: txTemplate.files,
                                dueDate: txTemplate.dueDate,
                                invoiceDate: txTemplate.invoiceDate,
                                lateFeeApplicable: txTemplate.lateFeeApplicable,
                                lateFeeAmount: txTemplate.lateFeeAmount,
                                lateFeeDate: txTemplate.lateFeeDate,
                                term: txTemplate.term,
                                billList: txTemplate.billList,
                                firstPartyWallet: txTemplate.firstPartyWallet,
                                firstParty: txTemplate.firstParty,
                                secondPartyWallet: txTemplate.secondPartyWallet,
                                secondParty: txTemplate.secondParty,
                                wallets: txTemplate.wallets,
                                paymentType: txTemplate.paymentType,
                                paymentProvider: txTemplate.paymentProvider,
                                stripePaymentIntent: txTemplate,
                                user: txTemplate.user,
                            });

                            if (txTemplate.type === "Bill") {
                                newTx.billNo = myBillNo++;
                            } else if (txTemplate.type === "Invoice") {
                                newTx.invNo = myInvoiceNo++;
                            }
                            allGeneratedTxs.push(newTx);
                        }
                    } else {
                        await TxTemplate.findByIdAndUpdate(txTemplate._id, {generatorRunning: false}, {new: true});
                    }
                }
                if (txTemplate?.schedulingData.endType === "After") {
                    const nextDate = txTemplate.schedulingData.nextDate;
                    if (txTemplate?.schedulingData.NumberOfOccurrences > 0) {
                        if (today === nextDate) {
                            const oldSchedulingData = txTemplate?.schedulingData;
                            const numOccurrences = txTemplate?.schedulingData?.NumberOfOccurrences;
                            const nextDateStr = findNextDateGenerator(txTemplate, txTemplate?.schedulingData?.nextDate);

                            const updatedTxTemp = new TxTemplate({
                                ...txTemplate._doc,
                                schedulingData: {
                                    ...oldSchedulingData,
                                    nextDate: nextDateStr,
                                    NumberOfOccurrences: numOccurrences - 1,
                                },
                            });

                            arrayOfTemplateId.push(txTemplate?._id);
                            allUpdatedTemplates.push(updatedTxTemp);

                            const newTx = new Transaction({
                                status: txTemplate.status,
                                type: txTemplate.type,
                                templateId: txTemplate._id,
                                memo: txTemplate.memo,
                                description: txTemplate.description,
                                amount: txTemplate.amount,
                                amountPaid: txTemplate.amountPaid,
                                currency: txTemplate.currency,
                                files: txTemplate.files,
                                dueDate: txTemplate.dueDate,
                                invoiceDate: txTemplate.invoiceDate,
                                lateFeeApplicable: txTemplate.lateFeeApplicable,
                                lateFeeAmount: txTemplate.lateFeeAmount,
                                lateFeeDate: txTemplate.lateFeeDate,
                                term: txTemplate.term,
                                billList: txTemplate.billList,
                                firstPartyWallet: txTemplate.firstPartyWallet,
                                firstParty: txTemplate.firstParty,
                                secondPartyWallet: txTemplate.secondPartyWallet,
                                secondParty: txTemplate.secondParty,
                                wallets: txTemplate.wallets,
                                paymentType: txTemplate.paymentType,
                                paymentProvider: txTemplate.paymentProvider,
                                stripePaymentIntent: txTemplate,
                                user: txTemplate.user,
                            });

                            if (txTemplate.type === "Bill") {
                                newTx.billNo = myBillNo++;
                            } else if (txTemplate.type === "Invoice") {
                                newTx.invNo = myInvoiceNo++;
                            }
                            allGeneratedTxs.push(newTx);
                        }
                    } else {
                        await TxTemplate.findByIdAndUpdate(txTemplate._id, {generatorRunning: false}, {new: true});
                    }
                }
            }
        });

        if (allGeneratedTxs.length > 0) {
            await Transaction.insertMany(allGeneratedTxs)
                .then(() => {
                    console.log("Tx inserted");
                })
                .catch(error => {
                    console.log(error);
                });

            walletData.billCounter = myBillNo;
            walletData.invoiceCounter = myInvoiceNo;
            await walletData.save();
        }
        if (allUpdatedTemplates.length > 0) {
            await TxTemplate.deleteMany({_id: {$in: arrayOfTemplateId}})
                .then(() => {
                    console.log("Delete template");
                })
                .catch(error => {
                    console.log(error);
                });

            await TxTemplate.insertMany(allUpdatedTemplates)
                .then(() => {
                    console.log("Template inserted");
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
};

const createTemplateForRentalRelation = async (req, res) => {
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
        let lateFeesDueDate = req.body.LateFeesDueDate;

        const wallet = await Wallet.findById(walletId);
        let currentInvoiceCounter = parseInt(wallet?.templateInvCounter) + 1;

        const accBankChartRes = await ChartAccount.findOne({
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

                    let newbillItem = new BillItem({
                        chartAccount: rentalIncomeChartAcc._id,
                        name: item.type,
                        description: item.type,
                        qTy: 1,
                        rate: parseInt(item.amount),
                        billList: newBillList._id,
                    });

                    billItemObjs.push(newbillItem);
                    billItemIds.push(newbillItem._id);
                });

            await BillItem.insertMany(billItemObjs);

            newBillList.items = billItemIds;

            const newTemplate = new TxTemplate({
                name: "",
                // generatorRunning: true,
                invNo: currentInvoiceCounter,
                BankChartAccount: accBankChartRes._id,
                type: "Invoice",
                amount: amount,
                finalAmount: amount,
                dueDate: lateFeesDueDate,
                billList: newBillList._id,
                firstPartyWallet: firstPartyWallet,
                firstParty: firstParty,
                secondPartyWallet: secondPartyWallet,
                secondParty: secondParty,
                user: user,
                parent: rentalRelationId,
                parentModelName: "RentalRelation",
            });

            newBillList.parent = newTemplate._id;
            await newBillList.save();

            wallet.templateInvCounter = currentInvoiceCounter;
            wallet.save();

            await newTemplate.save();

            res.json({
                status: 200,
                data: {
                    newBillList,
                    newTx,
                    billItemObjs,
                },
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

const getTxTemplateByRentalRelation = async (req, res) => {
    try {
        const rentalRelationId = req.body.rentalRelationId;
        const txTemplates = await TxTemplate.find({parent: rentalRelationId});

        res.json({
            status: 200,
            data: txTemplates,
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
    update,
    deleteTxTemplate,
    getTxTemplate,
    getTxTemplateByWallet,
    txGenerator,
    updateScheduleData,
    createTemplateForRentalRelation,
    getTxTemplateByRentalRelation,
    createTxTemplateFromObj,
};
