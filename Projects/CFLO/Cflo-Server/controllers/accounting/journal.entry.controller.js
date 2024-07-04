const async = require('async');
const Wallet = require('../../models/wallet.model')
const Transaction = require('../../models/wallet.transaction.model')

const JournalEntry = require('../../models/wallet.journal.entry.model')
const ChartAccount = require('../../models/wallet.chart.account.model')
const _ = require('lodash');
const JournalLine = require('../../models/wallet.journal.line.model');
const { createInvoiceDefaultRule } = require('./invoice');
const { createJournalLines } = require('./journal.line.controller');


const getDefaultRule = async (wallet, type) => {
    const rules = await JournalRule.find({ wallet, type })
    return rules[0]
}

const findOrCreateRule = async tx => {

    const txRule = tx.firstWalletJournalRule
    const walletId = tx.firstPartyWallet;
    const type = tx.type

    if (walletId) {

        if (txRule) {
            return await JournalRule.findById(txRule)
        } else {

            const oldRule = await getDefaultRule(walletId, type)

            if (oldRule) {
                return oldRule
            } else {
                switch (type) {
                    case 'Invoice':
                        return await createInvoiceDefaultRule(tx.firstPartyWallet)
                        break;
                }
            }
        }
    } else {
        return null
    }


};


const processJournalLines = async (lines) => {

    const accountIds = lines.map(entry => entry.account)

    const accts = await ChartAccount.find({ _id: { $in: accountIds } })

    let acctDict = {}
    accts.map(acct => {
        let acctId = acct._id;
        acctDict[acctId] = acct
    })

    return new Promise((resolve, reject) => {

        async.map(lines, function (entry, callback) {

            var amount = entry.amount
            var debit = entry.debit;
            const acctId = entry.account
            let chartAccount = acctDict[acctId]

            if (chartAccount.debit) {
                chartAccount.balance = chartAccount.balance + amount * (debit ? 1 : -1)
            } else {
                chartAccount.balance = chartAccount.balance - amount * (debit ? 1 : -1)
            }

            ChartAccount.findByIdAndUpdate(acctId, {
                _id: acctId,
                balance: chartAccount.balance
            }, { new: true },
                function (err, resp) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, resp)

                    }
                })
        }, function (err, results) {
            if (err) {
                reject(err)

            } else {
                resolve(results)
            }
        })
    })
}


const processJournalLinesWithDeleteMany = async (lines) => {
    try {
        let accountIds = []
        lines.map((line) => {
            accountIds.push(line?.account?._id)
        })

        console.log("ids")
        console.log(accountIds)

        const accts = await ChartAccount.find({ _id: { $in: accountIds } })

        console.log("accts")
        console.log(accts)

        let acctDict = {}
        let chartAccountArr = []
        accts.map(acct => {
            let acctId = acct._id;
            acctDict[acctId] = acct
        })

        console.log("acctDict")
        console.log(acctDict)

        lines.map((line) => {
            const amount = line.amount
            const debit = line.debit;
            const acctId = line.account._id
            const chartAccount = acctDict[acctId]
            console.log(chartAccount)
            let currentAmount
            if (chartAccount.debit) {
                currentAmount = chartAccount.balance + amount * (debit ? 1 : -1)
            } else {
                currentAmount = chartAccount.balance - amount * (debit ? 1 : -1)
            }
            const newChartAcc = new ChartAccount({
                ...chartAccount._doc,
                balance: currentAmount
            });
            chartAccountArr.push(newChartAcc)
        })

        console.log("ids")
        console.log(accountIds)
        console.log("chartAccountArr")
        console.log(chartAccountArr)

        const deletedData = await ChartAccount.deleteMany({ _id: { $in: accountIds } })
        console.log("Delete template")
        console.log(deletedData)

        const createdChartAccounts = await ChartAccount.insertMany(chartAccountArr)
        console.log(createdChartAccounts);
        return createdChartAccounts
    } catch (err) {
        return err
    }
}

const deleteJournalLines = async (lines) => {

    const accountIds = lines.map(entry => entry.account)
    const lineIds = lines.map(entry => entry._id)

    const accts = await ChartAccount.find({ _id: { $in: accountIds } })

    await JournalLine.updateMany({ $in: lineIds }, { $set: { deleted: true } })

    let acctDict = {}
    accts.map(acct => {
        let acctId = acct._id;
        acctDict[acctId] = acct
    })

    return new Promise((resolve, reject) => {

        async.map(lines, function (entry, callback) {

            var amount = entry.amount
            var debit = entry.debit;
            const acctId = entry.account
            let chartAccount = acctDict[acctId]

            if (chartAccount.debit) {
                chartAccount.balance = chartAccount.balance - amount * (debit ? 1 : -1)
            } else {
                chartAccount.balance = chartAccount.balance + amount * (debit ? 1 : -1)
            }

            ChartAccount.findByIdAndUpdate(acctId, {
                _id: acctId,
                balance: chartAccount.balance
            }, { new: true },
                function (err, resp) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, resp)

                    }
                })

        }, function (err, results) {
            if (err) {
                reject(err)

            } else {
                resolve(results)
            }

        })

    })

}

