const classifications = {
    categories: [
        'Asset', 'Equity', 'Expense', 'Liability', 'Revenue',
    ],

    group: {
        'Asset': ['Account Receivable (A/R)', 'Other Current Assets', 'Bank', 'Fixed Assets', 'Other Assets'],
        'Equity': ['Equity'],
        'Expense': ['Cost of Goods Sold', 'Expense', 'Other Expense'],
        'Liability': ['Accounts Payables (A/P)', 'Credit Card', 'Other Current Liabilities', 'Long Term Liabilities'],
        'Revenue': ['Income', 'Other Income',]
    }
}

const types = [
    'Account Receivable (A/R)',
    'Other Current Assets',
    'Bank', 'Fixed Assets', 'Other Assets',
    'Accounts Payables (A/P)', 'Credit Card',
    'Other Current Liabilities', 'Long Term Liabilities',
    'Equity', 'Income', 'Other Income', 'Cost of Goods Sold',
    'Expense', 'Other Expense'
];

const subTypes = {
    'Account Receivable (A/R)': [
        {
            name: 'Accounts Receivable (A/R)',
            debit: true,
            qbType: 'AccountsReceivable',
            description: 'Accounts receivable (also called A/R, Debtors, or Trade and other receivables) tracks money that customers owe you for products or services, and payments customers make. \n '
        }
    ],
    'Other Current Assets': [
        {
            name: 'Allowance for Bad Debts',
            debit: true,
            qbType: 'AllowanceForBadDebts',
            description: 'Use Allowance for bad debts to estimate the part of Accounts receivable you think you might not collect. \n'
                + 'Use this only if you are keeping your books on the accrual basis.'
        },
        {
            name: 'Development Costs',
            debit: true,
            qbType: 'DevelopmentCosts',
            description: 'Use Development costs to track amounts you deposit or set aside to arrange for financing, such as an SBA loan, or for deposits in anticipation of the purchase of property or other assets.\n' +
                'When the deposit is refunded, or the purchase takes place, remove the amount from this account.'
        },
        {
            name: 'Employee Cash Advances',
            debit: true,
            qbType: 'EmployeeCashAdvances',
            description: ' Use Employee cash advances to track employee wages and salary you issue to an employee early, or other non-salary money given to employees. \n'
                + 'If you make a loan to an employee, use the Other current asset account type called Loans to others, instead.'
        },

        {
            name: 'Inventory',
            debit: true,
            qbType: 'Inventory',
            description: 'Use Inventory to track the cost of goods your business purchases for resale.\n'
                + 'When the goods are sold, assign the sale to a Cost of goods sold account.'
        },
        {
            name: 'Investments - Mortgage/Real Estate Loans',
            debit: true,
            qbType: 'Investment_MortgageRealEstateLoans',
            description: 'Use Investments - Mortgage/real estate loans to show the balances of any mortgage or real estate loans your business has made or purchased.'
        },
        {
            name: 'Investments - Tax Exempt Securities',
            debit: true,
            qbType: 'Investment_TaxExemptSecurities',
            description: 'Use Investments - Tax-exempt securities for investments in state and local bonds, or mutual funds that invest in state and local bonds.'
        },
        {
            name: 'Investments - U.S. Government Obligations',
            debit: true,
            qbType: 'Investment_USGovernmentObligations',
            description: 'Use Investments - U.S. government obligations for bonds issued by the U.S. government.'
        },
        {
            name: 'Investments - Other',
            debit: true,
            qbType: 'Investment_Other',
            description: 'Use Investments - Other to track the value of investments not covered by other investment account types. Examples include publicly-traded stocks, coins, or gold.'
        },
        {
            name: 'Loans to Officers',
            debit: true,
            qbType: 'LoansToOfficers',
            description: 'If you operate your business as a Corporation or S Corporation, use Loans to officers to track money loaned to officers of your business.'
        },
        {
            name: 'Loans to Others ',
            debit: true,
            qbType: 'LoansToOthers',
            description: 'Use Loans to others to track money your business loans to other people or businesses.'
                + 'This type of account is also referred to as Notes Receivable. \n'
                + 'For early salary payments to employees, use Employee cash advances, instead.'
        },
        {
            name: 'Loans to Stockholders',
            debit: true,
            qbType: 'LoansToStockholders',
            description: 'If you operate your business as a Corporation or S Corporation, use Loans to stockholders to track money your business loans to its stockholders.'
        },
        {
            name: 'Other current assets',
            debit: true,
            qbType: 'OtherCurrentAssets',
            description: 'Use Other current assets for current assets not covered by the other types.' +
                ' Current assets are likely to be converted to cash or used up in a year.'
        },
        {
            name: 'Prepaid expenses',
            debit: true,
            qbType: 'PrepaidExpenses',
            description: 'Use Prepaid expenses to track payments for expenses that you won’t recognize until your next accounting period.'
                + 'When you recognize the expense, make a journal entry to transfer money from this account to the expense account.'
        },
        {
            name: 'Retainage',
            debit: true,
            qbType: 'Retainage',
            description: 'Use Retainage if your customers regularly hold back a portion of a contract amount until you have completed a project.'
                + 'This type of account is often used in the construction industry, and only if you record income on an accrual basis.'
        },
        {
            name: 'Undeposited Funds',
            debit: true,
            qbType: 'UndepositedFunds',
            description: 'Use Undeposited funds for cash or checks from sales that haven’t been deposited yet.'
                + 'For petty cash, use Cash on hand, instead.'
        }
    ],
    'Bank': [
        {
            name: 'Cash on hand',
            debit: true,
            qbType: 'CashOnHand',
            description: 'Use a Cash on hand account to track cash your company keeps for occasional expenses, also called petty cash. \n'
                + 'To track cash from sales that have not been deposited yet, use a pre-created account called Undeposited funds, instead.'
        },
        {
            name: 'Checking',
            debit: true,
            qbType: 'Checking',
            description: 'Use Checking accounts to track all your checking activity, including debit card transactions.'
        },
        {
            name: 'Money Market',
            debit: true,
            qbType: 'MoneyMarket',
            description: 'Use Money market to track amounts in money market accounts.' +
                'For investments, see Other Current Assets, instead.'
        },
        {
            name: 'Rents held in trust ',
            debit: true,
            qbType: 'RentsHeldInTrust',
            description: 'Use Rents held in trust to track deposits and rent held on behalf of the property owners.' +
                'Typically only property managers use this type of account.'
        },
        {
            name: 'Savings',
            debit: true,
            qbType: 'Savings',
            description: 'Use Savings accounts to track your savings and CD activity.' +
                'Each savings account your company has at a bank or other financial institution should have its own Savings type account.' +
                'For investments, see Other Current Assets, instead.'
        },
        {
            name: 'Trust accounts',
            debit: true,
            qbType: 'TrustAccounts',
            description: 'Use Trust accounts for money held by you for the benefit of someone else.' +
                'For example, trust accounts are often used by attorneys to keep track of expense money their customers have given them.' +
                'Often, to keep the amount in a trust account from looking like it’s yours, the amount is offset in a "contra" liability account (a Current Liability).'
        },
    ],
    'Fixed Assets': [
        {
            name: 'Accumulated Amortization',
            debit: true,
            qbType: 'AccumulatedAmortization',
            description: 'Use Accumulated amortization to track how much you amortize intangible assets.'
        },
        {
            name: 'Accumulated Depletion',
            debit: true,
            qbType: 'AccumulatedDepletion',
            description: 'Use Accumulated depletion to track how much you deplete a natural resource.'
        },
        {
            name: 'Accumulated Depreciation',
            debit: true,
            qbType: 'AccumulatedDepreciation',
            description: 'Use Accumulated depreciation to track how much you depreciate a fixed asset (a physical asset you do not expect to convert to cash during one year of normal operations).'
        },
        {
            name: 'Buildings',
            debit: true,
            qbType: 'Buildings',
            description: 'Use Buildings to track the cost of structures you own and use for your business. If you have a business in your home, consult your accountant or IRS Publication 587.' +
                'Use a Land account for the land portion of any real property you own, splitting the cost of the property between land and building in a logical method. A common method is to mimic the land-to-building ratio on the property tax statement.'
        },
        {
            name: 'Depletable Assets',
            debit: true,
            qbType: 'DepletableAssets',
            description: 'Use Depletable assets to track natural resources, such as timberlands, oil wells, and mineral deposits.'
        },

        {
            name: 'Intangible Assets',
            debit: true,
            qbType: 'IntangibleAssets',
            description: 'Use Intangible assets to track intangible assets that you plan to amortize. Examples include franchises, customer lists, copyrights, and patents.'
        },
        {
            name: 'Land',
            debit: true,
            qbType: 'Land',
            description: 'Use Land for land or property you don’t depreciate.' +
                'If land and building were acquired together, split the cost between the two in a logical way. One common method is to use the land-to-building ratio on the property tax statement.' +
                'For land you use as a natural resource, use a Depletable assets account, instead.'
        },
        {
            name: 'Leasehold Improvements',
            debit: true,
            qbType: 'LeaseholdImprovements',
            description: 'Use Leasehold improvements to track improvements to a leased asset that increases the asset’s value. For example, if you carpet a leased office space and are not reimbursed, that’s a leasehold improvement.'
        },

        {
            name: 'Machinery & Equipment',
            debit: true,
            qbType: 'MachineryAndEquipment',
            description: 'Use Machinery & equipment to track computer hardware, as well as any other non-furniture fixtures or devices owned and used for your business.' +
                'This includes equipment that you ride, like tractors and lawn mowers. Cars and trucks, however, should be tracked with Vehicle accounts, instead.'
        },

        {
            name: 'Fixed Asset Equipment/Software',
            debit: true,
            qbType: 'FixedAssetOtherToolsEquipment',
            description: 'Use Fixed Asset Equipment to track tools like computers, phone, software, furniture, fixtures etc'
        },

        {
            name: 'Other fixed asset',
            debit: true,
            qbType: 'OtherFixedAssets',
            description: 'Use Other fixed asset for fixed assets that are not covered by other asset types.' +
                'Fixed assets are physical property that you use in your business and that you do not expect to convert to cash or be used up during one year of normal operations.'
        },
        {
            name: 'Vehicles',
            debit: true,
            qbType: 'Vehicles',
            description: 'Use Vehicles to track the value of vehicles your business owns and uses for business. This includes off-road vehicles, air planes, helicopters, and boats.' +
                'If you use a vehicle for both business and personal use, consult your accountant or the IRS to see how you should track its value.'
        },

    ],
    'Other Assets': [
        {
            name: 'Accumulated amortization of other assets',
            debit: true,
            qbType: 'AccumulatedAmortizationOfOtherAssets',
            description: 'Use Accumulated amortization of other assets to track how much you’ve amortized asset whose type is Other Asset.'
        },
        {
            name: 'Goodwill',
            debit: true,
            qbType: 'Goodwill',
            description: 'Use Goodwill only if you have acquired another company. It represents the intangible assets of the acquired company which gave it an advantage, such as favorable government relations, business name, outstanding credit ratings, location, superior management, customer lists, product quality, or good labor relations.'
        },
        {
            name: 'Lease buyout',
            debit: true,
            qbType: 'LeaseBuyout',
            description: 'Use Lease buyout to track lease payments to be applied toward the purchase of a leased asset.' +
                'You don’t track the leased asset itself until you purchase it.'
        },
        {
            name: 'Licenses',
            debit: true,
            qbType: 'Licenses',
            description: 'Use Licenses to track non-professional licenses for permission to engage in an activity, like selling alcohol or radio broadcasting.' +
                'For fees associated with professional licenses granted to individuals, use a Legal & professional fees expense account, instead.'
        },
        {
            name: 'Organizational Costs',
            debit: true,
            qbType: 'OrganizationalCosts',
            description: 'Use Organizational costs to track costs incurred when forming a partnership or corporation.' +
                'The costs include the legal and accounting costs necessary to organize the company, facilitate the filings of the legal documents, and other paperwork.'
        },
        {
            name: 'Other long-term assets',
            debit: true,
            qbType: 'OtherLongTermAssets',
            description: 'Use Other long-term assets to track assets not covered by other types.' +
                'Long-term assets are expected to provide value for more than one year'
        },
        {
            name: 'Security deposits',
            debit: true,
            qbType: 'SecurityDeposits',
            description: 'Use Security deposits to track funds you’ve paid to cover any potential costs incurred by damage, loss, or theft.' +
                'The funds should be returned to you at the end of the contract.' +
                'If you collect deposits, use an Other current liabilities account type (an Other current liability account).'
        },
    ],
    'Accounts Payables (A/P)': [
        {
            name: 'Accounts Payable (A/P)',
            debit: false,
            qbType: 'AccountsPayable',
            description: 'Accounts payable (also called A/P) tracks amounts you owe to your vendors and suppliers.'
        },
    ],
    'Credit Card': [
        {
            name: 'Credit card',
            debit: false,
            qbType: 'CreditCard',
            description: 'Credit card accounts track the balance due on your business credit cards.' +
                'Create one Credit card account for each credit card account your business uses.'
        },
    ],
    'Other Current Liabilities': [
        {
            name: 'Federal Income Tax Payable',
            debit: false,
            qbType: 'FederalIncomeTaxPayable',
            description: 'Use Federal Income Tax Payable if your business is a corporation, S corporation, or limited partnership keeping records on the accrual basis.' +
                'This account tracks income tax liabilities in the year the income is earned.'
        },
        {
            name: 'Insurance Payable',
            debit: false,
            qbType: 'InsurancePayable',
            description: 'Use Insurance payable to keep track of insurance amounts due.' +
                'This account is most useful for businesses with monthly recurring insurance expenses such as Workers’ Compensation.'
        },
        {
            name: 'Line of Credit',
            debit: false,
            qbType: 'LineOfCredit',
            description: 'Use Line of credit to track the balance due on any lines of credit your business has. Each line of credit your business has should have its own Line of credit account.'
        },
        {
            name: 'Loan Payable ',
            debit: false,
            qbType: 'LoanPayable',
            description: 'Use Loan payable to track loans your business owes which are payable within the next twelve months.' +
                'For longer-term loans, use the Long-term liability called Notes payable, instead'
        },
        {
            name: 'Other Current Liabilities',
            debit: false,
            qbType: 'OtherCurrentLiabilities',
            description: 'Use Other current liabilities to track liabilities due within the next twelve months that do not fit the Other current liability account types.'
        },
        {
            name: 'Payroll Clearing',
            debit: false,
            qbType: 'PayrollClearing',
            description: 'Use Payroll clearing to keep track of any non-tax amounts that you have deducted from employee paychecks or that you owe as a result of doing payroll. When you forward money to the appropriate vendors, deduct the amount from the balance of this account.' +
                'Do not use this account for tax amounts you have withheld or owe from paying employee wages. For those amounts, use the Payroll tax payable account instead.'
        },
        {
            name: 'Payroll Tax Payable',
            debit: false,
            qbType: 'PayrollTaxPayable',
            description: 'Use Payroll tax payable to keep track of tax amounts that you owe to Federal, State, and Local government agencies as a result of paying wages and taxes you have withheld from employee paychecks. When you forward the money to the government agency, deduct the amount from the balance of this account.'
        },
        {
            name: 'Prepaid Expenses Payable',
            debit: false,
            qbType: 'PrepaidExpensesPayable',
            description: 'Use Prepaid expenses payable to track items such as property taxes that are due, but not yet deductible as an expense because the period they cover has not yet passed.'
        },
        {
            name: 'Rents in trust - Liability',
            debit: false,
            qbType: 'RentsInTrustLiability',
            description: 'Use Rents in trust - liability to offset the Rents in trust amount in assets.' +
                'Amounts in these accounts are held by your business on behalf of others. They do not belong to your business, so should not appear to be yours on your balance sheet. This "contra" account takes care of that, as long as the two balances match.'
        },
        {
            name: 'Sale Tax Payable',
            debit: false,
            qbType: 'SaleTaxPayable',
            description: 'Use Sale tax payable to track sales tax you have collected, but not yet remitted to the IRS.'
        },
        {
            name: 'State/Local Income Tax Payable',
            debit: false,
            qbType: 'StateLocalIncomeTaxPayable',
            description: 'Use State/local income tax payable if your business is a corporation, S corporation, or limited partnership keeping records on the accrual basis.' +
                'This account tracks income tax liabilities in the year the income is earned.'
        },
        {
            name: 'Trust Accounts - Liabilities',
            debit: false,
            qbType: 'TrustAccountsLiabilities',
            description: 'Use Trust accounts - liabilities to offset Trust accounts in assets.' +
                'Amounts in these accounts are held by your business on behalf of others. They do not belong to your business, so should not appear to be yours on your balance sheet. This "contra" account takes care of that, as long as the two balances match.'
        },

    ],
    'Long Term Liabilities': [
        {
            name: 'Notes payable',
            debit: false,
            qbType: 'NotesPayable',
            description: 'Use Notes payable to track the amounts your business owes in long-term (over twelve months) loans.' +
                'For shorter loans, use the Other current liability account type called Loan payable, instead.'
        },
        {
            name: 'Other long term Liabilities',
            debit: false,
            qbType: 'OtherLongTermLiabilities',
            description: 'Use Other long term liabilities to track liabilities due in more than twelve months that don’t fit the other Long-term liability account types.'
        },
        {
            name: 'Shareholder Notes Payable',
            debit: false,
            qbType: 'ShareholderNotesPayable',
            description: 'Use Shareholder notes payable to track long-term loan balances your business owes its shareholders.'
        },
    ],
    'Equity': [
        {
            name: 'Accumulated Adjustment',
            debit: false,
            qbType: 'AccumulatedAdjustment',
            description: 'S corporations use this account to track adjustments to owner’s equity that are not attributable to net income.'
        },
        {
            name: 'Common Stock',
            debit: false,
            qbType: 'CommonStock',
            description: 'Corporations use Common stock to track shares of its common stock in the hands of shareholders. The amount in this account should be the stated (or par) value of the stock.'
        },
        {
            name: 'Estimated Taxes',
            debit: false,
            qbType: 'EstimatedTaxes',
            description: ''
        },
        {
            name: 'Health Insurance Premium',
            debit: false,
            qbType: 'HealthInsurancePremium',
            description: ''
        },
        {
            name: 'Health Savings Account Contribution',
            debit: false,
            qbType: 'HealthSavingsAccountContribution',
            description: ''
        },
        {
            name: 'Opening Balance Equity',
            debit: false,
            qbType: 'OpeningBalanceEquity',
            description: ''
        },
        {
            name: "Owner's Equity",
            debit: false,
            qbType: "OwnersEquity",
            description: 'S corporations use Owner’s equity to show the cumulative net income or loss of their business as of the beginning of the fiscal year.'
        },
        {
            name: 'Paid-In Capital or Surplus',
            debit: false,
            qbType: 'PaidInCapitalOrSurplus',
            description: 'Corporations use Paid-in capital to track amounts received from shareholders in exchange for stock that are over and above the stock’s stated (or par) value.'
        },
        {
            name: 'Partner Contributions',
            debit: false,
            qbType: 'PartnerContributions',
            description: 'Partnerships use Partner contributions to track amounts partners contribute to the partnership during the year.'
        },
        {
            name: 'Partner Distributions',
            debit: false,
            qbType: 'PartnerDistributions',
            description: 'Partnerships use Partner distributions to track amounts distributed by the partnership to its partners during the year.\n' +
                'Don’t use this for regular payments to partners for interest or service. For regular payments, use a Guaranteed payments account (a Expense account in Payroll expenses), instead.'
        },
        {
            name: "Partner's Equity",
            debit: false,
            qbType: 'PartnersEquity',
            description: 'Partnerships use Partner’s equity to show the income remaining in the partnership for each partner as of the end of the prior year.'
        },
        {
            name: 'Personal Expense',
            debit: false,
            qbType: 'PersonalExpense',
            description: ''
        },
        {
            name: 'Personal Income',
            debit: false,
            qbType: 'PersonalIncome',
            description: ''
        },
        {
            name: 'Preferred Stock',
            debit: false,
            qbType: 'PreferredStock',
            description: 'Corporations use this account to track shares of its preferred stock in the hands of shareholders. The amount in this account should be the stated (or par) value of the stock.'
        },
        {
            name: 'Retained Earnings',
            debit: false,
            qbType: 'RetainedEarnings',
            description: 'Retained earnings tracks net income from previous fiscal years.\n'
        },
        {
            name: 'Treasury Stock',
            debit: false,
            qbType: 'TreasuryStock',
            description: 'Corporations use Treasury stock to track amounts paid by the corporation to buy its own stock back from shareholders.'
        }
    ],
    'Income': [
        {
            name: 'Discounts/Refunds Given',
            debit: false,
            qbType: 'DiscountsRefundsGiven',
            description: 'Use Discounts/refunds given to track discounts you give to customers. \n' +
                'This account typically has a negative balance so it offsets other income. \n' +
                'For discounts from vendors, use an expense account, instead.'
        },
        {
            name: 'Non-Profit Income',
            debit: false,
            qbType: 'NonProfitIncome',
            description: 'Use Non-profit income to track money coming in if you are a non-profit organization.Non-Profit Income'
        },
        {
            name: 'Other Primary Income',
            debit: false,
            qbType: 'OtherPrimaryIncome',
            description: 'Use Other primary income to track income from normal business operations that doesn’t fall into another Income type.'
        },
        {
            name: 'Sale of Product Income',
            debit: false,
            qbType: 'SaleOfProductIncome',
            description: 'Use Sale of product income to track income from selling products.' +
                'This can include all kinds of products, like crops and livestock, rental fees, performances, and food served.'
        },
        {
            name: 'Service/Fee Income',
            debit: false,
            qbType: 'ServiceFeeIncome',
            description: 'Use Service/fee income to track income from services you perform or ordinary usage fees you charge. \n' +
                'For fees customers pay you for late payments or other uncommon situations, use an Other Income account type called Other miscellaneous income, instead.'
        },
        {
            name: 'Unapplied Cash Payment Income',
            debit: false,
            qbType: 'UnappliedCashPaymentIncome',
            description: 'Unapplied Cash Payment Income reports the Cash Basis income from customers payments you’ve received but not applied to invoices or charges. In general, you would never use this directly on a purchase or sale transaction. The IRS calls this "Constructive Receipt Income." See Publication 538.'
        }
    ],
    'Other Income': [
        {
            name: 'Dividend Income',
            debit: false,
            qbType: 'DividendIncome',
            description: 'Use Dividend income to track taxable dividends from investments.'
        },
        {
            name: 'Interest Earned',
            debit: false,
            qbType: 'InterestEarned',
            description: 'Use Interest earned to track interest from bank or savings accounts, investments, or interest payments to you on loans your business made.Interest Earned'
        },
        {
            name: 'Other Investment Income',
            debit: false,
            qbType: 'OtherInvestmentIncome',
            description: 'Use Other investment income to track other types of investment income that isn’t from dividends or interest.Other Investment Income'
        },
        {
            name: 'Other Miscellaneous Income',
            debit: false,
            qbType: 'OtherMiscellaneousIncome',
            description: 'Use Other miscellaneous income to track income that isn’t from normal business operations, and doesn’t fall into another Other Income type.Other Miscellaneous Income'
        },
        {
            name: 'Tax-Exempt Interest',
            debit: false,
            qbType: 'TaxExemptInterest',
            description: 'Use Tax-exempt interest to record interest that isn’t taxable, such as interest on money in tax-exempt retirement accounts, or interest from tax-exempt bonds.'
        },
    ],
    'Cost of Goods Sold': [
        {
            name: 'Cost of labor',
            debit: true,
            qbType: 'CostOfLabor',
            description: 'Use Cost of labor - COS to track the cost of paying employees to produce products or supply services. \n' +
                'It includes all employment costs, including food and transportation, if applicable.'
        },
        {
            name: 'Equipment Rental',
            debit: true,
            qbType: 'EquipmentRental',
            description: 'Use Equipment rental - COS to track the cost of renting equipment to produce products or services. \n' +
                'If you purchase equipment, use a Fixed Asset account type called Machinery and equipment.'
        },
        {
            name: 'Other Costs of Services',
            debit: true,
            qbType: 'OtherCostsOfServices',
            description: 'Use Other costs of service - COS to track costs related to services you provide that don’t fall into another Cost of Goods Sold type.'
        },
        {
            name: 'Shipping, Freight & Delivery',
            debit: true,
            qbType: 'ShippingFreightDelivery',
            description: 'Use Shipping, freight & delivery - COGS to track the cost of shipping products to customers or distributors.Shipping, Freight & Delivery'
        },
        {
            name: 'Supplies & Materials',
            debit: true,
            qbType: 'SuppliesMaterials',
            description: 'Use Supplies & materials - COGS to track the cost of raw goods and parts used or consumed when producing a product or providing a service.'
        }
    ],
    'Expense': [
        {
            name: 'Advertising/Promotional',
            debit: true,
            qbType: 'AdvertisingPromotional',
            description: 'Use Advertising/promotional to track money spent promoting your company.\n' +
                'You may want different accounts of this type to track different promotional efforts (Yellow Pages, newspaper, radio, flyers, events, and so on). \n' +
                'If the promotion effort is a meal, use Promotional meals instead.'
        },
        {
            name: 'Auto',
            debit: true,
            qbType: 'Auto',
            description: 'Use Auto to track costs associated with vehicles.\n' +
                'You may want different accounts of this type to track gasoline, repairs, and maintenance. \n' +
                'If your business owns a car or truck, you may want to track its value as a Fixed Asset, in addition to tracking its expenses.'
        },
        {
            name: 'Bad Debts',
            debit: true,
            qbType: 'BadDebts',
            description: 'Use Bad debt to track debt you have written off.'
        },
        {
            name: 'Bank Charges',
            debit: true,
            qbType: 'BankCharges',
            description: 'Use Bank charges for any fees you pay to financial institutions.'
        },
        {
            name: 'Charitable Contributions',
            debit: true,
            qbType: 'CharitableContributions',
            description: 'Use Charitable contributions to track gifts to charity.'
        },
        {
            name: 'Communication',
            debit: true,
            qbType: 'Communication',
            description: ''
        },
        {
            name: 'Cost of labor',
            debit: true,
            qbType: 'CostOfLabor',
            description: 'Use Cost of labor - COS to track the cost of paying employees to produce products or supply services. \n' +
                'It includes all employment costs, including food and transportation, if applicable.'
        },
        {
            name: 'Dues & subscriptions',
            debit: true,
            qbType: 'DuesSubscriptions',
            description: 'Use Dues & subscriptions to track dues & subscriptions related to running your business. \n' +
                'You may want different accounts of this type for professional dues, fees for licenses that can’t be transferred, magazines, newspapers, industry publications, or service subscriptions.'
        },
        {
            name: 'Entertainment',
            debit: true,
            qbType: 'Entertainment',
            description: 'Use Entertainment to track events to entertain employees. \n' +
                'If the event is a meal, use Entertainment meals, instead.'
        },
        {
            name: 'Entertainment Meals',
            debit: true,
            qbType: 'EntertainmentMeals',
            description: 'Use Entertainment meals to track how much you spend on dining with your employees to promote morale.\n' +
                'If you dine with a customer to promote your business, use a Promotional meals account, instead.\n' +

                'Be sure to include who you ate with and the purpose of the meal when you enter the transaction.'
        },
        {
            name: 'Equipment Rental',
            debit: true,
            qbType: 'EquipmentRental',
            description: 'Use Equipment rental - COS to track the cost of renting equipment to produce products or services. \n' +
                'If you purchase equipment, use a Fixed Asset account type called Machinery and equipment.'
        },
        {
            name: 'Finance costs',
            debit: true,
            qbType: 'FinanceCosts',
            description: ''
        },
        {
            name: 'Insurance',
            debit: true,
            qbType: 'Insurance',
            description: 'Use Insurance to track insurance payments.\n' +
                'You may want different accounts of this type for different types of insurance (auto, general liability, and so on).'
        },
        {
            name: 'Interest Paid',
            debit: true,
            qbType: 'InterestPaid',
            description: 'Use Interest paid for all types of interest you pay, including mortgage interest, finance charges on credit cards, or interest on loans.'
        },
        {
            name: 'Legal & Professional Fees',
            debit: true,
            qbType: 'LegalProfessionalFees',
            description: 'Use Legal & professional fees to track money to pay to professionals to help you run your business.\n' +
                'You may want different accounts of this type for payments to your accountant, lawyer, or other consultants.'
        },
        {
            name: 'Office/General Administrative Expenses',
            debit: true,
            qbType: 'OfficeGeneralAdministrativeExpenses',
            description: 'Use Office/general administrative expenses to track all types of general or office-related expenses.'
        },
        {
            name: 'Other Business Expenses',
            debit: true,
            qbType: 'OtherBusinessExpenses',
            description: ''
        },
        {
            name: 'Other Miscellaneous Service Cost',
            debit: true,
            qbType: 'OtherMiscellaneousServiceCost',
            description: 'Use Other miscellaneous service cost to track costs related to providing services that don’t fall into another Expense type.\n' +
                'This account is also available as a Cost of Goods Sold (COGS) account.'
        },
        {
            name: 'Payroll Expenses',
            debit: true,
            qbType: 'PayrollExpenses',
            description: 'Use Payroll expenses to track payroll expenses. You may want different accounts of this type for things like:\n' +
                'Compensation of officers\n' +
                'Guaranteed payments\n' +
                'Workers compensation\n' +
                'Salaries and wages\n' +
                'Payroll taxes'
        },
        {
            name: 'Payroll Tax Expenses',
            debit: true,
            qbType: 'PayrollTaxExpenses',
            description: ''
        },
        {
            name: 'Payroll Wage Expenses',
            debit: true,
            qbType: 'PayrollWageExpenses',
            description: ''
        },
        {
            name: 'Promotional Meals',
            debit: true,
            qbType: 'PromotionalMeals',
            description: 'Use Promotional meals to track how much you spend dining with a customer to promote your business.\n' +
                'Be sure to include who you ate with and the purpose of the meal when you enter the transaction.'
        },
        {
            name: 'Rent or Lease of Buildings',
            debit: true,
            qbType: 'RentOrLeaseOfBuildings',
            description: 'Use Rent or lease of buildings to track rent payments you make.'
        },
        {
            name: 'Repair & Maintenance',
            debit: true,
            qbType: 'RepairMaintenance',
            description: 'Use Repair & maintenance to track any repairs and periodic maintenance fees.\n' +
                'You may want different accounts of this type to track different types repair & maintenance expenses (auto, equipment, landscape, and so on).'
        },
        {
            name: 'Shipping, Freight & Delivery',
            debit: true,
            qbType: 'ShippingFreightDelivery',
            description: 'Use Shipping, freight & delivery - COGS to track the cost of shipping products to customers or distributors.Shipping, Freight & Delivery'
        },
        {
            name: 'Supplies & Materials',
            debit: true,
            qbType: 'SuppliesMaterials',
            description: 'Use Supplies & materials - COGS to track the cost of raw goods and parts used or consumed when producing a product or providing a service.'
        },
        {
            name: 'Taxes Paid',
            debit: true,
            qbType: 'TaxesPaid',
            description: 'Use Taxes paid to track taxes you pay.\n' +
                'You may want different accounts of this type for payments to different tax agencies (sales tax, state tax, federal tax).'
        },
        {
            name: 'Travel',
            debit: true,
            qbType: 'Travel',
            description: 'Use Travel to track travel costs.\n' +
                'For food you eat while traveling, use Travel meals, instead.'
        },
        {
            name: 'Travel Meals',
            debit: true,
            qbType: 'TravelMeals',
            description: 'Use Travel meals to track how much you spend on food while traveling.\n' +
                'If you dine with a customer to promote your business, use a Promotional meals account, instead.\n' +
                'If you dine with your employees to promote morale, use Entertainment meals, instead.'
        },
        {
            name: 'Unapplied Cash Bill Payment Expense',
            debit: true,
            qbType: 'UnappliedCashBillPaymentExpense',
            description: 'Unapplied Cash Bill Payment Expense reports the Cash Basis expense from vendor payment checks you’ve sent but not yet applied to vendor bills. In general, you would never use this directly on a purchase or sale transaction. See IRS Publication 538.'
        },
        {
            name: 'Utilities',
            debit: true,
            qbType: 'Utilities',
            description: 'Use Utilities to track utility payments.\n' +
                'You may want different accounts of this type to track different types of utility payments (gas and electric, telephone, water, and so on).'
        }
    ],
    'Other Expense': [
        {
            name: 'Amortization',
            debit: true,
            qbType: 'Amortization',
            description: 'Use Amortization to track amortization of intangible assets.\n' +
                'Amortization is spreading the cost of an intangible asset over its useful life, like depreciation of fixed assets.\n' +
                'You may want an amortization account for each intangible asset you have.'
        },
        {
            name: 'Depreciation',
            debit: true,
            qbType: 'Depreciation',
            description: 'Use Depreciation to track how much you depreciate fixed assets.\n' +
                'You may want a depreciation account for each fixed asset you have.'
        },
        {
            name: 'Exchange Gain or Loss',
            debit: true,
            qbType: 'ExchangeGainOrLoss',
            description: 'Use Exchange Gain or Loss to track gains or losses that occur as a result of exchange rate fluctuations.'
        },
        {
            name: 'Gas And Fuel',
            debit: true,
            qbType: 'GasAndFuel',
            description: ''
        },
        {
            name: 'Home Office',
            debit: true,
            qbType: 'HomeOffice',
            description: ''
        },
        {
            name: 'Homeowner Rental Insurance',
            debit: true,
            qbType: 'HomeownerRentalInsurance',
            description: ''
        },
        {
            name: 'Mortgage Interest Home Office',
            debit: true,
            qbType: 'MortgageInterestHomeOffice',
            description: ''
        },
        {
            name: 'Other Home Office Expenses',
            debit: true,
            qbType: 'OtherHomeOfficeExpenses',
            description: ''
        },
        {
            name: 'Other Miscellaneous Expense',
            debit: true,
            qbType: 'OtherMiscellaneousExpense',
            description: 'Use Other miscellaneous expense to track unusual or infrequent expenses that don’t fall into another Other Expense type.\n' +
                'If an expense is directly related to providing a service, use an Expense type (not an Other Expense type) account called Other miscellaneous service cost.'
        },
        {
            name: 'Other Vehicle Expenses',
            debit: true,
            qbType: 'OtherVehicleExpenses',
            description: ''
        },
        {
            name: 'Parking and Tolls',
            debit: true,
            qbType: 'ParkingAndTolls',
            description: ''
        },
        {
            name: 'Penalties & Settlements',
            debit: true,
            qbType: 'PenaltiesSettlements',
            description: 'Use Penalties & settlements to track money you pay for violating laws or regulations, settling lawsuits, or other penalties.'
        },
        {
            name: 'Property Tax Home Office',
            debit: true,
            qbType: 'PropertyTax',
            description: ''
        },
        {
            name: 'Rent and Lease Home Office',
            debit: true,
            qbType: 'RentAndLease',
            description: ''
        },
        {
            name: 'Repairs and Maintenance Home Office',
            debit: true,
            qbType: 'RepairsAndMaintenance',
            description: ''
        },
        {
            name: 'Utilities Home Office',
            debit: true,
            qbType: 'Utilities',
            description: ''
        },
        {
            name: 'Vehicle',
            debit: true,
            qbType: 'Vehicle',
            description: ''
        },
        {
            name: 'Vehicle Insurance',
            debit: true,
            qbType: 'VehicleInsurance',
            description: ''
        },
        {
            name: 'Vehicle Lease',
            debit: true,
            qbType: 'VehicleLease',
            description: ''
        },
        {
            name: 'Vehicle Loan',
            debit: true,
            qbType: 'VehicleLoan',
            description: ''
        },
        {
            name: 'Vehicle Loan Interest',
            debit: true,
            qbType: 'VehicleLoanInterest',
            description: ''
        },
        {
            name: 'Vehicle Registration',
            debit: true,
            qbType: 'VehicleRegistration',
            description: ''
        },
        {
            name: 'Vehicle Repairs',
            debit: true,
            qbType: 'VehicleRepairs',
            description: ''
        },
        {
            name: 'Wash and Road Services',
            debit: true,
            qbType: 'WashAndRoadServices',
            description: ''
        }
    ]

}

const chartAccountNames = {
    accountReceivable  : "Account Receivable (A/R)",
    cashCashEquivalent : "Cash and Cash Equivalent",
    accountsPayables : "Accounts Payables (A/P)"
}


module.exports = {
    classifications,
    subTypes
}