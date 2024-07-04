var async = require('async');
const DwollaBankAccount = require('../../models/wallet.dwolla.BankAccount.model');
const DwollaCustomer = require('../../models/wallet.dwolla.customer.model');
const Team = require('../../models/team.model')
const keys = require('../../keys/keys');
const moment = require('moment');
const Wallet = require('../../models/wallet.model');
const { getTxHelper } = require('./transaction.controller');
const { processJournalLinesForAuto } = require('./journal.line.controller');
const ChartAccount = require('../../models/wallet.chart.account.model');
const JournalLine = require('../../models/wallet.journal.line.model');
const Transaction = require('../../models/wallet.transaction.model');
const _ = require("lodash");
var Client = require("dwolla-v2").Client;


const dwolla = new Client({
    key: keys.dwollaKey,
    secret: keys.dwollaSecret,
    environment: keys.dwollaEnv, // defaults to 'production'
});

const ENVIRONMENT = {
    sandbox: "https://api-sandbox.dwolla.com",
    production: "https://api.dwolla.com",
};

const env = keys.dwollaEnv;





const createDwollaBankAccount = async (req, res) => {
    try {

        console.log("add new Dwolla bank Account")

        console.log(req.body)

        const resFundSrcs = await dwolla.get(`funding-sources/${req.body.url}`)
        const wallet = await Wallet.findById(req.body.wallet);
        const defaultDwollaBankAcc = wallet?.defaultDwollaBankAccount
        const reqBody = req.body

        const dwollaBankAcc = new DwollaBankAccount({
            ...reqBody,
            status: resFundSrcs.body.status,
            bankAccountType: resFundSrcs.body.bankAccountType,
            bankName: resFundSrcs.body.bankName,
            fingerprint: resFundSrcs.body.fingerprint,
            AddedAt: resFundSrcs.body.created,
            name: resFundSrcs.body.name,
        });

        await dwollaBankAcc.save()

        console.log(dwollaBankAcc)

        if (!defaultDwollaBankAcc) {
            wallet.defaultDwollaBankAccount = dwollaBankAcc._id
            wallet.save();
        }
        res.json({
            dwollaBankAcc,
            status: 200,
        })

    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        })
    }

}




const addReceiveOnlyBankAccount = async (req, res) => {
    try {
        const dwollaCustomerId = req.body.dwollaCustomerId
        const dwollaCustomer = await DwollaCustomer.findById(dwollaCustomerId)
        const dwollaPath = dwollaCustomer.dwollaPath
        const routingNumber = req.body.routingNumber
        const accountNumber = req.body.accountNumber
        const bankAccountType = req.body.bankAccountType
        const bankName = req.body.bankName
        const walletId = req.body.walletId

        const requestBody = {
            routingNumber: routingNumber,
            accountNumber: accountNumber,
            bankAccountType: bankAccountType,
            name: bankName,
        };

        await dwolla.post(`${dwollaPath}/funding-sources`, requestBody)
            .then(async (dwollaRes) => {

                let url = dwollaRes.headers.get("location");
                var num = url.lastIndexOf('/');
                var result = url.substring(num + 1);

                if (dwollaRes?.status === 201 || dwollaRes?.status === 200) {

                    const resFundSrcs = await dwolla.get(`funding-sources/${result}`)

                    const dwollaBankAcc = new DwollaBankAccount({
                        wallet: walletId,
                        url: result,
                        dwollaCustomer: dwollaCustomerId,
                        status: resFundSrcs.body.status,
                        bankAccountType: resFundSrcs.body.bankAccountType,
                        bankName: resFundSrcs.body.bankName,
                        fingerprint: resFundSrcs.body.fingerprint,
                        AddedAt: resFundSrcs.body.created,
                        name: resFundSrcs.body.name,
                    });

                    await dwollaBankAcc.save()

                    res.json({
                        data: dwollaBankAcc,
                        status: 200,
                    })

                } else {
                    res.json({
                        status: 401,
                        data: { message: "something went wrong" }
                    })
                }
            })
            .catch((err) => {
                res.json({
                    data: JSON.parse(err.message),
                    status: 400,
                    err
                })
            })
    } catch (err) {
        console.log(err)
        res.json({
            data: null,
            status: 400,
            err
        })
    }
}




