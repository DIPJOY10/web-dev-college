import { faLaptopHouse } from "@fortawesome/free-solid-svg-icons";

const RentalOfferCalculeterCalcuations = (reportData, projectData, purchasePrice) => {
  const Area = Number(projectData.area);
  const {
    reportType,
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
    SellingCosts,
  } = reportData;

  console.log(reportData?.reportType + " " + purchasePrice)

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


  let rehabCombined = Number(rehabTotal);

  let overrunAmount = (Number(costOverrun) * Number(rehabTotal)) / 100;
  rehabCombined += Number(overrunAmount);

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

  let downPaymentCash = 0;
  let totalCashNeeded = 0;
  if (amountFinanced) {
    downPaymentCash = Number(purchasePrice) - amountFinanced;
  }

  if (RehabCostPercent) {
    downPaymentCash += rehabCombined;
  }

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

  let pmi = 0,
    mortgageUpfrontAmount = 0,
    mortgageRecurringAmount = 0;

  if (financeMortgageType !== "Single-Premium Mortgage Insurance") {
    mortgageRecurringAmount = (Number(amountFinanced) * Number(Recurring)) / 1200;
  }

  if (financeMortgageType !== "Borrower-paid Mortgage Insurance(BPMI)") {
    mortgageUpfrontAmount = (Number(amountFinanced) * Number(Upfront)) / 100;
  }

  pmi = mortgageRecurringAmount;
  totalCashNeeded += mortgageUpfrontAmount;

  let loanToCost = 0;
  if (RehabCostPercent) {
    loanToCost = loanAmount / (Number(purchasePrice) + rehabCombined);
  } else {
    loanToCost = loanAmount / Number(purchasePrice);
  }
  loanToCost = loanToCost * 100.0;

  let loanToValue = (loanAmount / Number(ARV)) * 100;

  let loanPayment = 0;
  let rateOfInterest = Number(InterestRate) / 1200;
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanPayment = loanAmount * rateOfInterest;
    } else {
      loanPayment = (loanAmount * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      loanPayment += pmi;
    }
  }

  let pricePerSq = Number(purchasePrice) / Area;

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

  let propertyTaxAmt = (Number(propertyTax) * Number(ARV)) / 1200
  let insuranceAmt = Number(propertyInsurance) / 12;
  let rentalPeriod = 12 - rehabPeriod;

  let AnnualRentalIncome = GrossRentPerMonth * rentalPeriod;

  let VacancyExpense = (Number(AnnualRentalIncome) * Number(Vacancy)) / 100;

  let AnnualOtherIncome = otherIncomePerMonth * rentalPeriod;

  let operatingIncome = Number(AnnualRentalIncome) - VacancyExpense + AnnualOtherIncome;

  let operatingExpenseCombined = rentalPeriod * (operatingExpensePerMonth + propertyTaxAmt + insuranceAmt);

  let recurringTotal = (Number(holdingTotal) + propertyTaxAmt + insuranceAmt) * Number(rehabPeriod);

  let NOI = operatingIncome - Number(operatingExpenseCombined) - Number(recurringTotal);

  let LeveredCashFlow = NOI - loanPayment * 12;

  let propValue = Number(ARV) * (1 + Number(Appreciation) / 100);
  let totalEquity = Number(propValue);


  let loanBalance = 0;
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanBalance = loanAmount - 12 * loanPayment;
    } else {
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


  totalEquity -= loanBalance;

  let COC = (LeveredCashFlow * 100) / totalCashNeeded;
  let ROE = (LeveredCashFlow * 100) / totalEquity;
  let sellingCostAmt = Number((SellingCosts * propValue) / 100);
  let ROI = ((totalEquity + LeveredCashFlow - sellingCostAmt - totalCashNeeded) * 100) / totalCashNeeded;

  let rentToValue = (GrossRentPerMonth * 100) / Number(purchasePrice);
  let GRM = Number(purchasePrice) / (Number(rentalPeriod) * GrossRentPerMonth);
  let equityMultiple = (totalEquity - sellingCostAmt + LeveredCashFlow) / totalCashNeeded;
  let breakEvenRatio = ((operatingExpenseCombined + loanPayment * Number(rentalPeriod)) * 100) / (Number(rentalPeriod) * GrossRentPerMonth);
  let debtCoverageRatio = NOI / (12 * loanPayment);
  let debtYield = (NOI * 100) / loanAmount;

  let is1Rule = false;
  let is2Rule = false;
  let is70Rule = false;


  const percentRuleCalculate = () => {
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

  let checkBool = true;



  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPurchasePriceBool && projectData?.purchasePolicy?.[reportData?.reportType]?.purchasePriceLimit < purchasePrice) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashNeededBool && projectData?.purchasePolicy?.[reportData?.reportType]?.TotalCashNeededLimit < totalCashNeeded) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn70RuleBool && !is70Rule) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPricePerSqFtBool && projectData?.purchasePolicy?.[reportData?.reportType]?.pricePerSqFtLimit < pricePerSq) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn1RuleBool && !is1Rule) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn2RuleBool && !is2Rule) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCashFlowBool && projectData?.purchasePolicy?.[reportData?.reportType]?.cashFlowLimit > parseFloat(LeveredCashFlow) / 12) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCOCBool && projectData?.purchasePolicy?.[reportData?.reportType]?.cOCLimit > COC) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROEBool && projectData?.purchasePolicy?.[reportData?.reportType]?.rOELimit > ROE) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROIBool && projectData?.purchasePolicy?.[reportData?.reportType]?.rOILimit > ROI) {
    checkBool = false
  }

  // not calculated
  // if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnIRRBool && projectData?.purchasePolicy?.[reportData?.reportType]?.iRRLimit > LeveredIRRArray[0]) {
  //   checkBool = false
  // }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnRentToValueBool && projectData?.purchasePolicy?.[reportData?.reportType]?.rentToValueLimit > rentToValue) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnGRMBool && projectData?.purchasePolicy?.[reportData?.reportType]?.gRMLimit < GRM) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnEquityMultipleBool && projectData?.purchasePolicy?.[reportData?.reportType]?.equityMultipleLimit > equityMultiple) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnBreakEvenRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.breakEvenRatioLimit < breakEvenRatio) {
    checkBool = false
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToCostRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.loanToCostRatioLimit < loanToCost) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToValueRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.loanToValueRatioLimit < loanToValue) {
    checkBool = false
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtCoverageRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.debtCoverageRatioLimit > debtCoverageRatio) {
    checkBool = faLaptopHouse
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtYieldBool && projectData?.purchasePolicy?.[reportData?.reportType]?.debtYieldLimit > debtYield) {
    checkBool = false
  }

  return checkBool;
};



