const async = require('async');
const _ = require('lodash');
const JournalLine = require('../../models/wallet.journal.line.model');
const JournalEntry = require('../../models/wallet.journal.entry.model')
const mongoose = require("mongoose");
const ChartAccount = require('../../models/wallet.chart.account.model');


const createJournalLines = async (lineArr) => {
    try {
        const journalLines = await JournalLine.insertMany(lineArr)
        return journalLines;
    } catch (err) {
        console.log(err);
        return null
    }
}


const createTwoJournalLines = async (req, res) => {
    const journalId = req.body.journalId
    const walletId = req.body.walletId
    let savedJournal = await JournalEntry.findById(journalId)
    let journalLineArr = []
    const journalLine1 = JournalLine({
        wallet: walletId,
        journalEntry: journalId
    })
    const journalLine2 = JournalLine({
        wallet: walletId,
        journalEntry: journalId
    })
    journalLineArr.push(journalLine1)
    journalLineArr.push(journalLine2)

    await createJournalLines(journalLineArr)
        .then( async (lines) => {
            if (lines?.length > 0) {
                let journalLineArr = savedJournal.entries
                const journalEntryArr = [...journalLineArr, lines[0]?._id, lines[1]?._id]
                savedJournal.entries = journalEntryArr
                await savedJournal.save();
                res.json({
                    status: 200,
                    data: lines
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


const deleteJournalLine = async (req, res) => {
    const journalId = req.body.journalId
    const journalLineId = req.body.journalLineId
    try {
        let savedJournal = await JournalEntry.findById(journalId)
        let entryLinesArr = savedJournal?.entries;
        let jLines = entryLinesArr.filter(line => line.toString() !== journalLineId);

        JournalLine.findByIdAndUpdate(journalLineId, {deleted : true}, { new: true },
            async (err, updatedJLine)=> {
                if (err) {
                    res.json({
                        status: 400,
                        data: null,
                        err
                    })
                } else {
                    console.log(updatedJLine)
                    savedJournal.entries = jLines
                    const updatedEntry = await savedJournal.save()
            
                    res.json({
                        status: 200,
                        data: updatedEntry
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


const updateJournalLine = async (req, res) => {
    const journalLineId = req.body._id
    const journalObj = req.body
    try {
        await JournalLine.findByIdAndUpdate(journalLineId, journalObj, { new: true },
            function(err, updatedJLine) {
                if (err) {
                    res.json({
                        status: 400,
                        data: null,
                        err
                    })
                } else {
                    res.json({
                        status: 200,
                        data: updatedJLine
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



const processJournalLinesForAuto = async (lines) => {
    try {

        console.log("lines123")
        console.log(lines)
        console.log("lines321")

        if(lines.length === 0 ){
            return [];
        }

        let accountIds = []
        let accts = []
        lines.map((line) => {
            accountIds.push(line?.chartAccount?._id)
            accts.push(line?.chartAccount)
        })

        console.log("ids")
        console.log(accountIds)
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
            const acctId = line?.chartAccount?._id
            const chartAccount = acctDict[acctId]

            console.log("in" + chartAccount)

            let currentAmount
            if (chartAccount.debit) {
                currentAmount = chartAccount.balance + amount * (debit ? 1 : -1)
            } else {
                currentAmount = chartAccount.balance - amount * (debit ? 1 : -1)
            }
            const newChartAcc = new ChartAccount({
                ...chartAccount,
                balance: currentAmount
            });
            chartAccountArr.push(newChartAcc)


        })

        const deletedData = await ChartAccount.deleteMany({ _id: { $in: accountIds } })

        const createdChartAccounts = await ChartAccount.insertMany(chartAccountArr)

        return createdChartAccounts
    } catch (err) {
        return err
    }
}





module.exports = {
    createJournalLines,
    createTwoJournalLines,
    deleteJournalLine,
    updateJournalLine,
    processJournalLinesForAuto
}