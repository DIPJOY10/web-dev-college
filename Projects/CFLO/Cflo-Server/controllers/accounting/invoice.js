const JournalRule = require("../../models/wallet.journal.rule.model");
const ChartAccount = require("../../models/wallet.chart.account.model");
const JournalLine = require("../../models/wallet.journal.line.model");
const Transaction = require("../../models/wallet.transaction.model");
const _ = require('lodash');
const {
    processJournalLines, deleteJournalLines, findOrCreateRule
} = require('./journal.entry.controller')



async function createInvoiceDefaultRule(wallet_id) {
    const chart_accounts = await ChartAccount.find({wallet: wallet_id});
    let required_accounts = {};
    for (let chart_account of chart_accounts) {
        if (["Account Receivable (A/R)", "Cash and Cash Equivalent", "Rental Income"].includes(chart_account.name)) {
            required_accounts[chart_account.name] = chart_account;
        }
    }
    let steps = [
        {
            account: required_accounts["Rental Income"]._id,
            accountDebit: false,
            accountNext: required_accounts["Account Receivable (A/R)"]._id,
        },
        {
            account: required_accounts["Account Receivable (A/R)"]._id,
            accountDebit: false,
            accountNext: required_accounts["Cash and Cash Equivalent"]._id,
        },
    ];

    const journal_rule = await JournalRule.create({
        type: "Invoice",
        useAsDefault: true,
        wallet: wallet_id,
        steps: steps,
        name: "Test Rule",
        description: "This is a test Rule",
    });

    return journal_rule;
}




const createJournalLines = async (rule, idx, tx) => {
    try {
        const entry = rule.steps[idx];
        const line1 = {
            account: entry.account,
            debit: entry.accountDebit,
            transaction: tx._id,
            wallet: rule.wallet,
            amount: tx.amount,
        };
        const line2 = {
            account: entry.accountNext,
            debit: !entry.accountDebit,
            transaction: tx._id,
            wallet: rule.wallet,
            amount: tx.amount,
        };
        await JournalLine.insertMany([line1, line2]);
        return [line1, line2];
    } catch (err) {
        throw new Error(err.message);
    }
};



async function onInvoiceSave(tx) {


    const rule = await findOrCreateRule(tx);


    try {
        const oldLines = await JournalLine.find({transaction: tx._id, deleted: false});  
        const newLines = await createJournalLines(rule, 0, tx); 
        
        await processJournalLines(newLines)

        if(oldLines.length == 2){
            await deleteJournalLines(oldLines)
        }
   
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    onInvoiceSave,
    createInvoiceDefaultRule

}