const createJournalEntry = async (req, res) => {
    const walletId = req.body.walletId
    const user = req.body.user

    let wallet = await Wallet.findById(walletId)
        .populate({
            path: 'parent',
            populate: {
                path: 'parent',
                select: 'profile'
            }
        })

    const defaultCount = wallet?.journalCounter || 1000
    const journalEntryNo = defaultCount + 1
    wallet.journalCounter = journalEntryNo;
    await wallet.save()

    const newJournalEntryObj = new JournalEntry({
        journalEntryNo: wallet?.journalCounter,
        wallet: walletId,
        profile: wallet?.parent?.parent?.profile,
        user: user,
        manual: true,
    })

    const savedJournal = await newJournalEntryObj.save();
    if (savedJournal) {
        let journalLineArr = []
        const journalLine1 = JournalLine({
            wallet: walletId,
            journalEntry: savedJournal?._id
        })
        const journalLine2 = JournalLine({
            wallet: walletId,
            journalEntry: savedJournal?._id
        })
        journalLineArr.push(journalLine1)
        journalLineArr.push(journalLine2)

        await createJournalLines(journalLineArr)
            .then((lines) => {
                if (lines?.length > 0) {
                    const journalEntryArr = [lines[0]?._id, lines[1]?._id]
                    savedJournal.entries = journalEntryArr
                    savedJournal.save();
                    res.json({
                        status: 200,
                        data: {
                            lines,
                            savedJournal
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                res.json({
                    status: 400,
                    data: null,
                    err
                })
            })
    }
}

const getJournalWithLines = async (req, res) => {
    const journalId = req.body.journalId
    try {
        const journalEntry = await JournalEntry.findById(journalId)
            .populate({
                path: 'entries',
                populate: {
                    path: 'account',
                }
            })

        res.json({
            status: 200,
            data: journalEntry
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}

const updateJournalEntry = async (req, res) => {
    const journalEntryId = req.body._id
    const journalEntryObj = req.body
    const editCounter = req.body.editCounter
    const walletId = req.body.walletId
    const defaultCounter = req.body.defaultCounter
    try {
        if (editCounter && walletId && defaultCounter) {
            await Wallet.findByIdAndUpdate(walletId, { journalCounter: defaultCounter }, { new: true },
                function (err, updatedWallet) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(updatedWallet)
                    }
                })
        }
        await JournalEntry.findByIdAndUpdate(journalEntryId, journalEntryObj, { new: true },
            function (err, updatedJEntry) {
                if (err) {
                    res.json({
                        status: 400,
                        data: null,
                        err
                    })
                } else {
                    res.json({
                        status: 200,
                        data: updatedJEntry
                    })
                }
            })
    } catch (err) {
        console.log(err)
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}

const getAllJournalEntryNumbers = async (req, res) => {
    const walletId = req.body.walletId

    try {
        const allJournalEntryNumbers = await JournalEntry.find({ wallet: walletId })
            .select('journalEntryNo')

        res.json({
            status: 200,
            data: allJournalEntryNumbers
        })

    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })

    }
}

const getJournalEntrys = async (req, res) => {
    const walletId = req.body.walletId
    try {
        const allJournalEntrys = await JournalEntry.find({ wallet: walletId, manual: true, deleted: false })
            .populate({
                path: 'user',
                populate: {
                    path: 'displayPicture',
                    model: 'File',
                    select: 'url thumbUrl'
                }
            })
            .populate('entries')
        res.json({
            status: 200,
            data: allJournalEntrys
        })
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}




const submitJournalEntry = async (req, res) => {
    const lines = req.body.lines
    const journalEntryId = req.body.journalEntryId

    await processJournalLinesWithDeleteMany(lines)
        .then(async (accounts) => {
            console.log("accounts")
            console.log(accounts)
            await JournalEntry.findByIdAndUpdate(journalEntryId, { processed: true }, { new: true },
                function (err, updatedJEntry) {
                    if (err) {
                        res.json({
                            status: 400,
                            data: null,
                            err
                        })
                    } else {
                        res.json({
                            status: 200,
                            data: updatedJEntry
                        })
                    }
                })
        })
        .catch((err) => {
            res.json({
                status: 400,
                data: null,
                err
            })
        })
}


const deleteJournalEntry = async (req, res) => {
    
    const journalEntryId = req.body.jEId

    try {

        await JournalEntry.findByIdAndUpdate(journalEntryId, { deleted : true }, { new: true },
            function (err, updatedJEntry) {
                if (err) {
                    res.json({
                        status: 400,
                        data: null,
                        err
                    })
                } else {
                    res.json({
                        status: 200,
                        data: updatedJEntry
                    })
                }
            })
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}


module.exports = {
    findOrCreateRule,
    processJournalLines,
    processJournalLinesWithDeleteMany,
    deleteJournalLines,
    createJournalEntry,
    getJournalWithLines,
    updateJournalEntry,
    getAllJournalEntryNumbers,
    submitJournalEntry,
    getJournalEntrys,
    deleteJournalEntry
}

