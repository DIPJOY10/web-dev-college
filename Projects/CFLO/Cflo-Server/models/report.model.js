const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ReportSchema = new Schema({
    reportTitle: {
        type: "String",
        default: "Untilted",
    },
    reportType: {
        type: "String",
        default: "Rental",
    },
    teamId: {
        type: Schema.Types.ObjectId,
        Ref: "Team",
    },
    purchasePrice: {
        type: String,
        default: "",
    },
    ARV: {
        type: String,
        default: "",
    },
    propertyTax: {
        type: String,
        default: "",
    },
    propertyInsurance: {
        type: String,
        default: "",
    },
    refinanceTime: {
        type: String,
        default: "",
    },
    LoanType: {
        type: String,
        default: "",
    },
    refinanceLoanType: {
        type: String,
        default: "",
    },
    refinanceLoanAmount: {
        type: String,
        default: "",
    },
    remainingEquity: {
        type: String,
        default: "",
    },
    isFinancing: {
        type: Boolean,
        default: true,
    },
    DownPayment: {
        type: String,
        default: "",
    },
    InterestRate: {
        type: String,
        default: "",
    },
    refinanceInterestRate: {
        type: String,
        default: "",
    },
    LoanTerm: {
        type: String,
        default: "",
    },
    refinanceLoanTerm: {
        type: String,
        default: "",
    },
    RehabCostPercent: {
        type: String,
        default: "",
    },
    financeMortgageType: {
        type: String,
        default: "",
    },
    Upfront: {
        type: String,
        default: "",
    },
    Recurring: {
        type: String,
        default: "",
    },
    refinanceMortgageType: {
        type: String,
        default: "",
    },
    refinanceUpfront: {
        type: String,
        default: "",
    },
    refinanceRecurring: {
        type: String,
        default: "",
    },
    purchaseTotal: {
        type: String,
        default: "0",
    },
    purchaseCostsItemized: [
        {
            Name: {
                type: String,
                default: "",
            },
            Amount: {
                type: Number,
                default: 0,
            },
            ItemType: {
                type: String,
                default: "",
            },
        },
    ],
    rehabTotal: {
        type: String,
        default: "0",
    },
    rehabCostsItemized: [
        {
            Name: {
                type: String,
                default: "",
            },
            Amount: {
                type: String,
                default: "",
            },
            ItemType: {
                type: String,
                default: "",
            },
        },
    ],
    refinanceCostTotal: {
        type: String,
        default: "0",
    },
    refinanceCostsItemized: [
        {
            Name: {
                type: String,
                default: "",
            },
            Amount: {
                type: String,
                default: "",
            },
            ItemType: {
                type: String,
                default: "",
            },
        },
    ],
    costOverrun: {
        type: String,
        default: "",
    },
    rehabPeriod: {
        type: String,
        default: "",
    },
    rentalPeriod: {
        type: String,
        default: "",
    },
    holdingPeriod: {
        type: String,
        default: "",
    },
    holdingTotal: {
        type: String,
        default: "0",
    },
    holdingCostsItemized: [
        {
            Name: {
                type: String,
                default: "",
            },
            Amount: {
                type: String,
                default: "",
            },
            ItemType: {
                type: String,
                default: "",
            },
        },
    ],
    sellingCostTotal: {
        type: String,
        default: "0",
    },
    sellingCostsItemized: [
        {
            Name: {
                type: String,
                default: "",
            },
            Amount: {
                type: String,
                default: "",
            },
            ItemType: {
                type: String,
                default: "",
            },
        },
    ],
    GrossRent: {
        type: String,
        default: "",
    },
    Period: {
        type: String,
        default: "Per Month",
    },
    Vacancy: {
        type: String,
        default: "",
    },
    otherIncomeTotal: {
        type: String,
        default: "0",
    },
    otherIncomeItemized: [
        {
            Name: {
                type: String,
                default: "",
            },
            Amount: {
                type: String,
                default: "",
            },
            ItemType: {
                type: String,
                default: "",
            },
        },
    ],
    operatingExpenseTotal: {
        type: String,
        default: "0",
    },
    operatingExpenseItemized: [
        {
            Name: {
                type: String,
                default: "",
            },
            Amount: {
                type: String,
                default: "",
            },
            ItemType: {
                type: String,
                default: "",
            },
        },
    ],
    Appreciation: {
        type: String,
        default: "",
    },
    IncomeIncrease: {
        type: String,
        default: "",
    },
    ExpenseIncrease: {
        type: String,
        default: "",
    },
    sellingPrice: {
        type: String,
        default: "",
    },
    SellingCosts: {
        type: String,
        default: "",
    },
    DepreciationPeriod: {
        type: String,
        default: "",
    },
    LandValue: {
        type: String,
        default: "",
    }
});

const Report = model("Report", ReportSchema);

module.exports = Report;