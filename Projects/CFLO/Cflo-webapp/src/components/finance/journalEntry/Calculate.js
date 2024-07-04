export const processJournalEntry = (journalEntry) => {
    const jLines = journalEntry?.entries
    let debitLine = 0
    let creditLine = 0
    let debitAmount = 0
    let creditAmount = 0

    jLines.map((line) => {
        if (line?.debit) {
            debitLine++;
            debitAmount += line.amount
        } else {
            creditLine++;
            creditAmount += line.amount
        }
    })

    return {
        debitLine,
        creditLine,
        debitAmount,
        creditAmount
    }
};


export const getJournalEntryCreditLine = (jLines) => {
    let creditLine = 0
    jLines.map((line) => {
        if (!line?.debit) {
            creditLine++;
        } 
    })
    return creditLine
};
export const getJournalEntryCreditAmount = (jLines) => {
    let creditAmount = 0
    jLines.map((line) => {
        if (!line?.debit) {
            creditAmount += line.amount;
        } 
    })
    return creditAmount
};
export const getJournalEntryDebitLine = (jLines) => {
    let debitLine = 0
    jLines.map((line) => {
        if (line?.debit) {
            debitLine++;
        } 
    })
    return debitLine
};
export const getJournalEntryDebitAmount = (jLines) => {
    let debitAmount = 0;
    jLines.map((line) => {
        if (line?.debit) {
            debitAmount += line.amount;
        } 
    })
    return debitAmount
};





