const async = require("async");
const Wallet = require("../../models/wallet.model");
const ChartAccount = require("../../models/wallet.chart.account.model");
const {
    classifications,
    subTypes
} = require("../../helpers/account");
const _ = require("lodash");

const basicAccountData = [

    {
        name: 'Account Receivable (A/R)',
        topLevel: 'Asset',
        classification: 'Account Receivable (A/R)',
        qbType: 'AccountsReceivable',
        qbName: 'Accounts Receivable',
        debit: true
    },
    {
        name: 'Cash and Cash Equivalent',
        topLevel: 'Asset',
        classification: 'Bank',
        qbType: 'CashOnHand',
        qbName: 'Cash On Hand',
        debit: true
    },
    {
        name: 'Buildings',
        topLevel: 'Asset',
        classification: 'Fixed Assets',
        qbType: 'Buildings',
        qbName: 'Buildings',
        debit: true
    },
    {
        name: 'Accounts Payables (A/P)',
        topLevel: 'Liability',
        classification: 'Accounts Payables (A/P)',
        qbType: 'AccountsPayable',
        qbName: 'Accounts Payable',
        debit: false
    },
    {
        name: 'Credit Card',
        topLevel: 'Liability',
        classification: 'Credit Card',
        qbType: 'CreditCard',
        qbName: 'Credit Card',
        debit: false
    },
    {
        name: 'Loan Payable ',
        topLevel: 'Liability',
        classification: 'Other Current Liabilities',
        qbType: 'LoanPayable',
        qbName: 'Loan Payable',
        debit: false
    },
    {
        name: 'Tax Payable',
        topLevel: 'Liability',
        classification: 'Other Current Liabilities',
        qbType: 'StateLocalIncomeTaxPayable',
        qbName: 'State Local Income Tax Payable',
        debit: false
    },
    {
        name: 'Opening Balance Equity',
        topLevel: 'Equity',
        classification: 'Equity',
        qbType: 'OpeningBalanceEquity',
        qbName: 'Opening Balance Equity',
        debit: false
    },
    {
        name: "Owner's Equity",
        topLevel: 'Equity',
        classification: 'Equity',
        qbType: 'OwnersEquity',
        qbName: 'Owners Equity',
        debit: false
    },
    {
        name: 'Retained Earnings',
        topLevel: 'Equity',
        classification: 'Equity',
        qbType: 'RetainedEarnings',
        qbName: 'Retained Earnings',
        debit: false
    },
    {
        name: 'Contractor/Service Provider',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'CostOfLabor',
        qbName: 'Cost Of Labor',
        debit: true
    },
    {
        name: 'Legal & Professional Fees',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'LegalProfessionalFees',
        qbName: 'Legal Professional Fees',
        debit: true
    },
    {
        name: 'Interest Paid',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'InterestPaid',
        qbName: 'Interest Paid',
        debit: true
    },

    {
        name: 'Insurance',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'Insurance',
        qbName: 'Insurance',
        debit: true
    },
    {
        name: 'Payroll Expenses',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'PayrollExpenses',
        qbName: 'Payroll Expenses',
        debit: true
    },
    {
        name: 'Advertising',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'AdvertisingPromotional',
        qbName: 'Advertising Promotional',
        debit: true
    },

    {
        name: 'Auto & Travel',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'Travel',
        qbName: 'Travel',
        debit: true
    },

    {
        name: 'Cleaning & Maintenance',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'RepairMaintenance',
        qbName: 'Repair Maintenance',
        debit: true
    },

    {
        name: 'Repair',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'RepairMaintenance',
        qbName: 'Repair Maintenance',
        debit: true
    },

    {
        name: 'Supplies',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'SuppliesMaterials',
        qbName: 'Supplies Materials',
        debit: true
    },

    {
        name: 'Tax',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'RepairMaintenance',
        qbName: 'Repair Maintenance',
        debit: true
    },

    {
        name: 'Commissions',
        topLevel: 'Expense',
        classification: 'Cost of Goods Sold',
        qbType: 'OtherCostsOfServices',
        qbName: 'Other Costs Of Services',
        debit: true
    },

    {
        name: 'Depreciation',
        topLevel: 'Expense',
        classification: 'Other Expense',
        qbType: 'Depreciation',
        qbName: 'Depreciation',
        debit: true
    },

    {
        name: 'Utilities',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'Utilities',
        qbName: 'Utilities',
        debit: true
    },

    {
        name: 'Other Expense',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'OtherBusinessExpenses',
        qbName: 'Other Business Expenses',
        debit: true
    },
    {
        name: 'Rental Income',
        topLevel: 'Revenue',
        classification: 'Income',
        qbType: 'ServiceFeeIncome',
        qbName: 'Service Fee Income',
        debit: false
    },
    {
        name: 'Dividends Distributed',
        topLevel: 'Equity',
        classification: 'Equity',
        qbType: 'PartnerDistributions',
        qbName: 'Partner Distributions',
        debit: true
    },
    {
        name: 'Interest Earned',
        topLevel: 'Revenue',
        classification: 'Other Income',
        qbType: 'InterestEarned',
        qbName: 'Interest Earned',
        debit: false
    },
    {
        name: 'Tax',
        topLevel: 'Liability',
        classification: 'Other Current Liabilities',
        qbType: 'SaleTaxPayable',
        qbName: 'Sale Tax Payable',
        debit: false,
    },
    {
        name: 'Discount',
        topLevel: 'Revenue',
        classification: 'Income',
        qbType: 'DiscountsRefundsGiven',
        qbName: 'Discounts/Refunds Given',
        debit: false,
    },
    {
        name: 'In Progress Payable',
        topLevel: 'Liability',
        classification: 'Accounts Payables (A/P)',
        qbType: 'AccountsPayable',
        qbName: 'Accounts Payable',
        debit: false,
    },
    {
        name: 'In Progress Receivable',
        topLevel: 'Asset',
        classification: 'Account Receivable (A/R)',
        qbType: 'AccountsReceivable',
        qbName: 'Accounts Receivable',
        debit: true
    },
    {
        name: 'LateFees',
        topLevel: 'Asset',
        classification: 'Account Receivable (A/R)',
        qbType: 'AccountsReceivable',
        qbName: 'Accounts Receivable',
        debit: true
    },
    {
        name: 'oneTimeFeesItem',
        topLevel: 'Revenue',
        classification: 'Income',
        qbType: 'ServiceFeeIncome',
        qbName: 'Service/Fee Income',
        debit: false,
    },
    {
        name: 'collectedSecurityMoney',
        topLevel: 'Liability',
        classification: 'Other Current Liabilities',
        qbType: 'OtherCurrentLiabilities',
        qbName: 'Other Current Liabilities',
        debit: false,
    },
    {
        name: 'Default Income Acc',
        topLevel: 'Revenue',
        classification: 'Income',
        qbType: 'ServiceFeeIncome',
        qbName: 'Service Fee Income',
        debit: false
    },
    {
        name: 'Default Expense Acc',
        topLevel: 'Expense',
        classification: 'Expense',
        qbType: 'OtherBusinessExpenses',
        qbName: 'Other Business Expenses',
        debit: true
    },
]