const getDwollaBanksAccounts = async (req, res) => {
    try {
        const bankAccounts = await DwollaBankAccount.find({
            wallet: req.body.walletId,
            dwollaCustomer: req.body.dwollaCustomerId,
            deleteStatus: false
        })

        console.log(bankAccounts)

        res.json({
            status: 200,
            data: bankAccounts
        })

    } catch (error) {
        res.json({
            data: null,
            status: 400,
            error
        })
    }

}


const removeDwollaBankAccount = async (req, res) => {
    try {
        const dBankAccId = req.body.bankId;
        const bankUrl = req.body.bankUrl;

        const fundingSourceUrl = `${ENVIRONMENT[env]}/funding-sources/${bankUrl}`;
        const requestBody = {
            removed: true,
        };
        const resData = await dwolla.post(fundingSourceUrl, requestBody);
        if (resData.status === 200) {
            await DwollaBankAccount.findByIdAndUpdate(dBankAccId, { deleteStatus: true }, { new: true },
                async (err, resp) => {
                    if (err) {
                        res.json({
                            status: 400,
                            data: null,
                            err,
                        })
                    } else {
                        console.log(resp)
                        res.json({
                            status: 200,
                            data: {
                                resp,
                                resData
                            },
                        })
                    }
                })
        } else {
            res.json({
                data: null,
                status: 400,
            })
        }
    } catch (error) {
        res.json({
            data: null,
            status: 400,
            error
        })
    }
}

const findAllBankAccountFromOrgAndPersonlhelper = async (userWalletId) => {
    try {
        const dwollaBankAccounts = await DwollaBankAccount.find({
            wallet: userWalletId,
            deleteStatus: false,
        })

        return dwollaBankAccounts;
    } catch (error) {
        console.log(error)
        return null;
    }
}



const findAllPersonlBankAccount = async (req, res) => {
    const userWalletId = req.body.userWalletId
    try {
        const userWallet = await Wallet.findOne({ _id: userWalletId })
            .populate('defaultDwollaBankAccount')

        await findAllBankAccountFromOrgAndPersonlhelper(userWalletId)
            .then((accounts) => {
                res.json({
                    status: 200,
                    data: {
                        accounts,
                        defaultDwollaAcc: userWallet?.defaultDwollaBankAccount || null
                    }
                });
            })
            .catch((err) => {
                res.json({
                    status: 400,
                    data: null,
                    err
                });
            })
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        });
    }

}



const findAllAccessableProjectAndOrgs = async (userProfileId) => {
    try {
        const accessableProjects = []
        const accessableOrgs = []

        const projectTeams = await Team.find({
            participants: { $in: [userProfileId] },
            parentModelName: "Project"
        })
            .select('parent wallet permissions')
            .populate({
                path: 'parent',
                model: 'Project',
                select: { 'displayName': 1 },
            })


        projectTeams.map(team => {
            const perm = team.permissions
            const role = perm.get(userProfileId)
            if (role == 'Admin' || role == 'Owner') {
                accessableProjects.push(team)
            }
        })



        const orgTeams = await Team.find({
            participants: { $in: [userProfileId] },
            parentModelName: 'Organization'
        })
            .select('parent wallet permissions')
            .populate({
                path: 'parent',
                model: 'Organization',
                select: { 'displayName': 1 },
            })

        orgTeams.map(team => {
            const perm = team.permissions
            const role = perm.get(userProfileId)
            if (role == 'Admin' || role == 'Owner') {
                accessableOrgs.push(team)
            }
        })



        return {
            accessableProjects,
            accessableOrgs
        }
    } catch (error) {
        console.log(error)
        return null;
    }
}


const usersAccessableProjectsAndOrgs = async (req, res) => {
    const userProfileId = req.body.userProfileId
    try {
        await findAllAccessableProjectAndOrgs(userProfileId)
            .then((teams) => {
                res.json({
                    status: 200,
                    data: teams
                });
            })
            .catch((err) => {
                res.json({
                    status: 400,
                    data: null,
                    err
                });
            })
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        });
    }

}


