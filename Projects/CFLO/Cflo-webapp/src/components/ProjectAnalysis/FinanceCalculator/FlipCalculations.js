import NewtonRaphson from "./NewtonRaphson";

const FlipCalculations = (
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
    rehabPeriod,
    rentalPeriod,
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
    sellingPrice,
    sellingCostTotal,
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

  let itr = Number(rehabPeriod);
  if (Number(rentalPeriod)) {
    itr = itr + Number(rentalPeriod);
  }

  itr = itr + 4;


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
      totalCashNeeded = downPaymentCash + Number(purchaseTotal) + Number(rehabCombined);
    }
  } else {
    totalCashNeeded = Number(purchasePrice) + Number(purchaseTotal) + Number(rehabCombined);
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
    loanToCost = loanAmount / Number(purchasePrice);
  }
  let loanToValue = (loanAmount / Number(ARV)) * 100;
  let loanPayment = 0;
  let rateOfInterest = Number(InterestRate) / 1200;
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanPayment = loanAmount * rateOfInterest;
    } else {
      //combines the principal+ interest + pmi(optional)
      loanPayment = (loanAmount * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      loanPayment += pmi;
    }
  }

  //valuation
  let arvPerSq = Number(ARV) / Area;
  let pricePerSq = Number(purchasePrice) / Area;
  let rehabPerSq = Number(rehabTotal) / Area;
  let propertyTaxAmt = (Number(ARV) * Number(propertyTax)) / 1200;
  let insuranceAmt = Number(propertyInsurance) / 12;

  //holding costs
  let holdingPeriod = 0;
  if (rehabPeriod) holdingPeriod += Number(rehabPeriod);
  if (rentalPeriod) holdingPeriod += Number(rentalPeriod);
  let holdingCosts = 0, holdingLoanPayments = 0;
  holdingLoanPayments = Number(loanPayment) * Number(rehabPeriod);
  let recurringTotal = (Number(holdingTotal) + propertyTaxAmt + insuranceAmt) * Number(rehabPeriod);
  holdingCosts = recurringTotal + holdingLoanPayments;

  //sale & profit
  let saleProceeds = 0, loanRepayment = 0, profitFlip = 0;
  if (Number(rentalPeriod) !== 0) {
    saleProceeds = Number(sellingPrice) - Number(sellingCostTotal);
  } else {
    saleProceeds = Number(ARV) - Number(sellingCostTotal);
  }
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanRepayment = loanAmount;
    } else {
      let loanBalanceLeft = amountFinanced;
      let intervals = Number(holdingPeriod);
      let LoanPaymentPerMonth = (loanAmount * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      for (let i = 0; i < intervals; i++) {
        let ipmt = loanBalanceLeft * rateOfInterest;
        loanBalanceLeft -= LoanPaymentPerMonth;
        loanBalanceLeft += ipmt;
      }
      loanRepayment = loanBalanceLeft;
    }
  }
  profitFlip = saleProceeds - loanRepayment - holdingCosts - totalCashNeeded;

  let otherIncomePerMonth = 0, operatingExpensePerMonth = 0, GrossRentPerMonth = 0;
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
  let totalRentalIncome = GrossRentPerMonth * Number(rentalPeriod);
  let totalOtherIncome = otherIncomePerMonth * Number(rentalPeriod);
  let VacancyExpense = (Number(totalRentalIncome) * Number(Vacancy)) / 100;
  let totalOperatingExpense = operatingExpensePerMonth * Number(rentalPeriod);
  let holdingIncome = totalRentalIncome - VacancyExpense + totalOtherIncome - totalOperatingExpense - loanPayment * Number(rentalPeriod);
  profitFlip += holdingIncome;

  //investment returns
  let ROI = 0, annualizedROI = 0, cashMultiple = 0, IRR = 0;
  cashMultiple = Number(profitFlip) / Number(totalCashNeeded + holdingCosts);
  ROI = cashMultiple * 100;
  annualizedROI = (12 * ROI) / Number(holdingPeriod);
  let rentalPeriodIncome = totalRentalIncome - VacancyExpense + totalOtherIncome - totalOperatingExpense;
  let rentalPeriodIncomePMO = rentalPeriodIncome / Number(rentalPeriod);

  //IRR to be calculated
  let is1Rule = false;
  let is2Rule = false;
  let is50Rule = false;
  let is70Rule = false;

  const percentRuleCalculate = () => {
    let totalPPandRC = Number(purchasePrice) + rehabCombined
    let arv70of = (ARV * 70) / 100;
    if (totalPPandRC <= arv70of) {
      is70Rule = true;
    }
  }
  percentRuleCalculate()





















  //projection arrays

  //holdingTotal is basically the rehab recurring total per month
  let loanPaymentArray = [],
    operatingExpenditureArray = [],
    IncomeArray = []

  operatingExpenditureArray.push(Number(holdingTotal) + Number(propertyTaxAmt) + Number(insuranceAmt));
  loanPaymentArray.push(loanPayment);
  IncomeArray.push(0);
  for (let i = 1; i < itr; i++) {
    if (i + 1 <= Number(rehabPeriod)) {
      operatingExpenditureArray[i] = operatingExpenditureArray[i - 1];
    } else if (Number(rentalPeriod) !== 0) {
      operatingExpenditureArray[i] = operatingExpensePerMonth + Number(propertyTaxAmt) + Number(insuranceAmt);
    } else {
      operatingExpenditureArray[i] = operatingExpenditureArray[i - 1];
    }
    loanPaymentArray[i] = loanPaymentArray[i - 1];

    if (i + 1 <= Number(rehabPeriod) || Number(rentalPeriod) === 0) {
      IncomeArray.push(0);
    } else {
      let vacantExp = (Number(GrossRentPerMonth) * Number(Vacancy)) / 100;
      IncomeArray.push(GrossRentPerMonth - vacantExp + otherIncomePerMonth);
    }
  }

  let loanPaymentCumulativeTotal = 0, operatingExpenditureCumulativeTotal = 0, IncomeCumulativeTotal = 0

  let myRentalPeriod = Number(rentalPeriod);
  let myRehabPeriod = Number(rehabPeriod);

  if (myRentalPeriod) {
    loanPaymentCumulativeTotal = loanPaymentArray[myRehabPeriod] * myRentalPeriod
    operatingExpenditureCumulativeTotal = operatingExpenditureArray[myRehabPeriod] * myRentalPeriod
    IncomeCumulativeTotal = IncomeArray[myRehabPeriod] * myRentalPeriod
  }

  let rehabVariation = 1
  if ((myRehabPeriod - 3) > 1) {
    rehabVariation = myRehabPeriod - 3;
  }

  let loanPaymentArrayCumulativeTotal = [],
    operatingExpenditureArrayCumulativeTotal = [],
    IncomeArrayCumulativeTotal = [],
    netCostsArrayCumulativeTotal = []

  let myCount = 0;

  let loanPaymentCumulativeTotalLC = 0;
  let operatingExpenditureCumulativeTotalLC = 0;
  let IncomeCumulativeTotalLC = 0;

  while (myCount < 7) {
    loanPaymentCumulativeTotalLC = loanPaymentCumulativeTotal + loanPaymentArray[0] * rehabVariation;
    operatingExpenditureCumulativeTotalLC = operatingExpenditureCumulativeTotal + operatingExpenditureArray[0] * rehabVariation;
    IncomeCumulativeTotalLC = IncomeCumulativeTotal + IncomeArray[0] * rehabVariation;

    loanPaymentArrayCumulativeTotal.push(loanPaymentCumulativeTotalLC)
    operatingExpenditureArrayCumulativeTotal.push(operatingExpenditureCumulativeTotalLC)
    IncomeArrayCumulativeTotal.push(IncomeCumulativeTotalLC)
    netCostsArrayCumulativeTotal.push(loanPaymentCumulativeTotalLC + operatingExpenditureCumulativeTotalLC - IncomeCumulativeTotalLC)
    rehabVariation++;
    myCount++;
  }











  //profit, selling cost, loanbalance etc.
  let sellingPriceArrayCur = [],
    sellingCostsArrayCur = [],
    saleProceedsArrayCur = [],
    investedCashArrayCur = [],
    loanBalanceArrayCur = [],
    totalProfitArrayCur = []

  let sellingPriceAmt = Number(ARV);
  if (sellingPrice) {
    sellingPriceAmt = Number(sellingPrice);
  }

  let saleProc = sellingPriceAmt - sellingCostTotal

  for (let i = 0; i < 7; i++) {
    sellingPriceArrayCur.push(Number(sellingPriceAmt));
    sellingCostsArrayCur.push(Number(sellingCostTotal));
    saleProceedsArrayCur.push(saleProc)
    investedCashArrayCur.push(totalCashNeeded)
  }

  let loanBalanceArray = []
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      for (let i = 0; i < itr; i++) {
        loanBalanceArray.push(Number(loanAmount));
      }
    } else {
      let loanBalanceLeft = amountFinanced;
      let LoanPaymentPerMonth = (loanAmount * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      for (let i = 0; i < itr; i++) {
        let ipmt = loanBalanceLeft * rateOfInterest;
        loanBalanceLeft -= LoanPaymentPerMonth;
        loanBalanceLeft += ipmt;
        loanBalanceArray.push(loanBalanceLeft);
      }
    }
  } else {
    for (let i = 0; i < itr; i++) {
      loanBalanceArray[i] = 0;
    }
  }

  rehabVariation = 1
  if ((myRehabPeriod - 3) > 1) {
    rehabVariation = myRehabPeriod - 3;
  }
  if (Number(rentalPeriod)) {
    rehabVariation = rehabVariation + Number(rentalPeriod);
  }

  myCount = 0;
  while (myCount < 7) {
    loanBalanceArrayCur.push(loanBalanceArray[rehabVariation - 1]);
    rehabVariation++;
    myCount++;
  }

  for (let i = 0; i < 7; i++) {
    totalProfitArrayCur.push(saleProceedsArrayCur[i] - loanBalanceArrayCur[i] - investedCashArrayCur[i] - netCostsArrayCumulativeTotal[i])
  }









  //ROIArray and AnnualizedROIArray
  let ROIArrayCur = [], annualizedROIArrayCur = []

  rehabVariation = 1
  if ((myRehabPeriod - 3) > 1) {
    rehabVariation = myRehabPeriod - 3;
  }
  if (Number(rentalPeriod)) {
    rehabVariation = rehabVariation + Number(rentalPeriod);
  }

  for (let i = 0; i < 7; i++) {
    ROIArrayCur.push((totalProfitArrayCur[i] * 100) / (investedCashArrayCur[i] + netCostsArrayCumulativeTotal[i]));
    annualizedROIArrayCur.push((12 * ROIArrayCur[i]) / rehabVariation);
    rehabVariation++;
  }


  let calculatedMonthlyCashFlow = 0

  const finalobj = {
    purchasePrice,
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
    rentalPeriod,
    rehabPeriod,
    holdingPeriod,
    saleProceeds,
    loanRepayment,
    profitFlip,
    totalRentalIncome,
    VacancyExpense,
    totalOtherIncome,
    totalOperatingExpense,
    holdingIncome,
    ROI,
    annualizedROI,
    cashMultiple,
    loanPaymentArray,
    operatingExpenditureArray,
    IncomeArray,
    is1Rule,
    is2Rule,
    is50Rule,
    is70Rule,
    loanPaymentArrayCumulativeTotal,
    operatingExpenditureArrayCumulativeTotal,
    IncomeArrayCumulativeTotal,
    netCostsArrayCumulativeTotal,
    sellingPriceArrayCur,
    sellingCostsArrayCur,
    saleProceedsArrayCur,
    investedCashArrayCur,
    loanBalanceArrayCur,
    totalProfitArrayCur,
    ROIArrayCur,
    annualizedROIArrayCur
  };
  return finalobj;
};

export default FlipCalculations;
