const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const purchaseCriteriaSchema = new Schema({

    purchasePolicy: {
        type: Schema.Types.ObjectId,
        Ref: "PurchasePolicy",
    },

    type: {
        type: String
    },

    //purchasePrice
    criteriaOnPurchasePriceBool: {
        type: Boolean,
        default: false,
    },
    purchasePriceLimit: {
        type: Number,
        default: 0,
    },

    //Total Cash Needed
    criteriaOnTotalCashNeededBool: {
        type: Boolean,
        default: false,
    },
    TotalCashNeededLimit: {
        type: Number,
        default: 50000,
    },

    //Total Cash Invested 
    criteriaOnTotalCashInvestedBool: {
        type: Boolean,
        default: false,
    },
    TotalCashInvestedLimit: {
        type: Number,
        default: 50000,
    },

    //70Rule
    criteriaOn70RuleBool: {
        type: Boolean,
        default: false,
    },
    rule70Limit: {
        type: Number,
        default: 70,
    },

    //PricePerSqFt
    criteriaOnPricePerSqFtBool: {
        type: Boolean,
        default: false,
    },
    pricePerSqFtLimit: {
        type: Number,
        default: 0,
    },

    //ARVPerSqFt
    criteriaOnARVPerSqFtBool: {
        type: Boolean,
        default: false,
    },
    aRVPerSqFtLimit: {
        type: Number,
        default: 0,
    },

    //1%Rule
    criteriaOn1RuleBool: {
        type: Boolean,
        default: false,
    },

    //2%Rule
    criteriaOn2RuleBool: {
        type: Boolean,
        default: false,
    },

    //50%Rule
    criteriaOn50RuleBool: {
        type: Boolean,
        default: false,
    },

    //cash flow
    criteriaOnCashFlowBool: {
        type: Boolean,
        default: false,
    },

    cashFlowLimit: {
        type: Number,
        default: 100,
    },

    //Cap Rate Purchase Price
    criteriaOnCapRatePPBool: {
        type: Boolean,
        default: false,
    },
    capRatePPLimit: {
        type: Number,
        default: 0,
    },

    //Cash on Cash Return
    criteriaOnCOCBool: {
        type: Boolean,
        default: false,
    },
    cOCLimit: {
        type: Number,
        default: 0,
    },

    //Return on Equity
    criteriaOnROEBool: {
        type: Boolean,
        default: false,
    },
    rOELimit: {
        type: Number,
        default: 0,
    },

    //Return on Investment
    criteriaOnROIBool: {
        type: Boolean,
        default: false,
    },
    rOILimit: {
        type: Number,
        default: 30,
    },

    //Internal Rate of Return
    criteriaOnIRRBool: {
        type: Boolean,
        default: false,
    },
    iRRLimit: {
        type: Number,
        default: 0,
    },

    //Rent to Value
    criteriaOnRentToValueBool: {
        type: Boolean,
        default: false,
    },
    rentToValueLimit: {
        type: Number,
        default: 0,
    },

    //Gross Rent Multiple
    criteriaOnGRMBool: {
        type: Boolean,
        default: false,
    },
    gRMLimit: {
        type: Number,
        default: 0,
    },

    //Equity Multiple
    criteriaOnEquityMultipleBool: {
        type: Boolean,
        default: false,
    },
    equityMultipleLimit: {
        type: Number,
        default: 0,
    },

    //Break Even Ratio
    criteriaOnBreakEvenRatioBool: {
        type: Boolean,
        default: false,
    },
    breakEvenRatioLimit: {
        type: Number,
        default: 0,
    },

    //Loan to Cost Ratio
    criteriaOnLoanToCostRatioBool: {
        type: Boolean,
        default: false,
    },
    loanToCostRatioLimit: {
        type: Number,
        default: 0,
    },

    //Loan to Value Ratio
    criteriaOnLoanToValueRatioBool: {
        type: Boolean,
        default: false,
    },
    loanToValueRatioLimit: {
        type: Number,
        default: 0,
    },

    //Debt Coverage Ratio
    criteriaOnDebtCoverageRatioBool: {
        type: Boolean,
        default: false,
    },
    debtCoverageRatioLimit: {
        type: Number,
        default: 0,
    },

    //Debt Yield
    criteriaOnDebtYieldBool: {
        type: Boolean,
        default: false,
    },
    debtYieldLimit: {
        type: Number,
        default: 0,
    },

    //Annualized ROI
    criteriaAnnualizedROIBool: {
        type: Boolean,
        default: false,
    },
    annualizedROILimit: {
        type: Number,
        default: 0,
    }
});

const PurchaseCriteria = model("PurchaseCriteria", purchaseCriteriaSchema);

module.exports = PurchaseCriteria;
