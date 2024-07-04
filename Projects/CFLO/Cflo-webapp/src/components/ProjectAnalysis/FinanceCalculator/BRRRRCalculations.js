import NewtonRaphson from "./NewtonRaphson";

const BRRRRCalcuations = (
  reportData,
  projectData,
  ExpenseData,
  holdingData
) => {
  const Area = Number(projectData.area);
  const taxRate = Number(projectData.projectTaxRate);
  const {
    reportType,
    purchasePrice,
    ARV,
    propertyTax,
    propertyInsurance,
    LoanType: localLoanType,
    DownPayment: localDownPayment,
    InterestRate: localInterestRate,
    LoanTerm: localLoanTerm,
    isFinancing,
    refinanceTime,
    refinanceLoanType,
    refinanceLoanAmount,
    remainingEquity,
    refinanceInterestRate,
    refinanceLoanTerm,
    refinanceMortgageType,
    refinanceUpfront,
    refinanceRecurring,
    refinanceCostTotal,
    rehabPeriod,
    holdingPeriod,
    holdingTotal,
    RehabCostPercent: localRehabCostPercent,
    financeMortgageType,
    Upfront: localUpfront,
    Recurring: localRecurring,
    purchaseTotal,
    rehabTotal,
    costOverrun,
    Period,
    GrossRent,
    Vacancy,
    otherIncomeTotal,
    operatingExpenseTotal,
    Appreciation,
    IncomeIncrease,
    ExpenseIncrease,
    SellingCosts,
    DepreciationPeriod,
    LandValue,
  } = reportData;

  let DownPayment = 0
  let InterestRate = 0
  let LoanTerm = 0
  let LoanType = 0
  let RehabCostPercent = 0
  let Upfront = 0
  let Recurring = 0


  if (isFinancing) {
    DownPayment = localDownPayment
    InterestRate = localInterestRate
    LoanTerm = localLoanTerm
    LoanType = localLoanType
    RehabCostPercent = localRehabCostPercent
    Upfront = localUpfront
    Recurring = localRecurring
  }

  //purchase & rehab
  //all kinds of rehab costs + overrun
  let rehabCombined = Number(rehabTotal);
  //overrun if any
  let overrunAmount = (Number(costOverrun) * Number(rehabTotal)) / 100;
  rehabCombined += Number(overrunAmount);

  //financing(purchase & rehab(if any))
  //Downpayment here is downpayment percentage
  let loanAmount = 0;
  if (DownPayment) {
    loanAmount += Number(purchasePrice) * ((100 - Number(DownPayment)) / 100);
  }
  let rehabFinancedAmount = 0;
  if (RehabCostPercent) {
    rehabFinancedAmount = (Number(RehabCostPercent) * rehabCombined) / 100;
  }
  loanAmount += rehabFinancedAmount;
  let amountFinanced = loanAmount;
  //down payment if financed
  let downPaymentCash = 0;
  let totalCashNeeded = 0;
  if (amountFinanced) {
    downPaymentCash = Number(purchasePrice) - amountFinanced;
  }
  if (RehabCostPercent) {
    downPaymentCash += rehabCombined;
  }
  //purchasetotal is purchase closing costs
  if (downPaymentCash) {
    if (RehabCostPercent) {
      totalCashNeeded = downPaymentCash + Number(purchaseTotal);
    } else {
      totalCashNeeded =
        downPaymentCash + Number(purchaseTotal) + Number(rehabCombined);
    }
  } else {
    totalCashNeeded =
      Number(purchasePrice) + Number(purchaseTotal) + Number(rehabCombined);
  }

  //mortgage insurance calculation
  let pmi = 0,
    mortgageUpfrontAmount = 0,
    mortgageRecurringAmount = 0;
  if (financeMortgageType !== "Single-Premium Mortgage Insurance") {
    mortgageRecurringAmount = (loanAmount * Number(Recurring)) / 1200;
  }
  if (financeMortgageType !== "Borrower-paid Mortgage Insurance(BPMI)") {
    mortgageUpfrontAmount = (loanAmount * Number(Upfront)) / 100;
  }
  pmi = mortgageRecurringAmount;
  totalCashNeeded += mortgageUpfrontAmount;

  let loanToCost = 0;
  if (RehabCostPercent) {
    //financing rehab cost
    loanToCost = (loanAmount * 100) / (Number(purchasePrice) + rehabCombined);
  } else {
    //not financing rehab cost
    loanToCost = (loanAmount * 100) / Number(purchasePrice);
  }
  loanToCost = loanToCost.toFixed(2);
  let loanToValue = (loanAmount / Number(ARV)) * 100;
  let loanPayment = 0;
  let rateOfInterest = Number(InterestRate) / 1200;
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanPayment = loanAmount * rateOfInterest;
    } else {
      //combines the principal+ interest + pmi(optional)
      loanPayment =
        (loanAmount * rateOfInterest) /
        (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      loanPayment += pmi;
    }
    loanPayment = Math.round(loanPayment);
  }

  //valuation
  let arvPerSq = Number(ARV) / Area;
  let pricePerSq = Number(purchasePrice) / Area;
  let rehabPerSq = Number(rehabTotal) / Area;

  let propertyTaxAmt = (Number(propertyTax) * Number(ARV)) / 1200;
  let insuranceAmt = Number(propertyInsurance) / 12;

  //holding costs
  let holdingCosts = 0,
    holdingLoanPayments = 0;
  //holding total is rehab recurring total which includes prop tax, insurance, itemized..
  holdingLoanPayments = loanPayment * Number(rehabPeriod);
  let recurringTotal =
    (Number(holdingTotal) + propertyTaxAmt + insuranceAmt) *
    Number(rehabPeriod);
  //holding costs for brrrr is different from flip..it doesn't include rehabcombined
  holdingCosts = recurringTotal + holdingLoanPayments;

  //rental calculations after refinance
  let otherIncomePerMonth = 0,
    operatingExpensePerMonth = 0;
  let GrossRentPerMonth = 0;
  const returnPerMonthRentals = () => {
    if (Period === "Per Day") {
      GrossRentPerMonth = Number(GrossRent) * 30;
      otherIncomePerMonth = Number(otherIncomeTotal) * 30;
      operatingExpensePerMonth = Number(operatingExpenseTotal) * 30;
    } else if (Period === "Per Week") {
      GrossRentPerMonth = Number(GrossRent) * 4;
      otherIncomePerMonth = Number(otherIncomeTotal) * 4;
      operatingExpensePerMonth = Number(operatingExpenseTotal) * 4;
    } else if (Period === "Per Month") {
      GrossRentPerMonth = Number(GrossRent);
      otherIncomePerMonth = Number(otherIncomeTotal);
      operatingExpensePerMonth = Number(operatingExpenseTotal);
    } else if (Period === "Per Quarter") {
      GrossRentPerMonth = Number(GrossRent) / 4.0;
      otherIncomePerMonth = Number(otherIncomeTotal) / 4.0;
      operatingExpensePerMonth = Number(operatingExpenseTotal) / 4.0;
    } else {
      GrossRentPerMonth = Number(GrossRent) / 12.0;
      otherIncomePerMonth = Number(otherIncomeTotal) / 12.0;
      operatingExpensePerMonth = Number(operatingExpenseTotal) / 12.0;
    }
  };
  returnPerMonthRentals();
  //only for 1st year
  let rentalPeriod = 12 - rehabPeriod;
  let AnnualRentalIncome = GrossRentPerMonth * 12;
  let VacancyExpense = (Number(AnnualRentalIncome) * Number(Vacancy)) / 100;
  let AnnualOtherIncome = otherIncomePerMonth * 12;
  let operatingIncome =
    Number(AnnualRentalIncome) - VacancyExpense + AnnualOtherIncome;
  let operatingExpenseCombined =
    12 * (operatingExpensePerMonth + propertyTaxAmt + insuranceAmt);
  //operatingExpensePerMonth includes prop tax, insurance pmo,itemized
  //..for the rental period
  let NOI = operatingIncome - Number(operatingExpenseCombined);

  //refinance calculations
  let refinanceLoanAmt = 0,
    refinanceLoanPayment = 0,
    purchaseRepayment = 0,
    refinanceLoanToValue = 0,
    netIncomeAfterRehab = 0,
    refinanceCashOut = 0,
    totalCashInvested = 0,
    refinancePmi = 0;
  //netIncomeAfterRehab is the total operating income - total loan payments during the period after rehab & before refinance
  netIncomeAfterRehab =
    (Number(NOI) / Number(rentalPeriod) - loanPayment) *
    Number(Number(refinanceTime) - Number(rehabPeriod));

  //refinance mortgage insurance calculation
  let mortgageRefUpfrontAmount = 0,
    mortgageRefRecurringAmount = 0;
  if (refinanceMortgageType !== "Single-Premium Mortgage Insurance") {
    mortgageRefRecurringAmount = (Number(refinanceLoanAmt) * Number(refinanceRecurring)) / 1200;
  } else if (
    refinanceMortgageType !== "Borrower-paid Mortgage Insurance(BPMI)"
  ) {
    mortgageRefUpfrontAmount = (Number(refinanceLoanAmt) * Number(refinanceUpfront)) / 100;
  }
  refinancePmi = mortgageRefRecurringAmount;

  let refInterestRate = Number(refinanceInterestRate) / 1200;
  if (refinanceLoanAmount) {
    refinanceLoanAmt = Number(refinanceLoanAmount);
  } else {
    refinanceLoanAmt = Number(ARV) - (Number(remainingEquity) * Number(ARV)) / 100;
  }
  if (refinanceLoanType === "Interest Only") {
    refinanceLoanPayment = refinanceLoanAmt * Number(refInterestRate);
  } else {
    refinanceLoanPayment =
      (refinanceLoanAmt * refInterestRate) /
      (1 - Math.pow(1 + refInterestRate, -12 * Number(refinanceLoanTerm)));
  }
  refinanceLoanPayment += Number(mortgageRefRecurringAmount);
  refinanceLoanToValue = (refinanceLoanAmt / Number(ARV)) * 100;
  let AnnualRefinanceLoanPayment = 12 * refinanceLoanPayment;

  //loan balance after refinance
  if (amountFinanced) {
    if (LoanType === "Interest Only") {
      purchaseRepayment = amountFinanced;
    } else {
      let loanBalanceLeft = amountFinanced;
      let intervals = Number(refinanceTime);
      let LoanPaymentPerMonth =
        (loanAmount * rateOfInterest) /
        (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      for (let i = 0; i < intervals; i++) {
        let ipmt = loanBalanceLeft * rateOfInterest;
        loanBalanceLeft -= LoanPaymentPerMonth;
        loanBalanceLeft += ipmt;
      }
      purchaseRepayment = loanBalanceLeft;
    }
  }
  refinanceCashOut =
    refinanceLoanAmt -
    Number(refinanceCostTotal) -
    purchaseRepayment -
    holdingCosts +
    netIncomeAfterRehab -
    mortgageRefUpfrontAmount;

  if (refinanceCashOut >= totalCashNeeded) {
    totalCashInvested = 0;
  } else {
    totalCashInvested = totalCashNeeded - refinanceCashOut;
  }


  //cash flow calculations
  //holding total is rehab recurring total which includes (prop tax, insurance) per month, itemized..
  let UnLeveredCashFlow = NOI;
  let LeveredCashFlow = UnLeveredCashFlow - AnnualRefinanceLoanPayment;

  //investment returns
  let propValue = Number(ARV) * (1 + Number(Appreciation) / 100);
  let totalEquity = Number(propValue);
  let loanBalance = 0;
  if (LoanType === "Interest Only") {
    loanBalance = refinanceLoanAmt - 12 * refinanceLoanAmt;
  } else {
    let pmt = Number(refinanceLoanAmt);
    let roi = Number(refinanceInterestRate) / 1200;
    let LoanPmtPerMonth =
      (Number(refinanceLoanAmt) * Number(roi)) /
      (1 - Math.pow(1 + Number(roi), -12 * Number(refinanceLoanTerm)));
    for (let i = 0; i < 12; i++) {
      let intPayment = pmt * Number(refInterestRate);
      pmt -= LoanPmtPerMonth;
      pmt += intPayment;
    }
    loanBalance = pmt;
  }
  totalEquity -= loanBalance;

  let capRate = (NOI * 100) / purchasePrice;
  let capRateMarket = (NOI * 100) / Number(ARV);
  let COC = (LeveredCashFlow * 100) / totalCashInvested;
  let ROE = (LeveredCashFlow * 100) / totalEquity;
  let sellingCostAmt = Number((SellingCosts * Number(propValue)) / 100);
  let ROI =
    ((totalEquity - sellingCostAmt + LeveredCashFlow - totalCashInvested) *
      100) /
    totalCashInvested;
  //irr to be calculated, considering pmi & finance rehab costs
  let IRR = 0;

  //financial ratios
  let rentToValue = (GrossRentPerMonth * 100) / Number(purchasePrice);
  let rentToValueYearEnd = (GrossRentPerMonth * 100) / Number(propValue);
  let GRM = Number(purchasePrice) / (12 * GrossRentPerMonth);
  let GRMYearEnd = Number(propValue) / (12 * GrossRentPerMonth);
  let equityMultiple =
    (totalEquity - sellingCostAmt + LeveredCashFlow) / totalCashInvested;
  let breakEvenRatio = 0,
    debtCoverageRatio = 0,
    debtYield = 0;
  breakEvenRatio =
    ((operatingExpenseCombined + AnnualRefinanceLoanPayment) * 100) /
    (12 * GrossRentPerMonth);
  debtCoverageRatio = NOI / AnnualRefinanceLoanPayment;
  debtYield = (NOI * 100) / refinanceLoanAmt;

  let is1Rule = false;
  let is2Rule = false;
  let is50Rule = false;
  let is70Rule = false;


  const percentRuleCalculate = () => {

    if (operatingExpenseCombined <= operatingIncome / 2) {
      is50Rule = true;
    }

    if ((GrossRentPerMonth / Number(purchasePrice)) >= 0.02) {
      is2Rule = true;
    }

    if ((GrossRentPerMonth / Number(purchasePrice)) >= 0.01) {
      is1Rule = true;
    }

    let totalPPandRC = Number(purchasePrice) + rehabCombined
    let arv70of = (ARV * 70) / 100;

    if (totalPPandRC <= arv70of) {
      is70Rule = true;
    }
  }

  percentRuleCalculate()



  //projection arrays

  //income projection
  //year 1 starts after refinance time
  let grossRentArray = [],
    otherIncomeArray = [],
    vacancyArray = [],
    operatingIncomeArray = [];
  grossRentArray.push(GrossRentPerMonth * 12);
  otherIncomeArray.push(otherIncomePerMonth * 12);
  let inc = 1 + Number(IncomeIncrease) / 100;
  for (let i = 1; i < refinanceLoanTerm; i++) {
    grossRentArray.push(grossRentArray[i - 1] * inc);
    otherIncomeArray.push(otherIncomeArray[i - 1] * inc);
  }
  let dec = Number(Vacancy) / 100;
  for (let i = 0; i < refinanceLoanTerm; i++) {
    vacancyArray.push(grossRentArray[i] * dec);
  }
  for (let i = 0; i < refinanceLoanTerm; i++) {
    operatingIncomeArray.push(
      grossRentArray[i] - vacancyArray[i] + otherIncomeArray[i]
    );
  }

  //expense projection
  let ExpenseArray = [];
  ExpenseData.forEach((data) => {
    let val = Number(data.value);
    let temp = [];
    temp.push(val * 12);
    let x = 1 + Number(ExpenseIncrease) / 100;
    for (let i = 1; i < refinanceLoanTerm; i++) {
      temp[i] = temp[i - 1] * x;
    }
    // temp[0] = (rentalPeriod * temp[0]) / 12;
    for (let i = 0; i < refinanceLoanTerm; i++) {
      temp[i] = temp[i];
    }
    ExpenseArray.push(temp);
  });
  let operatingExpenseArray = [];
  for (let i = 0; i < refinanceLoanTerm; i++) {
    let sum = 0;
    ExpenseArray.forEach((arr) => {
      sum += Number(arr[i]);
    });
    operatingExpenseArray.push(sum);
  }

  //cash flow projection
  let NOIArray = [],
    recurringTotalArray = [],
    UnleveredCashFlowArray = [],
    loanPaymentArray = [],
    LeveredCashFlowArray = [],
    postTaxCashFlowArray = [];
  recurringTotalArray.push(recurringTotal);
  loanPaymentArray.push(AnnualRefinanceLoanPayment);
  for (let i = 1; i < refinanceLoanTerm; i++) {
    recurringTotalArray[i] = 0;
    loanPaymentArray[i] = loanPaymentArray[i - 1];
  }
  for (let i = 0; i < refinanceLoanTerm; i++) {
    NOIArray[i] = operatingIncomeArray[i] - operatingExpenseArray[i];
    UnleveredCashFlowArray[i] = NOIArray[i];
    LeveredCashFlowArray[i] = UnleveredCashFlowArray[i] - loanPaymentArray[i];
    postTaxCashFlowArray.push(
      LeveredCashFlowArray[i] * (1 - Number(taxRate) / 100)
    );
  }

  //tax benefits & deductions
  let loanInterestArray = [],
    loanBalanceArray = [],
    depreciationArray = [],
    totalDeductionArray = [];
  let intervals = 12 * Number(refinanceLoanTerm);
  if (refinanceLoanType === "Interest Only") {
    for (let i = 0; i < refinanceLoanTerm; i++) {
      loanInterestArray.push(refinanceLoanPayment);
    }
  } else {
    //amortization schedule of the entire thing
    let loanBalanceLeft = Number(refinanceLoanAmt);
    let LoanPaymentPerMonth =
      (Number(refinanceLoanAmt) * Number(refInterestRate)) /
      (1 -
        Math.pow(1 + Number(refInterestRate), -12 * Number(refinanceLoanTerm)));
    let interestSum = 0;
    for (let i = 0; i < intervals; i++) {
      let ipmt = loanBalanceLeft * Number(refInterestRate);
      interestSum += ipmt;
      loanBalanceLeft -= LoanPaymentPerMonth;
      loanBalanceLeft += ipmt;
      if ((i + 1) % 12 == 0) {
        loanInterestArray.push(interestSum);
        loanBalanceArray.push(loanBalanceLeft);
        interestSum = 0;
      }
    }
  }
  let depreciationValue = (Number(purchasePrice) -
    Number(LandValue) +
    Number(purchaseTotal) +
    Number(rehabCombined)) /
    Number(DepreciationPeriod);

  for (let i = 0; i < refinanceLoanTerm; i++) {
    if (i <= Number(DepreciationPeriod) - 1) {
      depreciationArray.push(depreciationValue);
    } else {
      depreciationArray.push(0);
    }
  }
  for (let i = 0; i < refinanceLoanTerm; i++) {
    totalDeductionArray.push(
      operatingExpenseArray[i] + loanInterestArray[i] + depreciationArray[i]
    );
  }

  //equity accumulation
  let propertyValueArray = [],
    totalEquityArray = [];
  let x = 1 + Number(Appreciation) / 100;
  propertyValueArray.push(Number(ARV) * x);
  for (let i = 1; i < refinanceLoanTerm; i++) {
    propertyValueArray[i] = propertyValueArray[i - 1] * x;
  }
  for (let i = 0; i < refinanceLoanTerm; i++) {
    totalEquityArray[i] = propertyValueArray[i] - loanBalanceArray[i];
  }

  //sale analysis
  let sellingCostsArray = [],
    saleProceedsArray = [],
    cumulativeCashFlowArray = [],
    totalCashInvestedArray = [],
    totalProfitArray = [];
  for (let i = 0; i < refinanceLoanTerm; i++) {
    sellingCostsArray[i] = (Number(SellingCosts) * propertyValueArray[i]) / 100;
    saleProceedsArray[i] = totalEquityArray[i] - sellingCostsArray[i];
    if (i == 0) {
      cumulativeCashFlowArray.push(LeveredCashFlowArray[0]);
    } else {
      cumulativeCashFlowArray[i] =
        cumulativeCashFlowArray[i - 1] + LeveredCashFlowArray[i];
    }
    totalCashInvestedArray.push(totalCashInvested);
    totalProfitArray[i] =
      saleProceedsArray[i] +
      cumulativeCashFlowArray[i] -
      totalCashInvestedArray[i];
  }

  //investment returns
  //to be calculated
  let capRatePurchaseArray = [],
    capRateMarketArray = [],
    COCArray = [],
    ROEArray = [],
    ROIArray = [],
    UnleveredIRRArray = [],
    LeveredIRRArray = [];

  let UnleveredCashFeedArray = [],
    LeveredCashFeedArray = []; //for newton raphson evaluation
  UnleveredCashFeedArray.push(-Number(totalCashInvested));
  LeveredCashFeedArray.push(-Number(totalCashInvested));
  for (let i = 0; i < refinanceLoanTerm; i++) {
    capRatePurchaseArray.push((NOIArray[i] / Number(purchasePrice)) * 100);
    capRateMarketArray.push((NOIArray[i] / propertyValueArray[i]) * 100);
    COCArray.push((LeveredCashFlowArray[i] / totalCashInvestedArray[i]) * 100);
    ROEArray.push((LeveredCashFlowArray[i] / totalEquityArray[i]) * 100);
    ROIArray.push(
      ((totalEquityArray[i] -
        sellingCostsArray[i] +
        cumulativeCashFlowArray[i] -
        totalCashInvestedArray[i]) *
        100.0) /
      totalCashInvestedArray[i]
    );
    let lastYearTotal =
      Number(UnleveredCashFlowArray[i]) +
      Number(saleProceedsArray[i]) +
      Number(loanBalanceArray[i]);
    UnleveredCashFeedArray.push(lastYearTotal);
    lastYearTotal =
      Number(LeveredCashFlowArray[i]) + Number(saleProceedsArray[i]);
    LeveredCashFeedArray.push(lastYearTotal);
    let irrUnlevered = NewtonRaphson(UnleveredCashFeedArray, 0.1);
    let irrLevered = NewtonRaphson(LeveredCashFeedArray, 0.1);
    if (refinanceCashOut >= totalCashNeeded) {
      UnleveredIRRArray.push(1 / 0);
      LeveredIRRArray.push(1 / 0);
    } else {
      UnleveredIRRArray.push(irrUnlevered * 100.0);
      LeveredIRRArray.push(irrLevered * 100.0);
    }
    //for the next iteration
    UnleveredCashFeedArray.pop();
    LeveredCashFeedArray.pop();
    UnleveredCashFeedArray.push(UnleveredCashFlowArray[i]);
    LeveredCashFeedArray.push(LeveredCashFlowArray[i]);
  }

  //financial ratios
  let rentToValueArray = [],
    GRMArray = [],
    EquityMultipleArray = [],
    breakEvenRatioArray = [],
    debtCoverageRatioArray = [],
    debtYieldArray = [];
  for (let i = 0; i < refinanceLoanTerm; i++) {
    rentToValueArray[i] =
      (grossRentArray[i] * 100) / (propertyValueArray[i] * 12);
    GRMArray[i] = propertyValueArray[i] / grossRentArray[i];
    EquityMultipleArray[i] =
      (totalEquityArray[i] -
        sellingCostsArray[i] +
        cumulativeCashFlowArray[i]) /
      totalCashInvested;
    breakEvenRatioArray[i] =
      ((operatingExpenseArray[i] + loanPaymentArray[i]) * 100) /
      grossRentArray[i];
    debtCoverageRatioArray[i] = NOIArray[i] / loanPaymentArray[i];
    debtYieldArray[i] = (NOIArray[i] * 100) / refinanceLoanAmt;
  }

  for (let i = 0; i < refinanceLoanTerm; i++) {
    grossRentArray[i] = grossRentArray[i];
    otherIncomeArray[i] = otherIncomeArray[i];
    vacancyArray[i] = vacancyArray[i];
    operatingIncomeArray[i] = operatingIncomeArray[i];
    operatingExpenseArray[i] = operatingExpenseArray[i];
    NOIArray[i] = NOIArray[i];
    propertyValueArray[i] = propertyValueArray[i];
    totalEquityArray[i] = totalEquityArray[i];
    UnleveredCashFlowArray[i] = UnleveredCashFlowArray[i];
    LeveredCashFlowArray[i] = LeveredCashFlowArray[i];
    postTaxCashFlowArray[i] = postTaxCashFlowArray[i];
    sellingCostsArray[i] = sellingCostsArray[i];
    saleProceedsArray[i] = saleProceedsArray[i];
    cumulativeCashFlowArray[i] = cumulativeCashFlowArray[i];
    sellingCostsArray[i] = Number(sellingCostsArray[i]);
    saleProceedsArray[i] = Number(saleProceedsArray[i]);
    cumulativeCashFlowArray[i] = Number(cumulativeCashFlowArray[i]);
    totalCashInvestedArray[i] = Number(totalCashInvestedArray[i]);
    totalProfitArray[i] = totalProfitArray[i];
  }

  let calculatedMonthlyCashFlow = parseFloat(LeveredCashFlow) / 12
  let calculatedIRR = LeveredIRRArray[0]

  totalCashInvested = Number(totalCashInvested);

  const finalobj = {
    purchasePrice,
    calculatedIRR,
    calculatedMonthlyCashFlow,
    rehabCombined,
    amountFinanced,
    downPaymentCash,
    loanPayment,
    totalCashNeeded,
    propertyTaxAmt,
    loanToCost,
    loanToValue,
    pmi,
    mortgageUpfrontAmount,
    mortgageRecurringAmount,
    arvPerSq,
    pricePerSq,
    rehabPerSq,
    recurringTotal,
    holdingLoanPayments,
    holdingCosts,
    netIncomeAfterRehab,
    refinanceLoanAmt,
    refinanceLoanPayment,
    AnnualRefinanceLoanPayment,
    refinancePmi,
    mortgageRefUpfrontAmount,
    mortgageRefRecurringAmount,
    purchaseRepayment,
    refinanceCashOut,
    totalCashInvested,
    refinanceLoanToValue,
    AnnualRentalIncome,
    GrossRentPerMonth,
    VacancyExpense,
    AnnualOtherIncome,
    operatingIncome,
    operatingExpenseCombined,
    NOI,
    UnLeveredCashFlow,
    LeveredCashFlow,
    capRate,
    capRateMarket,
    COC,
    ROE,
    ROI,
    rentToValue,
    rentToValueYearEnd,
    GRM,
    GRMYearEnd,
    equityMultiple,
    breakEvenRatio,
    debtCoverageRatio,
    debtYield,
    grossRentArray,
    otherIncomeArray,
    vacancyArray,
    operatingIncomeArray,
    ExpenseArray,
    operatingExpenseArray,
    NOIArray,
    recurringTotalArray,
    UnleveredCashFlowArray,
    loanPaymentArray,
    LeveredCashFlowArray,
    postTaxCashFlowArray,
    loanInterestArray,
    depreciationArray,
    totalDeductionArray,
    propertyValueArray,
    loanBalanceArray,
    totalEquityArray,
    sellingCostsArray,
    saleProceedsArray,
    cumulativeCashFlowArray,
    totalCashInvestedArray,
    totalProfitArray,
    rentToValueArray,
    GRMArray,
    EquityMultipleArray,
    breakEvenRatioArray,
    debtCoverageRatioArray,
    debtYieldArray,
    capRatePurchaseArray,
    capRateMarketArray,
    COCArray,
    ROEArray,
    ROIArray,
    UnleveredIRRArray,
    LeveredIRRArray,
    is1Rule,
    is2Rule,
    is50Rule,
    is70Rule
  };
  console.log(finalobj);

  return finalobj;
};

export default BRRRRCalcuations;
