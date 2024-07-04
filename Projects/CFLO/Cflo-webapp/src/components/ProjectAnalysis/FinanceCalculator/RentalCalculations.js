import NewtonRaphson from "./NewtonRaphson";

const RentalCalcuations = (
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
    isFinancing,
    DownPayment: localDownPayment,
    InterestRate: localInterestRate,
    LoanTerm: localLoanTerm,
    rehabPeriod,
    RehabCostPercent: localRehabCostPercent,
    financeMortgageType,
    Upfront: localUpfront,
    Recurring: localRecurring,
    purchaseTotal,
    rehabTotal,
    costOverrun,
    holdingTotal,
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
  } else {
    LoanTerm = 30;
  }


  //purchase & rehab -------------------------------------------------------- start

  let rehabCombined = Number(rehabTotal);
  //overrun if any
  let overrunAmount = (Number(costOverrun) * Number(rehabTotal)) / 100;
  rehabCombined += Number(overrunAmount);
  //*******/ (2) Final Rehab Cost = (rehab capital cost + cost overrun)


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
  //*******/ (3) Final Amount Financed = (loan Amount + Rehab financed Amount) => loan Amount = (purchase Price - downpayment) && rehab financed amount = (1)Final Rehab Cost * (rehabCostParcentage/100)


  let downPaymentCash = 0;
  let totalCashNeeded = 0;
  if (amountFinanced) {
    downPaymentCash = Number(purchasePrice) - amountFinanced;
  }
  // adding the rehabCost if rehabCost Present
  if (RehabCostPercent) {
    downPaymentCash += rehabCombined;
  }
  //*******/ (4) Down Payment = PurchasePrice + RehabCost - Amount Financed


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
    mortgageRecurringAmount = (Number(amountFinanced) * Number(Recurring)) / 1200;
  }

  if (financeMortgageType !== "Borrower-paid Mortgage Insurance(BPMI)") {
    mortgageUpfrontAmount = (Number(amountFinanced) * Number(Upfront)) / 100;
  }
  //*******/ (6) Final mortgageUpfrontAmount = (amountFinanced * Upfront/100)
  // Final mortgageUpfrontAmount = (amountFinanced * Recurring/100) / 12

  // the above condition is if Single-Premium-Mortgage-Insurance then calculate only mortgageUpFrontAmount
  // then if Borrower-paid Mortgage Insurance(BPMI) then calculate only mortgageRecurringAmount
  // and if Split-Premium-Mortgage-Insurance then calculate both mortgageUpFrontAmount && mortgageRecurringAmount

  pmi = mortgageRecurringAmount;
  totalCashNeeded += mortgageUpfrontAmount;

  //*******/ (7) Final totalCashNeeded = (DownPayment + PurchaseCost + MortgageUpfront)

  //purchase & rehab -------------------------------------------------------------- End



  //Financing(purchase) -------------------------------------------------------------- Start



  let loanToCost = 0;
  if (RehabCostPercent) {
    //financing rehab cost
    loanToCost = loanAmount / (Number(purchasePrice) + rehabCombined);
  } else {
    //not financing rehab cost
    loanToCost = loanAmount / Number(purchasePrice);
  }
  loanToCost = loanToCost * 100.0;
  //*******/ (2) Final LoanToCost = (loanAmount / purchasePrice + rehabCombined)*100


  let loanToValue = (loanAmount / Number(ARV)) * 100;
  //*******/ (3) Final LoanToValue = (loanAmount / AterRepairValue)*100

  //Financing(purchase) ------------------------------------------------------------------- End


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
      console.log(loanPayment);
      loanPayment += pmi;
      console.log(pmi);
    }
  }
  //Loan EMI

  let AnnualLoanPayment = 12 * loanPayment;
  // Annual Loan Payment

  //Valuation --------------------------------------------------------------------- Start 
  let arvPerSq = Number(ARV) / Area;
  let pricePerSq = Number(purchasePrice) / Area;
  // let rehabPerSq = Number(rehabTotal) / Area;
  let rehabPerSq = Number(rehabCombined) / Area;
  //Valuation --------------------------------------------------------------------- End




  //Cash Flow --------------------------------------------------------------------- Start
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
  let propertyTaxAmt = (Number(propertyTax) * Number(ARV)) / 1200;
  let insuranceAmt = Number(propertyInsurance) / 12;
  let rentalPeriod = 12 - rehabPeriod;

  let AnnualRentalIncome = GrossRentPerMonth * rentalPeriod;
  //*******/ (1) Gross Rent or AnnualRentalIncome = ( GrossRentPerMonth * rentalPeriod ) => rentalPeriod = (12 - rehabPeriod)


  let VacancyExpense = (Number(AnnualRentalIncome) * Number(Vacancy)) / 100;
  //*******/ (2) Vacancy = (AnnualRentalIncome * Vacancy) / 100

  let AnnualOtherIncome = otherIncomePerMonth * rentalPeriod;
  //*******/ (3) Other Income = (otherIncomePerMonth * rentalPeriod ) / 100

  let operatingIncome = Number(AnnualRentalIncome) - VacancyExpense + AnnualOtherIncome;
  //*******/ (4) Operating_Income = (AnnualRentalIncome + AnnualOtherIncome - VacancyExpense) 

  let operatingExpenseCombined = rentalPeriod * (operatingExpensePerMonth + propertyTaxAmt + insuranceAmt);
  //*******/ (5) Operating_expense = (operatingExpensePerMonth + propertyTaxAmt + insuranceAmt) * rentalPeriod


  //holding total is rehab recurring total which includes (prop tax, insurance) per month, itemized..
  //expenses at the time of rehabPeriod
  let recurringTotal = (Number(holdingTotal) + propertyTaxAmt + insuranceAmt) * Number(rehabPeriod);
  //*******/ (6) recurringTotal or TotalRehabOperatingCost = 
  //(holdingTotal + propertyTaxAmt + insuranceAmt) * rentalPeriod


  //operatingExpensePerMonth includes prop tax, insurance pmo,itemized
  //..for the rental period
  let NOI = operatingIncome - Number(operatingExpenseCombined) - Number(recurringTotal);
  //*******/ (7) NOI or Net Operating Income =  operatingIncome -operatingExpenseCombined - recurringTotal

  //Cash Flow --------------------------------------------------------------------- Start

  let UnLeveredCashFlow = NOI;
  let LeveredCashFlow = UnLeveredCashFlow - loanPayment * 12;

  //Investment Returns ------------------------------------------------------------- Start
  let propValue = Number(ARV) * (1 + Number(Appreciation) / 100);
  let totalEquity = Number(propValue);


  let loanBalance = 0;
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanBalance = loanAmount - 12 * loanPayment;
    } else {

      // previous code to calculate compound interest
      // let pmt = Number(loanAmount);
      // for (let i = 0; i < 12; i++) {
      //   let currPayment =
      //     (pmt * rateOfInterest) /
      //     (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      //   pmt -= currPayment;
      // }

      let loanBalanceLeft = Number(loanAmount);
      let LoanPaymentPerMonth = (Number(loanAmount) * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));

      for (let i = 0; i < 12; i++) {
        let ipmt = loanBalanceLeft * rateOfInterest;
        loanBalanceLeft -= LoanPaymentPerMonth;
        loanBalanceLeft += ipmt;
      }

      loanBalance = loanBalanceLeft;
    }
  }



  console.log("loanBalance", loanBalance);

  totalEquity -= loanBalance;




  let capRate = (NOI * 100) / purchasePrice;
  let capRateMarket = (NOI * 100) / Number(ARV);
  let COC = (LeveredCashFlow * 100) / totalCashNeeded;

  let ROE = (LeveredCashFlow * 100) / totalEquity;


  console.log("LC", LeveredCashFlow)
  console.log("TE", totalEquity)
  console.log("ROE", ROE)


  let sellingCostAmt = Number((SellingCosts * propValue) / 100);
  let ROI =
    ((totalEquity + LeveredCashFlow - sellingCostAmt - totalCashNeeded) * 100) /
    totalCashNeeded;
  //irr to be calculated, considering pmi & finance rehab costs
  let IRR = 0;

  //Investment Returns ------------------------------------------------------------- End



  //Financial Ratios ---------------------------------------------------------------- start
  let rentToValue = (GrossRentPerMonth * 100) / Number(purchasePrice);
  let rentToValueYearEnd = (GrossRentPerMonth * 100) / Number(propValue);

  let GRM = Number(purchasePrice) / (Number(rentalPeriod) * GrossRentPerMonth);
  let GRMYearEnd =
    Number(propValue) / (Number(rentalPeriod) * GrossRentPerMonth);
  let equityMultiple =
    (totalEquity - sellingCostAmt + LeveredCashFlow) / totalCashNeeded;
  let breakEvenRatio = 0,
    debtCoverageRatio = 0,
    debtYield = 0;
  breakEvenRatio =
    ((operatingExpenseCombined + loanPayment * Number(rentalPeriod)) * 100) /
    (Number(rentalPeriod) * GrossRentPerMonth);
  debtCoverageRatio = NOI / (12 * loanPayment);
  debtYield = (NOI * 100) / loanAmount;

  //Financial Ratios ---------------------------------------------------------------- End


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
  let grossRentArray = [],
    otherIncomeArray = [],
    vacancyArray = [],
    operatingIncomeArray = [];
  grossRentArray.push(GrossRentPerMonth * 12);
  otherIncomeArray.push(otherIncomePerMonth * 12);
  let inc = 1 + Number(IncomeIncrease) / 100;
  for (let i = 1; i < LoanTerm; i++) {
    grossRentArray.push(grossRentArray[i - 1] * inc);
    otherIncomeArray.push(otherIncomeArray[i - 1] * inc);
  }
  //first year, we have no income during rehab period
  grossRentArray[0] = GrossRentPerMonth * rentalPeriod;
  otherIncomeArray[0] = otherIncomePerMonth * rentalPeriod;
  let dec = Number(Vacancy) / 100;
  for (let i = 0; i < LoanTerm; i++) {
    vacancyArray.push(grossRentArray[i] * dec);
  }
  for (let i = 0; i < LoanTerm; i++) {
    operatingIncomeArray.push(
      grossRentArray[i] - vacancyArray[i] + otherIncomeArray[i]
    );
  }

  //expense projection
  let ExpenseArray = [],
    recurringTotalArray = [];
  recurringTotalArray.push(recurringTotal);
  for (let i = 1; i < LoanTerm; i++) {
    recurringTotalArray[i] = 0;
  }
  ExpenseData.forEach((data) => {
    let val = Number(data.value);
    let temp = [];
    temp.push(val * 12);
    let x = 1 + Number(ExpenseIncrease) / 100;
    for (let i = 1; i < LoanTerm; i++) {
      temp[i] = temp[i - 1] * x;
    }
    //first year has operating expense(itemized things, property tax, insurance) only for the rental period
    temp[0] = (rentalPeriod * temp[0]) / 12;
    for (let i = 0; i < LoanTerm; i++) {
      temp[i] = temp[i];
    }
    ExpenseArray.push(temp);
  });
  let operatingExpenseArray = [];
  for (let i = 0; i < LoanTerm; i++) {
    let sum = 0;
    ExpenseArray.forEach((arr) => {
      sum += Number(arr[i]);
    });
    sum += Number(recurringTotalArray[i]);
    operatingExpenseArray.push(sum);
  }

  //cash flow projection
  let NOIArray = [],
    UnleveredCashFlowArray = [],
    loanPaymentArray = [],
    LeveredCashFlowArray = [],
    postTaxCashFlowArray = [];
  loanPaymentArray.push(loanPayment * 12);
  for (let i = 1; i < LoanTerm; i++) {
    loanPaymentArray[i] = loanPaymentArray[i - 1];
  }
  for (let i = 0; i < LoanTerm; i++) {
    NOIArray[i] = operatingIncomeArray[i] - operatingExpenseArray[i];
    UnleveredCashFlowArray[i] = NOIArray[i];
    LeveredCashFlowArray[i] = UnleveredCashFlowArray[i] - loanPaymentArray[i];
    postTaxCashFlowArray.push(
      LeveredCashFlowArray[i] * (1 - Number(taxRate) / 100));
  }

  //tax benefits & deductions
  let loanInterestArray = [],
    loanBalanceArray = [],
    depreciationArray = [],
    totalDeductionArray = [];
  let intervals = 12 * Number(LoanTerm);
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      for (let i = 0; i < LoanTerm; i++) {
        loanInterestArray.push(loanPayment);
        loanBalanceArray.push(Number(loanAmount));
      }
    } else {
      //amortization schedule of the entire thing
      let loanBalanceLeft = amountFinanced;
      let LoanPaymentPerMonth =
        (loanAmount * rateOfInterest) /
        (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      let interestSum = 0;
      for (let i = 0; i < intervals; i++) {
        let ipmt = loanBalanceLeft * rateOfInterest;
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
  } else {
    for (let i = 0; i < LoanTerm; i++) {
      loanInterestArray.push(0);
      loanBalanceArray.push(0);
    }
  }
  let depreciationValue = (Number(purchasePrice) -
    Number(LandValue) +
    Number(purchaseTotal) +
    Number(rehabCombined)) /
    Number(DepreciationPeriod);

  for (let i = 0; i < LoanTerm; i++) {
    if (i <= Number(DepreciationPeriod) - 1) {
      depreciationArray.push(depreciationValue);
    } else {
      depreciationArray.push(0);
    }
  }
  for (let i = 0; i < LoanTerm; i++) {
    totalDeductionArray.push(
      operatingExpenseArray[i] + loanInterestArray[i] + depreciationArray[i]
    );
  }

  //equity accumulation
  let propertyValueArray = [],
    totalEquityArray = [];
  let x = 1 + Number(Appreciation) / 100;
  propertyValueArray.push(Number(ARV) * x);
  for (let i = 1; i < LoanTerm; i++) {
    propertyValueArray[i] = propertyValueArray[i - 1] * x;
  }

  for (let i = 0; i < LoanTerm; i++) {
    totalEquityArray[i] = propertyValueArray[i] - loanBalanceArray[i];
  }

  //sale analysis
  let sellingCostsArray = [],
    saleProceedsArray = [],
    cumulativeCashFlowArray = [],
    totalCashInvestedArray = [],
    totalProfitArray = [];
  for (let i = 0; i < LoanTerm; i++) {
    sellingCostsArray[i] = (Number(SellingCosts) * propertyValueArray[i]) / 100;
    saleProceedsArray[i] = totalEquityArray[i] - sellingCostsArray[i];
    if (i == 0) {
      cumulativeCashFlowArray.push(LeveredCashFlowArray[0]);
    } else {
      cumulativeCashFlowArray[i] =
        cumulativeCashFlowArray[i - 1] + LeveredCashFlowArray[i];
    }
    totalCashInvestedArray.push(totalCashNeeded);
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
  //downpayment to be added to totalcashneeded
  UnleveredCashFeedArray.push(
    -Number(totalCashNeeded) - Number(amountFinanced)
  );
  LeveredCashFeedArray.push(-Number(totalCashNeeded));
  for (let i = 0; i < LoanTerm; i++) {
    capRatePurchaseArray.push((NOIArray[i] / Number(purchasePrice)) * 100);
    capRateMarketArray.push((NOIArray[i] / propertyValueArray[i]) * 100);
    COCArray.push((LeveredCashFlowArray[i] / totalCashInvestedArray[i]) * 100);
    ROEArray.push((LeveredCashFlowArray[i] / totalEquityArray[i]) * 100);
    ROIArray.push(
      ((totalEquityArray[i] -
        sellingCostsArray[i] +
        cumulativeCashFlowArray[i] -
        totalCashInvestedArray[i]) /
        totalCashInvestedArray[i]) *
      100
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
    UnleveredIRRArray.push(irrUnlevered * 100.0);
    LeveredIRRArray.push(irrLevered * 100.0);
    // console.log(lastYearTotal + " " + irrLevered);
    //for the next iteration
    UnleveredCashFeedArray.pop();
    LeveredCashFeedArray.pop();
    UnleveredCashFeedArray.push(UnleveredCashFlowArray[i]);
    LeveredCashFeedArray.push(LeveredCashFlowArray[i]);
  }

  // console.log(UnleveredIRRArray);
  // console.log(LeveredIRRArray);

  //financial ratios
  let rentToValueArray = [],
    GRMArray = [],
    EquityMultipleArray = [],
    breakEvenRatioArray = [],
    debtCoverageRatioArray = [],
    debtYieldArray = [];
  for (let i = 0; i < LoanTerm; i++) {
    rentToValueArray[i] =
      (grossRentArray[i] * 100) / (propertyValueArray[i] * 12);
    GRMArray[i] = propertyValueArray[i] / grossRentArray[i];
    EquityMultipleArray[i] =
      (totalEquityArray[i] -
        sellingCostsArray[i] +
        cumulativeCashFlowArray[i]) /
      totalCashNeeded;
    breakEvenRatioArray[i] =
      ((operatingExpenseArray[i] + loanPaymentArray[i]) * 100) /
      grossRentArray[i];
    if (loanPaymentArray[i]) {
      debtCoverageRatioArray[i] = NOIArray[i] / loanPaymentArray[i];
    } else {
      debtCoverageRatioArray[i] = "-";
    }
    if (loanAmount) {
      debtYieldArray[i] = (NOIArray[i] * 100) / loanAmount;
    } else {
      debtYieldArray[i] = "-";
    }
  }

  for (let i = 0; i < LoanTerm; i++) {
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
    totalProfitArray[i] = totalProfitArray[i];
    if (debtCoverageRatioArray[i] != "-") {
      debtCoverageRatioArray[i] = debtCoverageRatioArray[i];
    }
    if (debtYieldArray[i] != "-") {
      debtYieldArray[i] = debtYieldArray[i];
    }
  }

  let calculatedMonthlyCashFlow = parseFloat(LeveredCashFlow) / 12
  let calculatedIRR = LeveredIRRArray[0]

  const finalobj = {
    purchasePrice,
    calculatedIRR,
    calculatedMonthlyCashFlow,
    rehabCombined,
    amountFinanced,
    downPaymentCash,
    loanPayment,
    AnnualLoanPayment,
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
    AnnualRentalIncome,
    GrossRentPerMonth,
    VacancyExpense,
    AnnualOtherIncome,
    operatingIncome,
    operatingExpenseCombined,
    NOI,
    recurringTotal,
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

export default RentalCalcuations;

//loan balance wrong evaluation
// if (LoanType === "Interest Only") {
//   for (let i = 0; i < intervals; i++) {
//     if ((i + 1) % 12 == 0) {
//       loanBalanceArray.push(Math.round(Number(loanAmount)));
//     }
//   }
// } else {
//   for (let i = 0; i < intervals; i++) {
//     let loanBal = 0;
//     let roi = Number(InterestRate) / 1200;
//     let lp = Number(loanPayment);
//     let lamt = Number(loanAmount);
//     loanBal =
//       Number(lamt) * Math.pow(1 + roi, 12 * (i + 1)) -
//       (Number(lp) * (Math.pow(1 + roi, 12 * (i + 1)) - 1)) / roi;
//     if ((i + 1) % 12 == 0) {
//       loanBalanceArray.push(Math.round(loanBal));
//     }
//   }
// }
