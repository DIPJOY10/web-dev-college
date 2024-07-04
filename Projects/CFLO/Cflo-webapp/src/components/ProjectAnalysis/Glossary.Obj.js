import React from "react";

const color = { color: "#46A8F1" }

let glossaryObjObj = {
    "Loan Payments": {
        title: "Loan Payments",
        desc: "The principal and interest payment required to be paid for loan",
        formula: false
    },
    "Loan Interest": {
        title: "Loan Interest",
        desc: "Total interest payment",
        formula: false
    },
    "Loan Interest": {
        title: "Loan Interest",
        desc: "Total interest payment",
        formula: false
    },
    "Net Operating Income": {
        title: "Net Operating Income",
        desc: "",
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <> <span style={color} >NOI</span> = <span style={color} >Operating income</span> - <span style={color} >operating expenses</span></>
        }]
    },
    "Unlevered Cash Flow": {
        title: "Unlevered Cash Flow",
        desc: "Net amount received from a rental property as income, when no financing is used",
        formula: false
    },
    "Levered Cash Flow": {
        title: "Levered Cash Flow",
        desc: "Net amount received from a rental property as income, when financing is used",
        formula: false
    },
    "Cash Flow": {
        title: "Cash Flow",
        desc: "Net amount received from a rental property as income, with financing, if any.",
        formula: false
    },
    "Depreciation": {
        title: "Depreciation",
        desc: "A type of tax deduction available to real estate investors",
        formula: true,
        formulaHTMLArr: [{
            label: "Yearly",
            type: "division",
            equal: "depreciation",
            topHTML: <> <span style={color} >Purchase price</span> + <span style={color} >Purchase costs</span> + <span style={color} >Rehab costs</span> - <span style={color} >Land Value</span></>,
            bottomHTML: <><span style={color} >Depreciation Period</span></>
        }]
    },
    "Property Value": {
        title: "Property Value",
        desc: "Current market value of the property based on appreciation.",
        formula: false
    },
    "Total Equity": {
        title: "Total Equity",
        desc: "The part of the property's market value owned by you",
        formula: true,
        formulaHTMLArr: [{
            label: "With financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total equity</span> <span style={color} >Market value of the property</span> - <span style={color} >Loan balance</span></>,
        },
        {
            label: "Without financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total equity</span> <span style={color} >Market value of the property</span></>,
        }]
    },
    "Equity": {
        title: "Equity",
        desc: "The part of the property's market value owned by you",
        formula: true,
        formulaHTMLArr: [{
            label: "With financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total equity</span> = <span style={color} >Market value of the property</span> - <span style={color} >Loan balance</span></>,
        },
        {
            label: "Without financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total equity</span> = <span style={color} >Market value of the property</span></>,
        }]
    },
    "Selling Costs": {
        title: "Selling Costs",
        desc: "Selling costs (aka closing costs) are expenses and fees due at the closing of a real estate transaction while selling a property",
        formula: false
    },
    "Total Cash Invested": {
        title: "Total Cash Invested",
        desc: "The total amount of capital that you have invested in a property. Rentals: The total amount of cash required to buy and rehab a property.(same as total cash needed)",
        formula: true,
        formulaHTMLArr: [{
            label: "With financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Cash Needed</span> = <span style={color} >Down payment</span> + <span style={color} >Purchase cost</span> + <span style={color} >Rehab cost (if rehab is not financed)</span> </>,
        },
        {
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Cash Needed</span> = <span style={color} >Down payment</span> + <span style={color} >Purchase cost (if rehab is also financed)</span></>,
        },
        {
            label: "Without financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Cash Needed</span> = <span style={color} >Purchase Price</span> + <span style={color} >Purchase cost</span> + <span style={color} >Rehab cost(total rehab cost or total minus recurring)</span> </>,
        }]
    },
    "Cumulative Cash Flow": {
        title: "Cumulative Cash Flow",
        desc: "Net amount received from a rental property as income",
        formula: false
    },
    "Sale Proceeds": {
        title: "Sale Proceeds",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Sale proceeds</span> = <span style={color} >Equity</span> - <span style={color} >Selling costs</span></>
        }]
    },
    "Gross Rent": {
        title: "Gross Rent",
        desc: "The total rent collected from tenants.",
        formula: false
    },
    "Vacancy Expense": {
        title: "Vacancy Expense",
        desc: "Rent foregone due to vacancy.",
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Vacancy Cost</span> = <span style={color} >Gross Rent</span> * <span style={color} >Vacancy Rate</span></>
        }]
    },
    "Other Income": {
        title: "Other Income",
        desc: "Income from the property other than rent",
        formula: false
    },
    "Operating Income": {
        title: "Operating Income",
        desc: "Total income generated from property minus the vacancy cost.",
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Operating Income</span> = <span style={color} >Gross Rent</span> + <span style={color} >Other Income</span> - <span style={color} >Vacancy expense</span></>
        }]
    },
    "Operating Expenses": {
        title: "Operating Expenses",
        desc: "All the expenses incurred while renting a property, excluding the loan payments.",
        formula: false
    },
    "Rent To Value": {
        title: "Rent To Value",
        desc: "A rate of return of a rental property based on comparing the monthly gross rent to the purchase price or market value.",
        formula: true,
        formulaHTMLArr: [{
            label: "at purchase",
            type: "division",
            equal: "RTV",
            topHTML: <> <span style={color} >Monthly Gross Rent</span></>,
            bottomHTML: <><span style={color} >Purchase Price</span></>
        },
        {
            label: "subsequently",
            type: "division",
            equal: "RTV",
            topHTML: <> <span style={color} >Monthly Gross Rent</span></>,
            bottomHTML: <><span style={color} >Market value</span></>
        }]
    },
    "Gross Rent Multiplier": {
        title: "Gross Rent Multiplier",
        desc: "A rate of return of a rental property based on comparing the purchase price or market value to the yearly gross rent. The gross rent multiplier shows the number of years it will take for the yearly gross rent to add up to the original purchase price.",
        formula: true,
        formulaHTMLArr: [{
            label: "at purchase",
            type: "division",
            equal: "GRM",
            topHTML: <> <span style={color} >Purchase Price</span></>,
            bottomHTML: <><span style={color} >Yearly Gross Rent</span></>
        },
        {
            label: "subsequently",
            type: "division",
            equal: "GRM",
            topHTML: <> <span style={color} >Market value</span></>,
            bottomHTML: <><span style={color} >yearly gross rent</span></>
        }]
    },
    "Equity Multiple": {
        title: "Equity Multiple",
        desc: `A ratio that shows the total rate of return of a rental property based on comparing the total profit
    from your investment to the total invested cash. The equity multiple takes into account the cumulative 
    cash flow, equity accumulation and loan paydown and shows the total cumulative return on your invested capital,
    if you were to sell the property at a given point in time. The equity multiple is the same as the ROI,  except expressed as a ratio.
    `,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "division",
            equal: "EM",
            topHTML: <> <span style={color} >Total equity</span> - <span style={color} >selling cost</span> + <span style={color} >cumulative cash flow</span></>,
            bottomHTML: <><span style={color} >Total invested cash</span></>
        }]
    },
    "Break Even Ratio": {
        title: "Break Even Ratio",
        desc: `A ratio that compares a property's yearly operating expenses and debt service (loan payments) 
    to its yearly gross rent. The break even ratio shows the minimum percentage of occupancy needed to 
    cover all operating expenses and debt service obligations for a rental property.`,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "division",
            equal: "BER",
            topHTML: <> <span style={color} >Yearly operating expense</span> + <span style={color} >Yearly debt service</span></>,
            bottomHTML: <><span style={color} >Yearly Gross Rent</span></>
        }]
    },
    "Debt Coverage Ratio": {
        title: "Debt Coverage Ratio",
        desc: `A ratio that compares a property's yearly NOI to its yearly debt service - the total principal and interest payments on the loan. The debt coverage ratio, sometimes also called the debt service coverage ratio, is often used by lenders to determine loan eligibility. A debt coverage ratio below 1 indicates that there is not enough cash flow to cover the debt service, and may result in a loan denial.`,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "division",
            equal: "DCR",
            topHTML: <> <span style={color} >Yearly NOI</span></>,
            bottomHTML: <><span style={color} >Yearly Debt Service</span></>
        }]
    },
    "Debt Yield": {
        title: "Debt Yield",
        desc: `A ratio that compares a property's yearly NOI to the total loan amount. The debt yield is often used by lenders to determine loan eligibility, as an indicator of leverage and loan risk. A lower debt yield indicates higher leverage and therefore higher risk, while a higher debt yield indicates lower leverage and therefore lower risk.`,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "division",
            equal: "DY",
            topHTML: <> <span style={color} >Yearly NOI</span></>,
            bottomHTML: <><span style={color} >Loan Amount</span></>
        }]
    },
    "Cap Rate (Purchase Price)": {
        title: "Cap Rate (Purchase Price)",
        desc: `The capitalization rate (or cap rate) is the rate of return on a real estate investment property 
    based on the yearly net operating income that the property is expected to generate.
    `,
        formula: true,
        formulaHTMLArr: [{
            label: "On purchase price",
            type: "division",
            equal: "CR",
            topHTML: <> <span style={color} >Yearly NOI</span></>,
            bottomHTML: <><span style={color} >Purchase Price</span></>
        }]
    },
    "Cap Rate (Market Price)": {
        title: "Cap Rate (Market Price)",
        desc: `The capitalization rate (or cap rate) is the rate of return on a real estate investment property 
    based on the yearly net operating income that the property is expected to generate.
    `,
        formula: true,
        formulaHTMLArr: [{
            label: "On market value",
            type: "division",
            equal: "CR",
            topHTML: <> <span style={color} >Yearly NOI</span></>,
            bottomHTML: <><span style={color} >Market value</span></>
        }]
    },
    "Cap Rate (Market Value)": {
        title: "Cap Rate (Market Value)",
        desc: `The capitalization rate (or cap rate) is the rate of return on a real estate investment property 
    based on the yearly net operating income that the property is expected to generate.
    `,
        formula: true,
        formulaHTMLArr: [{
            label: "On market value",
            type: "division",
            equal: "CR",
            topHTML: <> <span style={color} >Yearly NOI</span></>,
            bottomHTML: <><span style={color} >Market value</span></>
        }]
    },
    "Cash on Cash Return": {
        title: "Cash on Cash Return",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "division",
            equal: "COC",
            topHTML: <> <span style={color} >Yearly cash flow</span></>,
            bottomHTML: <><span style={color} >Cash Invested</span></>
        }]
    },
    "Return on Equity": {
        title: "Return on Equity",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "division",
            equal: "ROE",
            topHTML: <> <span style={color} >Yearly cash flow</span></>,
            bottomHTML: <><span style={color} >Total equity at the end of the year</span></>
        }]
    },
    "Return on Investment": {
        title: "Return on Investment",
        desc: "Total return on your invested cash if you were to sell the property.",
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "division",
            equal: "ROI",
            topHTML: <> <span style={color} >Total equity</span> + <span style={color} >cumulative cash flow</span> - <span style={color} >selling cost</span> - <span style={color} >total invested cash</span></>,
            bottomHTML: <><span style={color} >total invested cash</span></>
        }]
    },
    "Internal Rate of Return (Unlevered)": {
        title: "IRR (Unlevered)",
        desc: "IRR is a discount rate that makes the net present value (NPV) of all cash flows equal to zero in a discounted cash flow analysis.",
        formula: false
    },
    "Internal Rate of Return (Levered)": {
        title: "IRR (Levered)",
        desc: "IRR is a discount rate that makes the net present value (NPV) of all cash flows equal to zero in a discounted cash flow analysis",
        formula: false
    },
    "Loan Balance": {
        title: "Loan Balance",
        desc: "Loan Balance is the amount left to pay back the entire loan. ( Principal amount of the loan left over).",
        formula: false
    },
    "Annualized ROI": {
        title: "Annualized ROI",
        desc: "An average annualized rate of return on your total invested cash, sometimes also called annualized ROI. For a flip, the IRR is a hypothetical annualized return on your invested capital based on the current flip transaction.",
        formula: false
    },
    "Net Costs": {
        title: "Net Costs",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: "For rehab period",
            type: "plusminus",
            formulaHTML: <><span style={color} >Net cost</span> = <span style={color} >Loan payment</span> + <span style={color} >Operating expenditure</span></>
        },
        {
            label: "For rental period",
            type: "plusminus",
            formulaHTML: <><span style={color} >Net cost</span> = <span style={color} >Loan payment</span> + <span style={color} >Operating expenditure</span> - <span style={color} >Income</span> </>
        }]
    },
    "Total Net Costs": {
        title: "Total Net Costs",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: "For rehab period",
            type: "plusminus",
            formulaHTML: <><span style={color} >Net cost</span> = <span style={color} >Loan payment</span> + <span style={color} >Operating expenditure</span></>
        },
        {
            label: "For rental period",
            type: "plusminus",
            formulaHTML: <><span style={color} >Net cost</span> = <span style={color} >Loan payment</span> + <span style={color} >Operating expenditure</span> - <span style={color} >Income</span> </>
        }]
    },
    "Operating Expenditure": {
        title: "Operating Expenditure",
        desc: "Rehab period-> Recurring rehab expense & Rental period-> Operating expense",
        formula: false,
    },
    "Selling Price": {
        title: "Selling Price",
        desc: "The price at which the property is expected to be sold.",
        formula: false,
    },
    "Loan Repayments": {
        title: "Loan Repayments",
        desc: "Loan Balance at the end of the respective month/year.",
        formula: false,
    },
    "Post Tax Profit": {
        title: "Post Tax Profit",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Post Tax Profit</span> = <span style={color} >Total profit</span> * <span style={color} >(1-taxRate)</span></>
        }]
    },
    "Total Profit": {
        title: "Total Profit",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Profit</span> = <span style={color} >Sale Proceeds</span> + <span style={color} >Cumulative Cash Flow</span> - <span style={color} >Total Cash Invested</span></>
        }]
    },
    "Total Deductions": {
        title: "Total Deductions",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Deductions</span> = <span style={color} >Operating Expenses</span> + <span style={color} >Loan Interest</span> + <span style={color} >Depreciation</span></>
        }]
    },
    "Income": {
        title: "Income",
        desc: "Income earned during the month.",
        formula: true,
        formulaHTMLArr: [{
            label: "For Rehab Period",
            type: "plusminus",
            formulaHTML: <><span style={color} >income</span> = <span style={color} >0</span></>
        },
        {
            label: "For rental Period",
            type: "plusminus",
            formulaHTML: <><span style={color} >income</span> = <span style={color} >gross rent</span> - <span style={color} >vacancy rate</span> + <span style={color} >other income</span></>
        }]
    },
    "Rehab Operating Expenses": {
        title: "Rehab Operating Expenses",
        desc: "Total Operating Expense During Rehab.",
        formula: false,
    },
    "Post Tax Cash Flow": {
        title: "Post Tax Cash Flow",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Post Tax Cash Flow</span> = <span style={color} >(cash flow)</span> * <span style={color} >(1-taxRate)</span></>
        }]
    },

    "Purchase Price": {
        title: "Purchase Price",
        desc: "The amount that you are paying to buy a property.",
        formula: false
    },

    "Rehab Costs": {
        title: "Rehab Costs",
        desc: "Costs and expenses associated with repairs and rehab of a property(includes cost overrun)",
        formula: false
    },

    "Amount Financed": {
        title: "Amount Financed",
        desc: "The part of the property’s purchase price (and optionally rehab costs) financed by the lender",
        formula: false
    },

    "Down Payment": {
        title: "Down Payment",
        desc: "Down payment on home loan is the upfront payment you make to a bank (as a percentage of property’s purchase price)",
        formula: false
    },

    "Purchase Costs": {
        title: "Purchase Costs",
        desc: "Purchase cost (aka closing costs) are expenses and fees due at the closing of a real estate transaction while buying a property, in addition to the property's purchase price",
        formula: false
    },

    "Mortgage Upfront": {
        title: "Mortgage Upfront",
        desc: "Mortgage insurance is a type of insurance you might be required to pay for if you have a conventional loan. It is generally required by lenders if your down payment is less than 20% of the property value",
        formula: false
    },

    "Total Cash Needed": {
        title: "Total Cash Needed",
        desc: "The total amount of cash required to buy and rehab a property",
        formula: false
    },

    "Loan Amount": {
        title: "Loan Amount",
        desc: "The part of the property’s purchase price (and optionally rehab costs) financed by the lender",
        formula: false
    },

    "Financing Of": {
        title: "Financing Of",
        desc: "Financing Of",
        formula: false
    },

    "Mortgage Insurance": {
        title: "Mortgage Insurance",
        desc: "Mortgage insurance is a type of insurance you might be required to pay for if you have a conventional loan. It is generally required by lenders if your down payment is less than 20% of the property value",
        formula: false
    },

    "Loan Type": {
        title: "Loan Type",
        desc: "The type of Loan (amortizing/ interest only) taken by the lender.",
        formula: false
    },

    "Interest Rate": {
        title: "Interest Rate",
        desc: "The rate of interest charged by a bank on loan amount, compounded annually in case of amortizing loans",
        formula: false
    },

    "After Repair Value": {
        title: "After Repair Value",
        desc: "The (estimated) market value of the property after rehab is done",
        formula: false
    },

    "ARV Per Square Foot": {
        title: "ARV Per Square Foot",
        desc: "Ratio of after repair value and total square footage of the property",
        formula: false
    },

    "Price Per Square Foot": {
        title: "Price Per Square Foot",
        desc: "Ratio of purchase price and total square footage of the property",
        formula: false
    },

    "Rehab Per Square Foot": {
        title: "Rehab Per Square Foot",
        desc: "Ratio of rehab cost and total square footage of the property",
        formula: false
    },

    "Total Rehab Operating Cost": {
        title: "Total Rehab Operating Cost",
        desc: "Total operating costs during rehab (like property tax, insurance, electricity, water supply costs, etc), excluding loan payments",
        formula: false
    },

    "Vacancy": {
        title: "Vacancy",
        desc: "Rent foregone due to vacancy.",
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Vacancy Expense</span> = <span style={color} >Gross Rent</span> * <span style={color} >Vacancy Rate</span></>
        }]
    },

    "Loan to Cost": {
        title: "Loan to Cost",
        desc: "The ratio between loan amount and property acquisition cost.",
        formula: true,
        formulaHTMLArr: [{
            label: "If rehab is financed",
            type: "division",
            equal: "LTC",
            topHTML: <> <span style={color} >Loan amount</span></>,
            bottomHTML: <><span style={color} >Purchase price</span> + <span style={color} >Rehab Cost</span></>
        },
        {
            label: "If rehab is not financed",
            type: "division",
            equal: "LTC",
            topHTML: <> <span style={color} >Loan amount</span></>,
            bottomHTML: <><span style={color} >Purchase price</span></>
        }]
    },

    "Loan to Value": {
        title: "Loan to Value",
        desc: "The ratio between loan amount and the market value of the property",
        formula: false
    },

    "Rehab Period": {
        title: "Rehab Period",
        desc: "Rehab period is the expected period during which rehab/repair works of the property will be completed",
        formula: false
    },

    "Refinance Loan Amount": {
        title: "Refinance Loan Amount",
        desc: "The part of the property’s total equity refinanced by the lender after some months of financing it.",
        formula: false
    },

    "Refinance Costs": {
        title: "Refinance Costs",
        desc: "Refinance costs (aka closing costs) are expenses and fees associated with refinancing a property",
        formula: false
    },

    "Purchase Loan Repayment": {
        title: "Purchase Loan Repayment",
        desc: "Out standing loan balance at the time of refinance",
        formula: false
    },

    "Total Holding Costs": {
        title: "Total Holding Costs",
        desc: "All the recurring expenses that will be paid during rehab period, including loan payment",
        formula: false
    },

    "Loan Amount BRRRR": {
        title: "Loan Amount BRRRR",
        desc: "The part of the property’s total equity refinanced by the lender after some months of financing it.",
        formula: false
    },

    "Net Income After Rehab": {
        title: "Net Income After Rehab",
        desc: "It is the net income after rehab & before refinancing, including loan Payments.",
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Net Income After Rehab</span> = <span style={color} >(Monthly NOI</span> - <span style={color} >Monthly loanPayment)</span> * <span style={color} >(refinance Time</span> - <span style={color} >rehab period)</span></>
        }]
    },

    "Invested Cash": {
        title: "Invested Cash",
        desc: "The total amount of cash required to buy and rehab a property.(same as total cash needed)",
        formula: true,
        formulaHTMLArr: [{
            label: "With financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Cash Needed</span> = <span style={color} >Down payment</span> + <span style={color} >Purchase cost</span> + <span style={color} >Rehab costs (if rehab is not financed)</span></>
        },
        {
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Cash Needed</span> = <span style={color} >Down payment</span> + <span style={color} >Purchase cost (if rehab is also financed)</span></>
        },
        {
            label: "Without financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Cash Needed</span> = <span style={color} >Down payment</span> + <span style={color} >Purchase cost</span> + <span style={color} >Rehab costs</span></>
        }
        ]
    },

    "Refinance Cash Out": {
        title: "Refinance Cash Out",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Refinance cash out</span> = <span style={color} >Refinance loan amount</span> - <span style={color} >Refinance costs</span> - <span style={color} >Purchase loan payments</span> - <span style={color} >Total holding costs</span></>
        }]
    },

    "Total Cash Invested BRRRR": {
        title: "Total Cash Invested",
        desc: "The total amount of capital that you have invested in a property.",
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <>
                <span style={color} >Total cash invested</span>
                = <span style={color} >Invested Cash</span>
                - <span style={color} >Refinance Cash out</span>
            </>
        }]
    },

    "Holding Costs": {
        title: "Holding Costs",
        desc: null,
        formula: true,
        formulaHTMLArr: [{
            label: null,
            type: "plusminus",
            formulaHTML: <><span style={color} >Holding cost</span> = <span style={color} >Loan payment</span> + <span style={color} >Operating expenditure(during rehab)</span></>
        }]
    },

    "Net Rental Income": {
        title: "Net Rental Income",
        desc: "Net Income during rental period=Gross rent-vacancy+other income-operating expense-loan payment",
        formula: false
    },

    "Annualized ROI": {
        title: "Annualized ROI",
        desc: "An average annualized rate of return on your total invested cash, sometimes also called annualized ROI. For a flip, the IRR is a hypothetical annualized return on your invested capital based on the current flip transaction.",
        formula: false
    },

    "Total Profit Flip": {
        title: "Total Profit",
        desc: "The total net amount you will receive as profit from a flip after selling the property.",
        formula: true,
        formulaHTMLArr: [{
            label: "With Financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Profit</span> = <span style={color} >ARV</span> - <span style={color} >Selling Costs</span> - <span style={color} >Loan Repayment</span> - <span style={color} >Holding Costs</span> - <span style={color} >Total Invested Cash</span></>
        },
        {
            label: "Without Financing",
            type: "plusminus",
            formulaHTML: <><span style={color} >Total Profit</span> = <span style={color} >ARV</span> - <span style={color} >Selling Costs</span> - <span style={color} >Holding Costs</span> - <span style={color} >Total Invested Cash</span></>
        }]
    }
};

export default glossaryObjObj;