const brrrrOfferCalculeterCalcuations = (reportData, projectData, purchasePrice) => {
  const Area = Number(projectData.area);
  const {
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
    SellingCosts,
  } = reportData;

  console.log(reportData?.reportType + " " + purchasePrice)

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

  let rehabCombined = Number(rehabTotal);
  let overrunAmount = (Number(costOverrun) * Number(rehabTotal)) / 100;
  rehabCombined += Number(overrunAmount);


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

  let downPaymentCash = 0;
  let totalCashNeeded = 0;
  if (amountFinanced) {
    downPaymentCash = Number(purchasePrice) - amountFinanced;
  }
  if (RehabCostPercent) {
    downPaymentCash += rehabCombined;
  }

  if (downPaymentCash) {
    if (RehabCostPercent) {
      totalCashNeeded = downPaymentCash + Number(purchaseTotal);
    } else {
      totalCashNeeded = downPaymentCash + Number(purchaseTotal) + Number(rehabCombined);
    }
  } else {
    totalCashNeeded = Number(purchasePrice) + Number(purchaseTotal) + Number(rehabCombined);
  }

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
    loanToCost = (loanAmount * 100) / (Number(purchasePrice) + rehabCombined);
  } else {
    loanToCost = (loanAmount * 100) / Number(purchasePrice);
  }
  let loanToValue = (loanAmount / Number(ARV)) * 100;
  let loanPayment = 0;
  let rateOfInterest = Number(InterestRate) / 1200;
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanPayment = loanAmount * rateOfInterest;
    } else {
      loanPayment = (loanAmount * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      loanPayment += pmi;
    }
  }

  let pricePerSq = Number(purchasePrice) / Area;
  let propertyTaxAmt = (Number(propertyTax) * Number(ARV)) / 1200;
  let insuranceAmt = Number(propertyInsurance) / 12;

  let holdingCosts = 0,
    holdingLoanPayments = 0;

  holdingLoanPayments = loanPayment * Number(rehabPeriod);
  let recurringTotal = (Number(holdingTotal) + propertyTaxAmt + insuranceAmt) * Number(rehabPeriod);
  holdingCosts = recurringTotal + holdingLoanPayments;


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

  let rentalPeriod = 12 - rehabPeriod;
  let AnnualRentalIncome = GrossRentPerMonth * 12;
  let VacancyExpense = (Number(AnnualRentalIncome) * Number(Vacancy)) / 100;
  let AnnualOtherIncome = otherIncomePerMonth * 12;
  let operatingIncome = Number(AnnualRentalIncome) - VacancyExpense + AnnualOtherIncome;
  let operatingExpenseCombined = 12 * (operatingExpensePerMonth + propertyTaxAmt + insuranceAmt);
  let NOI = operatingIncome - Number(operatingExpenseCombined);


  let refinanceLoanAmt = 0,
    refinanceLoanPayment = 0,
    purchaseRepayment = 0,
    refinanceLoanToValue = 0,
    netIncomeAfterRehab = 0,
    refinanceCashOut = 0,
    totalCashInvested = 0;

  netIncomeAfterRehab = (Number(NOI) / Number(rentalPeriod) - loanPayment) * Number(Number(refinanceTime) - Number(rehabPeriod));

  let mortgageRefUpfrontAmount = 0,
    mortgageRefRecurringAmount = 0;
  if (refinanceMortgageType !== "Single-Premium Mortgage Insurance") {
    mortgageRefRecurringAmount = (Number(refinanceLoanAmt) * Number(refinanceRecurring)) / 1200;
  } else if (
    refinanceMortgageType !== "Borrower-paid Mortgage Insurance(BPMI)"
  ) {
    mortgageRefUpfrontAmount = (Number(refinanceLoanAmt) * Number(refinanceUpfront)) / 100;
  }


  let refInterestRate = Number(refinanceInterestRate) / 1200;
  if (refinanceLoanAmount) {
    refinanceLoanAmt = Number(refinanceLoanAmount);
  } else {
    refinanceLoanAmt =
      Number(ARV) - (Number(remainingEquity) * Number(ARV)) / 100;
  }
  if (refinanceLoanType === "Interest Only") {
    refinanceLoanPayment = refinanceLoanAmt * Number(refInterestRate);
  } else {
    refinanceLoanPayment = (refinanceLoanAmt * refInterestRate) / (1 - Math.pow(1 + refInterestRate, -12 * Number(refinanceLoanTerm)));
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
      let LoanPaymentPerMonth = (loanAmount * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      for (let i = 0; i < intervals; i++) {
        let ipmt = loanBalanceLeft * rateOfInterest;
        loanBalanceLeft -= LoanPaymentPerMonth;
        loanBalanceLeft += ipmt;
      }
      purchaseRepayment = loanBalanceLeft;
    }
  }
  refinanceCashOut = refinanceLoanAmt - Number(refinanceCostTotal) - purchaseRepayment - holdingCosts + netIncomeAfterRehab - mortgageRefUpfrontAmount;

  if (refinanceCashOut >= totalCashNeeded) {
    totalCashInvested = 0.00000000000001;
  } else {
    totalCashInvested = totalCashNeeded - refinanceCashOut;
  }

  let UnLeveredCashFlow = NOI;
  let LeveredCashFlow = UnLeveredCashFlow - AnnualRefinanceLoanPayment;

  let propValue = Number(ARV) * (1 + Number(Appreciation) / 100);
  let totalEquity = Number(propValue);
  let loanBalance = 0;
  if (LoanType === "Interest Only") {
    loanBalance = refinanceLoanAmt - 12 * refinanceLoanAmt;
  } else {
    let pmt = Number(refinanceLoanAmt);
    let roi = Number(refinanceInterestRate) / 1200;
    let LoanPmtPerMonth = (Number(refinanceLoanAmt) * Number(roi)) / (1 - Math.pow(1 + Number(roi), -12 * Number(refinanceLoanTerm)));
    for (let i = 0; i < 12; i++) {
      let intPayment = pmt * Number(refInterestRate);
      pmt -= LoanPmtPerMonth;
      pmt += intPayment;
    }
    loanBalance = pmt;
  }
  totalEquity -= loanBalance;



  let COC = (LeveredCashFlow * 100) / totalCashInvested;
  let ROE = (LeveredCashFlow * 100) / totalEquity;
  let sellingCostAmt = Number((SellingCosts * Number(propValue)) / 100);
  let ROI = ((totalEquity - sellingCostAmt + LeveredCashFlow - totalCashInvested) * 100) / totalCashInvested;

  //financial ratios
  let rentToValue = (GrossRentPerMonth * 100) / Number(purchasePrice);
  let GRM = Number(purchasePrice) / (12 * GrossRentPerMonth);
  let equityMultiple = (totalEquity - sellingCostAmt + LeveredCashFlow) / totalCashInvested;
  let breakEvenRatio = ((operatingExpenseCombined + AnnualRefinanceLoanPayment) * 100) / (12 * GrossRentPerMonth);
  let debtCoverageRatio = NOI / AnnualRefinanceLoanPayment;
  let debtYield = (NOI * 100) / refinanceLoanAmt;


  let is1Rule = false;
  let is2Rule = false;
  let is70Rule = false;

  const percentRuleCalculate = () => {
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


  let checkBool = true;



  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPurchasePriceBool && projectData?.purchasePolicy?.[reportData?.reportType]?.purchasePriceLimit < purchasePrice) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashNeededBool && projectData?.purchasePolicy?.[reportData?.reportType]?.TotalCashNeededLimit < totalCashNeeded) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashInvestedBool && projectData?.purchasePolicy?.[reportData?.reportType]?.TotalCashInvestedLimit < totalCashInvested) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn70RuleBool && !is70Rule) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPricePerSqFtBool && projectData?.purchasePolicy?.[reportData?.reportType]?.pricePerSqFtLimit < pricePerSq) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn1RuleBool && !is1Rule) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn2RuleBool && !is2Rule) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCashFlowBool && projectData?.purchasePolicy?.[reportData?.reportType]?.cashFlowLimit > parseFloat(LeveredCashFlow) / 12) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCOCBool && projectData?.purchasePolicy?.[reportData?.reportType]?.cOCLimit > COC) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROEBool && projectData?.purchasePolicy?.[reportData?.reportType]?.rOELimit > ROE) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROIBool && projectData?.purchasePolicy?.[reportData?.reportType]?.rOILimit > ROI) {
    checkBool = false
  }

  // not calculated
  // if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnIRRBool && projectData?.purchasePolicy?.[reportData?.reportType]?.iRRLimit > LeveredIRRArray[0]) {
  //   checkBool = false
  // }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnRentToValueBool && projectData?.purchasePolicy?.[reportData?.reportType]?.rentToValueLimit > rentToValue) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnGRMBool && projectData?.purchasePolicy?.[reportData?.reportType]?.gRMLimit < GRM) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnEquityMultipleBool && projectData?.purchasePolicy?.[reportData?.reportType]?.equityMultipleLimit > equityMultiple) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnBreakEvenRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.breakEvenRatioLimit < breakEvenRatio) {
    checkBool = false
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToCostRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.loanToCostRatioLimit < loanToCost) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToValueRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.loanToValueRatioLimit < loanToValue) {
    checkBool = false
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtCoverageRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.debtCoverageRatioLimit > debtCoverageRatio) {
    checkBool = false
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtYieldBool && projectData?.purchasePolicy?.[reportData?.reportType]?.debtYieldLimit > debtYield) {
    checkBool = false
  }

  return checkBool;
}


