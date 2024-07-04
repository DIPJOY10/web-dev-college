const JournalRule = require("../../models/journal.rule")
const JournalStep = require("../../models/journal.step")
const BillList = require("../../models/wallet.bill.list.model")
const Transaction = require("../../models/wallet.transaction.model")
const { processJournalLines } = require("./journal.entry.controller")



const processJournalStep = async ({txId, nextStep=true })=>{
    /**
     * takes in txId, 
     * ruleId and index to get the step
     * nextStep = move to next step execution of transaction
     */


    const tx = await Transaction.findById(txId)
        .populate('billList')
        .populate({
            path: 'rule', populate:{
                path:'steps'
            }
        })

    const rule = tx?.rule;
    const amount = tx?.amount;

    const step = rule.steps[index]

    var journalLines = []

    if(step.billListEnabled){
        tx.billList.map(item=>{
            // create journal line 
            // push it in array
        })
        const discount = tx.discount;
        const tax = tx.tax;
        // create discount and tax journal lines 

        if(step.billListDebit){
            // insert journalLines step.credits with amount  
        }else{
        
            // insert journalLines step.debits with amount

        }
    }else{
        // insert  journalLines step.debits with amount
        // insert  journalLines step.credits with amount
    }

    // insert


    await processJournalLines(journalLines)

    // if nextStep is true then increase index in tx (nextStep will be false when partially paid)
    

}


const createJournalStep = async (req, res)=>{
    try {
        let event = new JounalStep(req.body);
        await event.save();

        res.status(200).json({
            data: {
                event,
                parent,
            },
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
}