const getTypes = (req, res) => {
    res.json({
        classifications,
        subTypes,
    });
};

const createChartAccountHelper = async chartAccountBody => {
    var chartAccount = new ChartAccount(chartAccountBody);
    var walletId = chartAccount.wallet;

    var newChartAccount = await chartAccount.save();
    var wallet = await Wallet.findById(walletId);
    wallet.chartOfAccounts = _.concat(wallet.chartOfAccounts, [chartAccount._id]);
    var newWallet = await wallet.save();

    return {
        wallet: newWallet,
        chartAccount: newChartAccount,
    };
};

const create = async (req, res) => {
    try {
        const chartAccName = req.body.name
        const wallet = req.body.wallet
        const balance = req.body.balance

        const OpeningBalChartAccount = await ChartAccount.findOne({ name: "Opening Balance Equity", wallet: wallet })
        const getChartAccount = await ChartAccount.find({ name: chartAccName, wallet: wallet })

        if (getChartAccount.length > 0) {
            res.json({
                status: 401,
                data: "A Chart Account already exists with the same name"
            });
        } else {

            if (balance > 0 || balance < 0) {
                const id = OpeningBalChartAccount._id
                let newBal

                if (req.body.debit) {
                    newBal = parseInt(OpeningBalChartAccount?.balance) + parseInt(balance)
                } else {
                    newBal = parseInt(OpeningBalChartAccount?.balance) - parseInt(balance)
                }

                await ChartAccount.findByIdAndUpdate(id, { balance: newBal })
            }

            const chartAccount = new ChartAccount(req.body);
            await chartAccount.save();

            res.json({
                status: 200,
                data: chartAccount,
            });
        }
    } catch (error) {
        res.json({
            status: 400,
            data: null,
        });
    }



};

const createBasicChartAccts = async walletId => {
    const walletAccts = basicAccountData.map(acct => {
        return {
            ...acct,
            wallet: walletId,
        };
    });

    const accts = await ChartAccount.insertMany(walletAccts);

    return accts;
};

const update = async (req, res) => {
    try {
        const acctObject = req.body;
        const acctId = acctObject._id;
        const chartAccName = req.body.name
        const wallet = req.body.wallet

        console.log(req.body);

        const getChartAccount = await ChartAccount.find({ name: chartAccName, wallet: wallet })
        console.log(getChartAccount.length);

        if (getChartAccount.length >= 1) {
            res.json({
                status: 401,
                data: "A Chart Account already exists with the same name"
            });
        } else {
            await ChartAccount.findByIdAndUpdate(acctId, acctObject, { new: true }, function (err, resp) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        status: 200,
                        data: resp,
                    });
                }
            });
        }
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        });
    }
};





const getAccts = async (req, res) => {
    var walletId = req.body.walletId;

    try {
        const accts = await ChartAccount.find({ wallet: walletId });

        res.json({
            status: 200,
            data: accts,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getAcctsByType = async (req, res) => {
    var walletId = req.body.walletId;
    const type = req.body.type;

    console.log(req.body.type);

    try {
        const accts = await ChartAccount.find(type);
        console.log(accts);
        res.json({
            status: 200,
            data: accts,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

// const getExpenseAccts = async (req, res)=>{
//     var walletId = req.body.walletId;
//     try {
//         const accts = await ChartAccount.find({ wallet: walletId,  topLevel: 'Expense', })

//         res.json({
//             status:200,
//             data:accts
//         })

//     } catch (error) {

//         res.json({
//             status:400,
//             data:null,
//             error
//         })

//     }
// }

module.exports = {
    createBasicChartAccts,
    update,
    createChartAccountHelper,
    create,
    getTypes,
    getAccts,
    getAcctsByType,
};