const flipOfferCalculeterCalcuations = (reportData, projectData, purchasePrice) => {
  const Area = Number(projectData.area);
  const {
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

  console.log(reportData?.reportType + " " + purchasePrice)

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


  let rehabCombined = Number(rehabTotal);
  let overrunAmount = (Number(costOverrun) * Number(rehabTotal)) / 100;
  rehabCombined += Number(overrunAmount);


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

  let downPaymentCash = 0;
  let totalCashNeeded = 0;
  if (amountFinanced) {
    downPaymentCash = Number(purchasePrice) - amountFinanced;
  }
  if (RehabCostPercent) {
    downPaymentCash += rehabCombined;
  }

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
    loanToCost = (loanAmount * 100) / (Number(purchasePrice) + rehabCombined);
  } else {
    loanToCost = loanAmount / Number(purchasePrice);
  }
  let loanToValue = (loanAmount / Number(ARV)) * 100;

  let loanPayment = 0;
  let rateOfInterest = Number(InterestRate) / 1200;
  if (loanAmount) {
    if (LoanType === "Interest Only") {
      loanPayment = loanAmount * rateOfInterest;
    } else {
      loanPayment = (loanAmount * rateOfInterest) / (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      loanPayment += pmi;
    }
  }

  let pricePerSq = Number(purchasePrice) / Area;
  let propertyTaxAmt = (Number(ARV) * Number(propertyTax)) / 1200;

  let insuranceAmt = Number(propertyInsurance) / 12;

  let holdingPeriod = 0;
  if (rehabPeriod) holdingPeriod += Number(rehabPeriod);
  if (rentalPeriod) holdingPeriod += Number(rentalPeriod);

  let holdingCosts = 0,
    holdingLoanPayments = 0;
  holdingLoanPayments = Number(loanPayment) * Number(rehabPeriod);
  let recurringTotal = (Number(holdingTotal) + propertyTaxAmt + insuranceAmt) * Number(rehabPeriod);
  holdingCosts = recurringTotal + holdingLoanPayments;

  let saleProceeds = 0,
    loanRepayment = 0,
    profitFlip = 0;
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
      let LoanPaymentPerMonth =
        (loanAmount * rateOfInterest) /
        (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      for (let i = 0; i < intervals; i++) {
        let ipmt = loanBalanceLeft * rateOfInterest;
        loanBalanceLeft -= LoanPaymentPerMonth;
        loanBalanceLeft += ipmt;
      }
      loanRepayment = loanBalanceLeft;
    }
  }
  profitFlip = saleProceeds - loanRepayment - holdingCosts - totalCashNeeded;

  let otherIncomePerMonth = 0,
    operatingExpensePerMonth = 0,
    GrossRentPerMonth = 0;
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


  let cashMultiple = Number(profitFlip) / Number(totalCashNeeded + holdingCosts);
  let ROI = cashMultiple * 100;
  let annualizedROI = (12 * ROI) / Number(holdingPeriod);


  let is70Rule = false;

  const percentRuleCalculate = () => {
    let totalPPandRC = Number(purchasePrice) + rehabCombined
    let arv70of = (ARV * 70) / 100;
    if (totalPPandRC <= arv70of) {
      is70Rule = true;
    }
  }

  percentRuleCalculate()



  let checkBool = true;

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPurchasePriceBool && projectData?.purchasePolicy?.[reportData?.reportType]?.purchasePriceLimit < purchasePrice) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashNeededBool && projectData?.purchasePolicy?.[reportData?.reportType]?.TotalCashNeededLimit < totalCashNeeded) {
    checkBool = false
  }


  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn70RuleBool && !is70Rule) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPricePerSqFtBool && projectData?.purchasePolicy?.[reportData?.reportType]?.pricePerSqFtLimit < pricePerSq) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROIBool && reportData?.rOILimit > ROI) {
    checkBool = false
  }

  if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaAnnualizedROIBool && projectData?.purchasePolicy?.[reportData?.reportType]?.annualizedROILimit > annualizedROI) {
    checkBool = false
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToCostRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.loanToCostRatioLimit < loanToCost) {
    checkBool = false
  }

  if (reportData?.isFinancing && projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToValueRatioBool && projectData?.purchasePolicy?.[reportData?.reportType]?.loanToValueRatioLimit < loanToValue) {
    checkBool = false
  }


  return checkBool;

}





