const getDwollaBanksAccountsByProjectIds = async (req, res) => {
    try {
        const walletIds = req.body.walletIds;
        const dwollaBankAccounts = await DwollaBankAccount.find({
            wallet: { $in: walletIds },
            deleteStatus: false,
        })

        console.log(dwollaBankAccounts)

        res.json({
            status: 200,
            data: dwollaBankAccounts
        })
    } catch (error) {
        res.json({
            data: null,
            status: 400,
            error
        })
    }

}


const getWalletAndDwollaCustomer = async (req, res) => {
    var walletId = req.body.wallet;
    const type = req.body.type;
    console.log(req.body)
    try {
        const wallet = await Wallet.findById(walletId)
            .populate('dwollaCustomer')
            .populate('parent')

        if (wallet?.dwollaCustomer) {
            console.log("i'm here")
            res.json({
                status: 200,
                data: wallet
            })
        } else if (type !== "Pal") {
            console.log("i'm not here")
            const fullName = wallet.parent.displayName
            const fName = fullName.substring(0, fullName.indexOf(' '));
            const lName = fullName.substring(fullName.indexOf(' ') + 1);

            let requestBody = {
                firstName: fName,
                lastName: lName,
                email: wallet.parent.email
            };

            await dwolla.post("customers", requestBody)
                .then(async (dwollaRes) => {

                    const dwollaCustomer = DwollaCustomer({
                        dwollaPath: dwollaRes.headers.get("location"),
                        type: "personal",
                        name: fullName,
                        email: wallet.parent.email,
                        verified: false,
                        wallet: wallet._id
                    })
                    const savedDwollaCus = await dwollaCustomer.save()

                    console.log(savedDwollaCus)

                    await Wallet.findByIdAndUpdate(wallet._id, { dwollaCustomer: savedDwollaCus._id }, { new: true },
                        function (err, resp) {
                            if (err) {
                                console.log(err)
                            } else {

                                const newWallet = {
                                    ...wallet._doc,
                                    dwollaCustomer: savedDwollaCus
                                }

                                res.json({
                                    status: 200,
                                    data: newWallet
                                })
                            }

                        })
                })
                .catch((err) => console.log(err))
        } else {
            res.json({
                status: 200,
                data: null
            })
        }

    } catch (err) {
        console.log("errr")
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}


const createDwollaAccountForPal = async (req, res) => {
    const fName = req.body.fName
    const lName = req.body.lName
    const email = req.body.email
    const walletId = req.body.walletId
    const txId = req.body.txId
    console.log(req.body)
    try {

        let requestBody = {
            firstName: fName,
            lastName: lName,
            email: email
        };

        await dwolla.post("customers", requestBody)
            .then(async (dwollaRes) => {

                const dwollaCustomer = DwollaCustomer({
                    dwollaPath: dwollaRes.headers.get("location"),
                    type: "Pal",
                    name: fName + lName,
                    email: email,
                    verified: false,
                    wallet: walletId,
                    anonymousUser: true,
                    txId: txId,
                })

                const savedDwollaCus = await dwollaCustomer.save()

                console.log(savedDwollaCus)

                await Wallet.findByIdAndUpdate(walletId, { dwollaCustomer: savedDwollaCus._id }, { new: true },
                    function (err, resp) {
                        if (err) {
                            console.log(err)
                        } else {

                            console.log(resp)
                            const newWallet = {
                                ...resp._doc,
                                dwollaCustomer: savedDwollaCus
                            }

                            res.json({
                                status: 200,
                                data: newWallet
                            })
                        }

                    })
            })
            .catch((err) => {
                res.json({
                    status: 400,
                    data: err?.body?._embedded?.errors[0]
                })
            })
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}


const getDwollaCustomerForPalAndAnonUser = async (req, res) => {

    console.log("im anonymousUser for pal")

    const walletId = req.body.walletId
    const txId = req.body.txId
    try {
        const wallet = await Wallet.findById(walletId)

        const dwollaCustomer = await DwollaCustomer.findOne({
            wallet: walletId,
            txId: txId,
            anonymousUser: true
        })

        const newWallet = {
            ...wallet._doc,
            dwollaCustomer: dwollaCustomer
        }

        res.json({
            status: 200,
            data: newWallet
        })


    } catch (err) {

        res.json({
            status: 400,
            data: null,
            err
        })

    }
}













const invoiceSubmitHelper = async (tx) => {
    try {

        const taxAmount = tx?.billList?.tax?.amount
        const taxPercent = tx?.billList?.tax?.percent
        const taxType = tx?.billList?.tax?.type

        const discountAmount = tx?.billList?.discount?.amount
        const discountPercent = tx?.billList?.discount?.percent
        const discountType = tx?.billList?.discount?.type


        const billList = tx?.billList?.items

        let totalTax = 0
        let finalTaxAmount = 0
        let finalDiscountAmount = 0
        let totalAmount = 0
        let linesArr = []

        // for listItems

        console.log("step 1")
        console.log(billList)


        billList.length > 0 && billList.map((item) => {
            const amount = (item?.qTy) * (item?.rate)
            totalAmount = totalAmount + amount

            const chartAcc = item?.chartAccount

            const newObj = {
                chartId: item?.chartAccount?._id,
                chartAccount: { ...chartAcc._doc },
                debit: false,
                amount: amount
            }

            if (item?.tax && tx?.billList?.tax?.enabled && taxType === "%") {
                totalTax = totalTax + amount * (taxPercent / 100)
            }

            linesArr.push(newObj)
        })
        console.log("step 2")
        console.log(linesArr)

        //for tax

        if (tx?.billList?.tax?.enabled) {
            if (taxType === "%") {
                finalTaxAmount = totalTax
            } else if (taxType === "$") {
                finalTaxAmount = taxAmount
            }

            if (finalTaxAmount > 0) {

                const chartAcc = tx?.billList?.taxRelationModel?.chartAccount

                const newObj = {
                    chartId: tx?.billList?.taxRelationModel?.chartAccount?._id,
                    chartAccount: { ...chartAcc._doc },
                    debit: false,
                    amount: finalTaxAmount
                }
                linesArr.push(newObj)
            }
        }
        console.log("step 3")
        console.log(linesArr)
        // for discount

        if (tx?.billList?.discount?.enabled) {

            if (tx?.billList?.orderReverse) {
                const totalAmountWithTax = totalAmount + finalTaxAmount
                if (discountType === "$") {
                    finalDiscountAmount = discountAmount
                } else if (discountType === "%") {
                    finalDiscountAmount = totalAmountWithTax * (discountPercent / 100)
                    console.log("discount " + finalDiscountAmount)
                }
            } else {
                if (discountType === "$") {
                    finalDiscountAmount = discountAmount
                } else if (discountType === "%") {
                    finalDiscountAmount = totalAmount * (discountPercent / 100)
                }
            }

            if (finalDiscountAmount > 0) {

                const chartAcc = tx?.billList?.discountRelationModel?.chartAccount

                const newObj = {
                    chartId: tx?.billList?.discountRelationModel?.chartAccount?._id,
                    chartAccount: { ...chartAcc._doc },
                    debit: false,
                    amount: -1 * finalDiscountAmount
                }
                linesArr.push(newObj)
            }
        }

        console.log("step 4")
        console.log(linesArr)

        const linesGroupById = _.groupBy(linesArr, 'chartId')
        let finalJLine = []

        for (const key in linesGroupById) {
            let totalAmount = 0
            const arr = linesGroupById[key]
            const chartAcc = arr[0].chartAccount

            arr.map((line) => {
                totalAmount += line.amount
            })

            if (totalAmount) {
                const newObj = {
                    chartId: chartAcc._id,
                    chartAccount: chartAcc,
                    amount: totalAmount,
                    debit: false,
                }
                finalJLine.push(newObj)
            }
        }

        console.log("step 5")
        console.log(finalJLine)
        console.log(totalAmount + finalTaxAmount - finalDiscountAmount)

        return {
            lines: finalJLine,
            total: (totalAmount + finalTaxAmount - finalDiscountAmount)
        }

    } catch (err) {
        return null
    }
}


const billSubmitHelper = async (tx) => {
    try {
        const billList = tx?.billList?.items
        let totalAmount = 0
        let linesArr = []

        // for listItems

        billList.length > 0 && billList.map((item) => {
            const amount = (item?.qTy) * (item?.rate)
            totalAmount = totalAmount + amount

            const chartAcc = item?.chartAccount

            const newObj = {
                chartId: item?.chartAccount?._id,
                chartAccount: { ...chartAcc._doc },
                debit: true,
                amount: amount
            }
            linesArr.push(newObj)
        })

        const linesGroupById = _.groupBy(linesArr, 'chartId')
        let finalJLine = []

        for (const key in linesGroupById) {
            let totalAmount = 0
            const arr = linesGroupById[key]
            const chartAcc = arr[0].chartAccount

            arr.map((line) => {
                totalAmount += line.amount
            })

            if (totalAmount) {
                const newObj = {
                    chartId: chartAcc._id,
                    chartAccount: chartAcc,
                    amount: totalAmount,
                    debit: true,
                }
                finalJLine.push(newObj)
            }
        }

        return {
            lines: finalJLine,
            total: totalAmount
        }

    } catch (err) {
        return null
    }
}




const createJournalLineHelperFromDwollaPaymentInProgress = async (txId) => {
    try {

        console.log("in jl " + txId)

        await getTxHelper(txId)
            .then(async (txData) => {
                const walletId = txData.firstPartyWallet

                if ((txData.type === "Bill" || txData.type === "Payment") && txData.processed && txData.status !== "Paid" && txData.status !== "Processing") {

                    console.log("getCall in dwolla jl bill")

                    const lateFeesChartRes = await ChartAccount.findOne({ wallet: walletId, name: 'LateFees', qbType: 'AccountsReceivable' })
                    const lateFeesChart = {
                        ...lateFeesChartRes._doc
                    }

                    const accInProgressRes = await ChartAccount.findOne({ wallet: walletId, name: 'In Progress Payable', qbType: 'AccountsPayable' })
                    const inProgressAccount = {
                        ...accInProgressRes._doc
                    }

                    const getOldJLines = await JournalLine.find({ wallet: walletId, transaction: txData?._id })
                        .populate("account")

                    let oldLineArr = []
                    let oldLinesIdArr = []

                    getOldJLines.length > 0 && getOldJLines.map((line) => {
                        const chartAccDoc = line?.account
                        oldLinesIdArr.push(line._id)
                        const newObj = {
                            chartId: line?.account?._id,
                            chartAccount: { ...chartAccDoc._doc },
                            debit: !line.debit,
                            amount: line?.amount
                        }
                        oldLineArr.push(newObj)
                    })

                    billSubmitHelper(txData)
                        .then(async (data) => {
                            let newLines = []
                            newLines = data?.lines

                            const d2 = moment(txData?.dueDate).format("YYYY-M-D")
                            const d1 = moment().format("YYYY-M-D")
                        
                            if (d2 < d1 && txData?.lateFeeAmount>0) {
                                const lateFeeLine = {
                                    chartId: lateFeesChart._id,
                                    chartAccount: lateFeesChart,
                                    amount: txData?.lateFeeAmount,
                                    debit: true,
                                }
                                newLines.push(lateFeeLine)
                            }

                            const finalAccountPayable = {
                                chartId: inProgressAccount?._id,
                                chartAccount: inProgressAccount,
                                debit: false,
                                amount: data?.total
                            }

                            newLines.push(finalAccountPayable)

                            const totallines = [...oldLineArr, ...newLines]
                            const linesGroupById = _.groupBy(totallines, 'chartId')

                            const finalJLine = []

                            for (const key in linesGroupById) {
                                let debitAmount = 0
                                const arr = linesGroupById[key]
                                const chartAcc = arr[0].chartAccount

                                arr.map((line) => {
                                    if (line?.debit) {
                                        debitAmount = debitAmount + line.amount
                                    } else {
                                        debitAmount = debitAmount - line.amount
                                    }
                                })

                                if (debitAmount) {
                                    const newObj = {
                                        chartAccount: chartAcc,
                                        amount: debitAmount,
                                        debit: true,
                                    }
                                    finalJLine.push(newObj)
                                }
                            }

                            let newJournalLines = []
                            let savedJournalLines = []


                            if (finalJLine.length > 0) {

                                newLines.length > 0 && newLines.map((line) => {
                                    const newObj = JournalLine({
                                        account: line?.chartAccount?._id,
                                        wallet: walletId,
                                        debit: line?.debit,
                                        amount: line?.amount,
                                        transaction: txData?._id,
                                    })
                                    newJournalLines.push(newObj)
                                })

                                savedJournalLines = await JournalLine.insertMany(newJournalLines)

                            }


                            await processJournalLinesForAuto(finalJLine)
                                .then(async (datakk) => {
                                    // delete old journalLines

                                    if (savedJournalLines.length > 0 && finalJLine.length > 0 && datakk.length > 0) {
                                        const deletedData = await JournalLine.deleteMany({ _id: { $in: oldLinesIdArr } })
                                    }

                                    await Transaction.findByIdAndUpdate(txData._id, { processed: true, amountPaid: data?.total, status: 'Processing' }, {
                                        new: true,
                                    })


                                    const resObj = {
                                        data,
                                        datakk,
                                        totallines,
                                        finalJLine,
                                        oldLinesIdArr,
                                        savedJournalLines
                                    }

                                    return resObj;

                                })
                                .catch((err) => {
                                    console.log(err);
                                    return null
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                            return null
                        })


                } else if (txData.type === "Invoice" && txData.processed) {

                    console.log("getCall in dwolla jl invoice")


                    const lateFeesChartRes = await ChartAccount.findOne({ wallet: walletId, name: 'LateFees', qbType: 'AccountsReceivable' })
                    const lateFeesChart = {
                        ...lateFeesChartRes._doc
                    }

                    const accInProgressRes = await ChartAccount.findOne({ wallet: walletId, name: 'In Progress Receivable', qbType: 'AccountsReceivable' })
                    const inProgressAccount = {
                        ...accInProgressRes._doc
                    }

                    const getOldJLines = await JournalLine.find({ wallet: walletId, transaction: txData?._id })
                        .populate("account")

                    let oldLineArr = []
                    let oldLinesIdArr = []

                    getOldJLines.length > 0 && getOldJLines.map((line) => {
                        const chartAccDoc = line?.account
                        oldLinesIdArr.push(line._id)
                        const newObj = {
                            chartId: line?.account?._id,
                            chartAccount: { ...chartAccDoc._doc },
                            debit: !line.debit,
                            amount: line?.amount
                        }
                        oldLineArr.push(newObj)
                    })

                    invoiceSubmitHelper(txData)
                        .then(async (data) => {
                            let newLines = []
                            newLines = data?.lines

                            const d2 = moment(txData?.dueDate).format("YYYY-M-D")
                            const d1 = moment().format("YYYY-M-D")
                        
                            if (d2 < d1 && txData?.lateFeeAmount>0) {
                                const lateFeeLine = {
                                    chartId: lateFeesChart._id,
                                    chartAccount: lateFeesChart,
                                    amount: txData?.lateFeeAmount,
                                    debit: true,
                                }
                                newLines.push(lateFeeLine)
                            }

                            console.log(newLines)

                            const finalReceivableAcc = {
                                chartId: inProgressAccount?._id,
                                chartAccount: inProgressAccount,
                                debit: true,
                                amount: data?.total
                            }
                            newLines.push(finalReceivableAcc)

                            const totallines = [...oldLineArr, ...newLines]
                            const linesGroupById = _.groupBy(totallines, 'chartId')

                            const finalJLine = []

                            for (const key in linesGroupById) {
                                let debitAmount = 0
                                const arr = linesGroupById[key]
                                const chartAcc = arr[0].chartAccount

                                arr.map((line) => {
                                    if (line?.debit) {
                                        debitAmount = debitAmount + line.amount
                                    } else {
                                        debitAmount = debitAmount - line.amount
                                    }
                                })

                                if (debitAmount) {
                                    const newObj = {
                                        chartAccount: chartAcc,
                                        amount: debitAmount,
                                        debit: true,

                                    }
                                    finalJLine.push(newObj)
                                }
                            }

                            let newJournalLines = []
                            let savedJournalLines = []


                            if (finalJLine.length > 0) {

                                newLines.length > 0 && newLines.map((line) => {
                                    const newObj = JournalLine({
                                        account: line?.chartAccount?._id,
                                        wallet: walletId,
                                        debit: line?.debit,
                                        amount: line?.amount,
                                        transaction: txData?._id,
                                    })
                                    newJournalLines.push(newObj)
                                })

                                savedJournalLines = await JournalLine.insertMany(newJournalLines)

                            }

                            await processJournalLinesForAuto(finalJLine)
                                .then(async (datakk) => {
                                    // delete old journalLines

                                    if (savedJournalLines.length > 0 && finalJLine.length > 0 && datakk.length > 0) {
                                        const deletedData = await JournalLine.deleteMany({ _id: { $in: oldLinesIdArr } })
                                    }

                                    await Transaction.findByIdAndUpdate(txData._id, { processed: true, amountPaid: data?.total, status: 'Processing' }, {
                                        new: true,
                                    })


                                    const resObj = {
                                        data,
                                        datakk,
                                        totallines,
                                        finalJLine,
                                        oldLinesIdArr,
                                        savedJournalLines
                                    }

                                    console.log("resObj123")
                                    console.log(resObj)
                                    console.log("resObj321")

                                    return resObj;


                                })
                                .catch((err) => {
                                    console.log(err);
                                    return null
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                            return null
                        })

                }
            })
            .catch((err) => {
                return null;
                console.log(err)
            })
    } catch (err) {
        return null;
        console.log(err)
    }
}














const ACHPayment = async (req, res) => {
    const amount = req.body.amount
    const receiverDwollaUrl = req.body.receiverUrl
    const senderDwollaUrl = req.body.senderUrl
    const tx = req.body.tx

    let am = amount
    const d2 = moment(tx?.dueDate).format("YYYY-M-D")
    const d1 = moment().format("YYYY-M-D")

    if (d2 > d1) {
        am = tx?.finalAmount || 0
    } else {
        am = tx?.finalAmount || 0 + tx?.lateFeeAmount
    }


    var requestBody = {
        _links: {
            source: {
                href: `${ENVIRONMENT[env]}/funding-sources/${senderDwollaUrl}`
            },
            destination: {
                href: `${ENVIRONMENT[env]}/funding-sources/${receiverDwollaUrl}`
            },
        },
        amount: {
            currency: "USD",
            value: am,
        },
    };

    console.log(requestBody)

    await dwolla.post("transfers", requestBody)
        .then(async (dwollaRes) => {
            const strRemove = `${ENVIRONMENT[env]}/transfers/`
            const transactionId = dwollaRes.headers.get("location").replace(strRemove, "")
            console.log(transactionId)

            createJournalLineHelperFromDwollaPaymentInProgress(tx._id)

            res.json({
                status: 200,
                data: transactionId
            });

        })
        .catch((err) => {

            console.log(err)

            res.json({
                status: err.status,
                data: err?.body?._embedded?.errors[0],
                err
            })
        })
}


const getDwollaTransaction = async (req, res) => {
    await dwolla.get(`${ENVIRONMENT[env]}/transfers/${req.body.dwollaTxId}`)
        .then((data) => {

            console.log(data)

            res.json({
                status: 200,
                data:
                {
                    body: data.body,
                    status: data.status
                }
            });
        })
        .catch((err) => {
            res.json({
                status: 400,
                data: err
            });
        })
}

const getDwollaAccountByUrl = async (req, res) => {
    try {
        const url = req.body.url;
        const dwollaBankAccount = await DwollaBankAccount.findOne({ url: url })

        res.json({
            status: 200,
            data: dwollaBankAccount,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        });
    }
}





module.exports = {
    createDwollaBankAccount,
    getDwollaBanksAccounts,
    removeDwollaBankAccount,
    findAllPersonlBankAccount,
    ACHPayment,
    getDwollaTransaction,
    usersAccessableProjectsAndOrgs,
    getDwollaBanksAccountsByProjectIds,
    getWalletAndDwollaCustomer,
    createDwollaAccountForPal,
    getDwollaCustomerForPalAndAnonUser,
    getDwollaAccountByUrl,
    addReceiveOnlyBankAccount
}