export const offerCalculatorCalculation = (reportData, projectData) => {
  let lowLimit = 1000;
  let left = 0;
  let right = 1000000;
  let ans = -1;

  if (reportData?.reportType === "Rental") {
    if (projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPurchasePriceBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashNeededBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn70RuleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPricePerSqFtBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn1RuleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn2RuleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCashFlowBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCOCBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROEBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROIBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnRentToValueBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnGRMBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnEquityMultipleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnBreakEvenRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToCostRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToValueRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtCoverageRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtYieldBool
    ) {

      while (1) {
        if (RentalOfferCalculeterCalcuations(reportData, projectData, lowLimit)) {
          lowLimit = 2 * lowLimit;
        } else {
          right = lowLimit;
          left = parseInt(lowLimit / 2);
          break;
        }
      }

      while (right - left > 1) {
        let mid = parseInt((left + right) / 2)
        if (RentalOfferCalculeterCalcuations(reportData, projectData, mid)) {
          left = mid + 1;
          ans = mid
        } else {
          right = mid;
        }
      }

    } else {
      return -2;
    }
  } else if (reportData?.reportType === "BRRRR") {
    if (
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPurchasePriceBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashNeededBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashInvestedBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn70RuleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPricePerSqFtBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn1RuleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn2RuleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCashFlowBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnCOCBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROEBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROIBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnRentToValueBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnGRMBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnEquityMultipleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnBreakEvenRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToCostRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToValueRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtCoverageRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnDebtYieldBool
    ) {

      while (1) {
        if (brrrrOfferCalculeterCalcuations(reportData, projectData, lowLimit)) {
          lowLimit = 2 * lowLimit;
        } else {
          right = lowLimit;
          left = parseInt(lowLimit / 2);
          break;
        }
      }

      while (right - left > 1) {
        let mid = parseInt((left + right) / 2)
        if (brrrrOfferCalculeterCalcuations(reportData, projectData, mid)) {
          left = mid + 1;
          ans = mid
        } else {
          right = mid;
        }
      }

    } else {
      return -2;
    }
  } else if (reportData?.reportType === "Flip") {
    if (
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPurchasePriceBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnTotalCashNeededBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOn70RuleBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnPricePerSqFtBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnROIBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaAnnualizedROIBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToCostRatioBool ||
      projectData?.purchasePolicy?.[reportData?.reportType]?.criteriaOnLoanToValueRatioBool
    ) {

      while (1) {
        if (flipOfferCalculeterCalcuations(reportData, projectData, lowLimit)) {
          lowLimit = 2 * lowLimit;
        } else {
          right = lowLimit;
          left = parseInt(lowLimit / 2);
          break;
        }
      }

      while (right - left > 1) {
        let mid = parseInt((left + right) / 2)
        if (flipOfferCalculeterCalcuations(reportData, projectData, mid)) {
          left = mid + 1;
          ans = mid
        } else {
          right = mid;
        }
      }

    } else {
      return -2;
    }
  }


  return Math.round(ans);
}












