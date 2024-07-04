const calculate = (reportData, projectData, ExpenseData, holdingData) => {
  const Area = Number(projectData.area);
  const taxRate = Number(projectData.projectTaxRate);
  const {
    reportType,
    purchasePrice,
    ARV,
    propertyTax,
    propertyInsurance,
    refinanceTime,
    LoanType,
    refinanceLoanType,
    refinanceLoanAmount,
    remainingEquity,
    refinanceInterestRate,
    refinanceLoanTerm,
    refinanceUpfront,
    refinanceRecurring,
    refinanceCostTotal,
    rehabPeriod,
    holdingPeriod,
    holdingTotal,
    sellingCostTotal,
    DownPayment,
    InterestRate,
    LoanTerm,
    RehabCostPercent,
    Upfront,
    Recurring,
    purchaseTotal,
    rehabTotal,
    costOverrun,
    GrossRent,
    Period,
    Vacancy,
    otherIncomeTotal,
    operatingExpenseTotal,
    Appreciation,
    IncomeIncrease,
    ExpenseIncrease,
    sellingPrice,
    SellingCosts,
    DepreciationPeriod,
    LandValue,
    discountRate,
  } = reportData;

  // const RentalCalculations = ()=>{

  //   //purchase & rehab
  //   //all kinds of rehab costs + overrun
  //   let rehabCombined=Number(rehabTotal);
  //   //overrun if any
  //   let overrunAmount = Math.round((Number(costOverrun) * Number(rehabTotal)) / 100);
  //   rehabCombined+=Number(overrunAmount);

  //   //financing(purchase & rehab(if any))
  //   //Downpayment here is downpayment percentage
  //   let loanAmount = 0;
  //   if(DownPayment){
  //     loanAmount+=Number(purchasePrice)*((100-Number(DownPayment))/100);
  //   }
  //   let rehabFinancedAmount=0;
  //   if(RehabCostPercent){
  //     rehabFinancedAmount=Number(RehabCostPercent)*(rehabCombined)/100;
  //   }
  //   loanAmount+=rehabFinancedAmount;
  //   let amountFinanced = loanAmount;
  //   //down payment if financed
  //   let downPaymentCash = 0;
  //   let totalCashNeeded=0;
  //   if(amountFinanced){
  //     downPaymentCash=Number(purchasePrice)-amountFinanced;
  //   }
  //   if(RehabCostPercent){
  //     downPaymentCash+=rehabCombined;
  //   }
  //   //purchasetotal is purchase closing costs
  //   if(downPaymentCash){
  //     if(RehabCostPercent){
  //       totalCashNeeded=downPaymentCash+Number(purchaseTotal);
  //     }else{
  //       totalCashNeeded=downPaymentCash+Number(purchaseTotal)+Number(rehabCombined);
  //     }
  //   }else{
  //       totalCashNeeded=Number(purchasePrice)+Number(purchaseTotal)+Number(rehabCombined);
  //   }
  //   let loanToCost = 0;
  //   if(RehabCostPercent){
  //     //financing rehab cost
  //     loanToCost=(loanAmount)/(Number(purchasePrice)+rehabCombined);
  //   }else{
  //     //not financing rehab cost
  //     loanToCost=(loanAmount)/(Number(purchasePrice));
  //   }
  //   let loanToValue = (loanAmount / Number(ARV)) * 100;
  //   loanToValue = loanToValue.toFixed(2);
  //   let loanPayment=0;
  //   let rateOfInterest = Number(InterestRate) / 1200;
  //   //this is recurring mortage insurance to be paid per month
  //   //we will only give the recurring option for the time being
  //   let pmi=(loanAmount*Number(Recurring)/1200);
  //   if (LoanType === "Interest Only") {
  //     loanPayment = loanAmount * rateOfInterest;
  //   } else {
  //     //combines the principal+ interest + pmi(optional)
  //     loanPayment =
  //     (loanAmount * rateOfInterest) /
  //     (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
  //     loanPayment+=pmi;
  //   }

  //   //valuation
  //   let arvPerSq = Number(ARV) / Area;
  //   let pricePerSq = Number(purchasePrice) / Area;
  //   let rehabPerSq = Number(rehabTotal) / Area;
  //   arvPerSq=arvPerSq.toFixed(2);
  //   pricePerSq = pricePerSq.toFixed(2);
  //   rehabPerSq = rehabPerSq.toFixed(2);

  //   //cash flow calculations
  //   let otherIncomePerMonth=0,operatingExpensePerMonth=0;
  //   let GrossRentPerMonth=0;
  //   const returnPerMonthRentals=()=>{
  //     if(Period==="Per Day"){
  //       GrossRentPerMonth= Number(GrossRent)*30;
  //       otherIncomePerMonth=Number(otherIncomeTotal)*30;
  //       operatingExpensePerMonth=Number(operatingExpenseTotal)*30;
  //     }else if(Period==="Per Week"){
  //       GrossRentPerMonth= Number(GrossRent)*4;
  //       otherIncomePerMonth=Number(otherIncomeTotal)*4;
  //       operatingExpensePerMonth=Number(operatingExpenseTotal)*4;
  //     }else if(Period==="Per Month"){
  //       GrossRentPerMonth= Number(GrossRent);
  //       otherIncomePerMonth=Number(otherIncomeTotal);
  //       operatingExpensePerMonth=Number(operatingExpenseTotal);
  //     }else if(Period==="Per Quarter"){
  //       GrossRentPerMonth= Number(GrossRent)/4.0;
  //       otherIncomePerMonth=Number(otherIncomeTotal)/4.0;
  //       operatingExpensePerMonth=Number(operatingExpenseTotal)/4.0;
  //     }else{
  //       GrossRentPerMonth= Number(GrossRent)/12.0;
  //       otherIncomePerMonth=Number(otherIncomeTotal)/12.0;
  //       operatingExpensePerMonth=Number(operatingExpenseTotal)/12.0;
  //     }
  //   };
  //   returnPerMonthRentals();
  //   //only for 1st year
  //   let rentalPeriod=12-rehabPeriod;
  //   let AnnualRentalIncome=GrossRentPerMonth*rentalPeriod;
  //   let VacancyExpense = Math.round((Number(AnnualRentalIncome) * Number(Vacancy)) / 100);
  //   let operatingIncome =
  //   Number(AnnualRentalIncome) - VacancyExpense + (otherIncomePerMonth*rentalPeriod);
  //   let operatingExpenseCombined = rentalPeriod*operatingExpensePerMonth;
  //   let propertyTaxAmt = Math.round((Number(propertyTax) * Number(ARV)) / 1200);
  //   //operatingExpensePerMonth includes prop tax, insurance pmo,itemized
  //   //..for the rental period
  //   let NOI = operatingIncome - Number(operatingExpenseCombined);
  //   //holding total is rehab recurring total which includes (prop tax, insurance) per month, itemized..
  //   let recurringTotal=Number(holdingTotal)*Number(rehabPeriod);
  //   let UnLeveredCashFlow=NOI-recurringTotal;
  //   let LeveredCashFlow=UnLeveredCashFlow-(loanPayment*12);

  //   //investment returns
  //   let totalEquity = Number(ARV);
  //   let loanBalance = 0;
  //   if (LoanType === "Interest Only") {
  //     loanBalance = loanAmount - 12 * loanPayment;
  //   } else {
  //     let pmt = Number(loanAmount);
  //     for (let i = 0; i < 12; i++) {
  //       let currPayment =
  //         (pmt * rateOfInterest) /
  //         (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
  //       pmt -= currPayment;
  //     }
  //     loanBalance = pmt;
  //   }
  //   totalEquity -= loanBalance;

  //   let capRate = (NOI * 1200) / purchasePrice;
  //   let capRateMarket = (NOI * 1200) / Number(ARV);
  //   let COC = (LeveredCashFlow * 12 * 100) / totalCashNeeded;
  //   let ROE = (LeveredCashFlow * 1200) / totalEquity;
  //   let sellingCostAmt=Number((SellingCosts)*Number(ARV)/100);
  //   let ROI=(totalEquity-sellingCostAmt+(12*LeveredCashFlow)-totalCashNeeded)/totalCashNeeded;
  //   //irr to be calculated, considering pmi & finance rehab costs
  //   let IRR=0;
  //   // let totalPV=0;
  //   //   for(let month=1;month<=Number(holdingPeriod)-Number(rehabPeriod);month++){
  //   //     let NPV=rentalPeriodIncomePMO/(Math.pow((1+discountRate),(Number(rehabPeriod)+month)/12));
  //   //     totalPV+=NPV;
  //   //   }
  //   //   totalPV+=((Number(sellingPrice)-Number(sellingCostTotal))/
  //   //   (Math.pow((1+discountRate),(Number(holdingPeriod)/12))));
  //   //   let totalNPV=totalPV-totalCashNeeded;
  //   //   IRR=(totalNPV/totalCashNeeded)*100;
  //   //   IRR=IRR.toFixed(2);

  //   capRate = capRate.toFixed(2);
  //   capRateMarket = capRateMarket.toFixed(2);
  //   COC = COC.toFixed(2);
  //   ROE = ROE.toFixed(2);
  //   ROI=ROI.toFixed(2);

  //   //financial ratios
  //   let rentToValue=GrossRentPerMonth/Number(purchasePrice);
  //   let GRM=Number(purchasePrice)/(12*GrossRentPerMonth);
  //   let equityMultiple=(totalEquity-sellingCostAmt+(12*LeveredCashFlow))/totalCashNeeded;
  //   let breakEvenRatio=0,debtCoverageRatio=0,debtYield=0;
  //   breakEvenRatio=(operatingExpenseCombined+loanPayment*12)/(12*GrossRentPerMonth);
  //   debtCoverageRatio=NOI/(12*loanPayment);
  //   debtYield=NOI/loanAmount;
  //   rentToValue=rentToValue.toFixed(2);
  //   GRM=GRM.toFixed(2);
  //   equityMultiple=equityMultiple.toFixed(2);
  //   breakEvenRatio=breakEvenRatio.toFixed(2);
  //   debtCoverageRatio=debtCoverageRatio.toFixed(2);
  //   debtYield=debtYield.toFixed(2);

  //   //projection arrays

  //   //income projection
  //   let grossRentArray = [],
  //   otherIncomeArray = [],
  //   vacancyArray = [],
  //   operatingIncomeArray = [];
  //   grossRentArray.push(GrossRentPerMonth * 12);
  //   otherIncomeArray.push(otherIncomePerMonth * 12);
  //   let inc = 1 + Number(IncomeIncrease) / 100;
  //   for (let i = 1; i < 30; i++) {
  //     grossRentArray.push(grossRentArray[i - 1] * inc);
  //     otherIncomeArray.push(otherIncomeArray[i - 1] * inc);
  //   }
  //   //first year, we have no income during rehab period
  //   grossRentArray[0]=GrossRentPerMonth*rentalPeriod;
  //   otherIncomeArray[0]=otherIncomePerMonth*rentalPeriod;
  //   let dec = Number(Vacancy) / 100;
  //   for (let i = 0; i < 30; i++) {
  //     vacancyArray.push(grossRentArray[i] * dec);
  //   }
  //   for (let i = 0; i < 30; i++) {
  //     operatingIncomeArray.push(
  //       grossRentArray[i] - vacancyArray[i] + otherIncomeArray[i]
  //     );
  //   }

  //   //expense projection
  //   let ExpenseArray = [];
  //   ExpenseData.forEach((data) => {
  //     let val = Number(data.value);
  //     let temp = [];
  //     temp.push(val * 12);
  //     let x = 1 + Number(ExpenseIncrease) / 100;
  //     for (let i = 1; i < 30; i++) {
  //       temp[i] = temp[i - 1] * x;
  //     }
  //     //first year has operating expense(itemized things, property tax, insurance) only for the rental period
  //     temp[0]=operatingExpenseCombined;
  //     for (let i = 0; i < 30; i++) {
  //       temp[i] = Math.round(temp[i]);
  //     }
  //     ExpenseArray.push(temp);
  //   });
  //   let operatingExpenseArray = [];
  //   for (let i = 0; i < 30; i++) {
  //     let sum = 0;
  //     ExpenseArray.forEach((arr) => {
  //       sum += Number(arr[i]);
  //     });
  //     operatingExpenseArray.push(sum);
  //   }

  //   //cash flow projection
  //   let NOIArray=[],
  //   recurringTotalArray=[],
  //   UnleveredCashFlowArray=[],
  //   loanPaymentArray=[],
  //   LeveredCashFlowArray=[],
  //   postTaxCashFlowArray=[];
  //   recurringTotalArray.push(recurringTotal);
  //   loanPaymentArray.push(loanPayment*12);
  //   for(let i=1;i<30;i++){
  //     recurringTotalArray[i]=0;
  //     loanPaymentArray[i]=loanPaymentArray[i-1];
  //   }
  //   for(let i=0;i<30;i++){
  //     NOIArray[i]=operatingIncomeArray[i]-operatingExpenseArray[i];
  //     UnleveredCashFlowArray[i]=NOIArray[i]-recurringTotalArray[i];
  //     LeveredCashFlowArray[i]=UnleveredCashFlowArray[i]-loanPaymentArray[i];
  //     postTaxCashFlowArray[i]=LeveredCashFlowArray[i]*(1-Number(taxRate)/100);
  //   }

  //   //tax benefits & deductions
  //   let loanInterestArray=[],
  //   depreciationArray=[],
  //   totalDeductionArray=[];
  //   let intervals=12*Number(LoanTerm);
  //   if(LoanType==="Interest Only"){
  //     for(let i=0;i<intervals;i++){
  //       loanInterestArray.push(loanPayment);
  //     }
  //   }else{
  //     //amortization schedule of the entire thing
  //     let loanBalanceLeft=amountFinanced;
  //     let LoanPaymentPerMonth=
  //     (loanAmount * rateOfInterest) /
  //     (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
  //     let interestSum=0;
  //     for(let i=0;i<intervals;i++){
  //       let ipmt=loanBalanceLeft*rateOfInterest;
  //       interestSum+=ipmt;
  //       loanBalanceLeft-=LoanPaymentPerMonth;
  //       loanBalanceLeft+=impt;
  //       if((i+1)%12==0){
  //         loanInterestArray.push(Math.round(interestSum));
  //         interestSum=0;
  //       }
  //     }
  //   }
  //   let depreciationValue=Number(purchasePrice)-Number(LandValue)+Number(purchaseTotal)+Number(rehabCombined);
  //   for(let i=0;i<30;i++){
  //     if(i<=Number(DepreciationPeriod)-1){
  //       depreciationArray.push(depreciationValue);
  //     }else{
  //       depreciationArray.push(0);
  //     }
  //   }
  //   for(let i=0;i<30;i++){
  //     totalDeductionArray.push(operatingExpenseArray[i]+loanInterestArray[i]+depreciationArray[i]);
  //   }

  //   //equity accumulation
  //   let propertyValueArray = [],
  //   loanBalanceArray = [],
  //   totalEquityArray = [];
  //   let x = 1 + Number(Appreciation) / 100;
  //   propertyValueArray.push(Number(ARV) * x);
  //   for (let i = 1; i < 30; i++) {
  //     propertyValueArray[i] = propertyValueArray[i - 1] * x;
  //   }
  //   for (let i = 0; i < 30; i++) {
  //     let loanBal = 0;
  //     let roi = Number(InterestRate) / 1200;
  //     let lp = Number(loanPayment);
  //     let lamt = Number(loanAmount);
  //     loanBal =
  //       Number(lamt) * Math.pow(1 + roi, 12 * (i + 1)) -
  //       (Number(lp) * (Math.pow(1 + roi, 12 * (i + 1)) - 1)) / roi;
  //     loanBalanceArray.push(loanBal);
  //     loanBalanceArray[i] = Math.round(loanBalanceArray[i]);
  //   }
  //   for (let i = 0; i < 30; i++) {
  //     totalEquityArray[i] = propertyValueArray[i] - loanBalanceArray[i];
  //   }

  //   //sale analysis
  //   let sellingCostsArray=[],
  //   saleProceedsArray=[],
  //   cumulativeCashFlowArray=[],
  //   totalCashInvestedArray=[],
  //   totalProfitArray=[];
  //   for(let i=0;i<30;i++){
  //     sellingCostsArray[i]=Number(SellingCosts)*propertyValueArray[i]/100;
  //     saleProceedsArray[i]=totalEquityArray[i]-sellingCostsArray[i];
  //     if(i==0){
  //       cumulativeCashFlowArray.push(LeveredCashFlowArray[0]);
  //     }else{
  //       cumulativeCashFlowArray[i]=cumulativeCashFlowArray[i-1]+LeveredCashFlowArray[i];
  //     }
  //     totalCashInvestedArray.push(totalCashNeeded);
  //     totalProfitArray[i]=saleProceedsArray[i]+cumulativeCashFlowArray[i]-totalCashInvestedArray[i];
  //   }

  //   //investment returns
  //   //to be calculated

  //   //financial ratios
  //   let rentToValueArray=[],
  //   GRMArray=[],
  //   EquityMultipleArray=[],
  //   breakEvenRatioArray=[],
  //   debtCoverageRatioArray=[],
  //   debtYieldArray=[];
  //   for(let i=0;i<30;i++){
  //     rentToValueArray[i]=grossRentArray[i]/(propertyValueArray[i]*12);
  //     GRMArray[i]=propertyValueArray[i]/grossRentArray[i];
  //     EquityMultipleArray[i]=(totalEquityArray[i]-sellingCostsArray[i]+cumulativeCashFlowArray[i])/totalCashNeeded;
  //     breakEvenRatioArray[i]=((operatingExpenseArray[i] + loanPaymentArray[i])/grossRentArray[i]);
  //     debtCoverageRatioArray[i]=NOIArray[i]/(12*loanPaymentArray[i]);
  //     debtYieldArray=NOIArray[i]/loanBalanceArray[i];
  //   }

  // };
  // RentalCalculations();

  // const BRRRRCalculations = ()=>{

  //   //purchase & rehab

  //   //down payment if financed
  //   let downPaymentCash = Math.round((Number(DownPayment) * Number(purchasePrice)) / 100);

  //   //financing(purchase)
  //   let loanAmount = Number(purchasePrice) - downPaymentCash;
  //   let amountFinanced = loanAmount;
  //   let loanToCost = 100 - Number(DownPayment);
  //   let loanToValue = (loanAmount / Number(ARV)) * 100;
  //   loanToValue = loanToValue.toFixed(2);
  //   let loanPayment=0;
  //   let rateOfInterest = Number(InterestRate) / 1200;
  //   if (LoanType === "Interest Only") {
  //   loanPayment = loanAmount * rateOfInterest;
  //   } else {
  //   loanPayment =
  //     (loanAmount * rateOfInterest) /
  //     (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
  //   }

  //   //all kinds of rehab costs + overrun
  //   let rehabCombined=Number(rehabTotal);
  //   //overrun if any
  //   let overrunAmount = Math.round((Number(costOverrun) * Number(rehabTotal)) / 100);
  //   //rehabcombined of brrrr is different from that of flip..it doesn't include recurring costs
  //   rehabCombined+=Number(overrunAmount);
  //   //purchasetotal is purchase closing costs
  //   let totalCashNeeded =
  //   downPaymentCash + Number(purchaseTotal) + Number(rehabCombined);
  //   //if financing isn't used
  //   if (downPaymentCash === 0) {
  //     totalCashNeeded += Number(purchasePrice);
  //   }

  //   //valuation
  //   let arvPerSq = Math.round(Number(ARV) / Area);
  //   let pricePerSq = Number(purchasePrice) / Area;
  //   pricePerSq = pricePerSq.toFixed(2);
  //   let rehabPerSq = Number(rehabTotal) / Area;
  //   rehabPerSq = rehabPerSq.toFixed(2);

  //   //holding costs
  //   //holding costs here is actually Rehab Costs
  //   let holdingCosts=0,holdingLoanPayments=0;
  //   //holding total is rehab recurring total which includes prop tax, insurance, itemized..
  //   let recurringTotal=Number(holdingTotal)*Number(rehabPeriod);
  //   holdingLoanPayments = loanPayment * Number(rehabPeriod);
  //   //holding costs for brrrr is different from flip..it doesn't include rehabcombined
  //   holdingCosts=recurringTotal+holdingLoanPayments;

  //   //refinance calculations
  //   let refinanceLoanAmt = 0,
  //   refinanceLoanToValue = 0,refinanceCashOut=0,totalCashInvested=0;
  //   if (reportType === "BRRRR") {
  //     if (refinanceLoanAmount) {
  //       refinanceLoanAmt = Number(refinanceLoanAmount);
  //     } else {
  //       refinanceLoanAmt =
  //         Number(ARV) - Math.round((Number(remainingEquity) * Number(ARV)) / 100);
  //     }
  //     refinanceLoanToValue = (refinanceLoanAmt / Number(ARV)) * 100;
  //     refinanceLoanToValue = refLoanToValue.toFixed(2);
  //   }
  //   refinanceCashOut =
  //     refinanceLoanAmt - Number(refinanceCostTotal) - loanAmount - holdingCosts;
  //   totalCashInvested = totalCashNeeded - refinanceCashOut;

  //   //cash flow calculations
  //   let otherIncomePerMonth=0,operatingExpensePerMonth=0;
  //   let GrossRentPerMonth=0;
  //     const returnPerMonthRentals=()=>{
  //       if(Period==="Per Day"){
  //         GrossRentPerMonth= Number(GrossRent)*30;
  //         otherIncomePerMonth=Number(otherIncomeTotal)*30;
  //         operatingExpensePerMonth=Number(operatingExpenseTotal)*30;
  //       }else if(Period==="Per Week"){
  //        GrossRentPerMonth= Number(GrossRent)*4;
  //        otherIncomePerMonth=Number(otherIncomeTotal)*4;
  //        operatingExpensePerMonth=Number(operatingExpenseTotal)*4;
  //       }else if(Period==="Per Month"){
  //         GrossRentPerMonth= Number(GrossRent);
  //         otherIncomePerMonth=Number(otherIncomeTotal);
  //         operatingExpensePerMonth=Number(operatingExpenseTotal);
  //       }else if(Period==="Per Quarter"){
  //         GrossRentPerMonth= Number(GrossRent)/4.0;
  //         otherIncomePerMonth=Number(otherIncomeTotal)/4.0;
  //         operatingExpensePerMonth=Number(operatingExpenseTotal)/4.0;
  //       }else{
  //         GrossRentPerMonth= Number(GrossRent)/12.0;
  //         otherIncomePerMonth=Number(otherIncomeTotal)/12.0;
  //         operatingExpensePerMonth=Number(operatingExpenseTotal)/12.0;
  //       }
  //     };
  //   returnPerMonthRentals();
  //   let AnnualRentalIncome=GrossRentPerMonth*12;
  //   let VacancyExpense = Math.round((Number(AnnualRentalIncome) * Number(Vacancy)) / 100);
  //   let operatingIncome =
  //   Number(AnnualRentalIncome) - VacancyExpense + (otherIncomePerMonth*12);
  //   let operatingExpenseCombined = 12*operatingExpensePerMonth;
  //   let propertyTaxAmt = Math.round((Number(propertyTax) * Number(ARV)) / 1200);
  //   operatingExpenseCombined += propertyTaxAmt*12;
  //   operatingExpenseCombined += Number(propertyInsurance);
  //   let NOI = operatingIncome - Number(operatingExpenseCombined);
  //   let LeveredCashFlow=NOI-loanPayment;

  //   //investment returns
  //   let totalEquity = Number(ARV);
  //   let loanBalance = 0;
  //   if (LoanType === "Interest Only") {
  //     loanBalance = loanAmount - 12 * loanPayment;
  //   } else {
  //     let pmt = Number(loanAmount);
  //     for (let i = 0; i < 12; i++) {
  //       let currPayment =
  //         (pmt * rateOfInterest) /
  //         (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
  //       pmt -= currPayment;
  //     }
  //     loanBalance = pmt;
  //   }
  //   totalEquity -= loanBalance;

  //   let capRate = (NOI * 1200) / purchasePrice;
  //   capRate = capRate.toFixed(2);
  //   let capRateMarket = (NOI * 1200) / Number(ARV);
  //   capRateMarket = capRateMarket.toFixed(2);
  //   let COC = (LeveredCashFlow * 12 * 100) / totalCashInvested;
  //   COC = COC.toFixed(2);
  //   let ROE = (LeveredCashFlow * 1200) / totalEquity;
  //   ROE = ROE.toFixed(2);
  //   let sellingCostAmt=Number((SellingCosts)*Number(ARV)/100);
  //   let ROI=(totalEquity-sellingCostAmt+(12*LeveredCashFlow)-totalCashNeeded)/totalCashNeeded;
  //   ROI=ROI.toFixed(2);
  //   let IRR=0;
  //   //irr to be calculated for brrrr

  //   //financial ratios
  //   let rentToValue=GrossRentPerMonth/Number(purchasePrice);
  //   let GRM=Number(purchasePrice)/(12*GrossRentPerMonth);
  //   let equityMultiple=(totalEquity-sellingCostAmt+(12*LeveredCashFlow))/totalCashInvested;
  //   let breakEvenRatio=0,debtCoverageRatio=0,debtYield=0;
  //   breakEvenRatio=(operatingExpenseCombined+loanPayment*12)/(12*GrossRentPerMonth);
  //   debtCoverageRatio=NOI/(12*loanPayment);
  //   debtYield=NOI/loanAmount;

  // };
  // BRRRRCalculations();

  const FlipCalculations = () => {
    //purchase & rehab

    //down payment if financed
    let downPaymentCash = Math.round(
      (Number(DownPayment) * Number(purchasePrice)) / 100
    );

    //financing(purchase)
    let loanAmount = Number(purchasePrice) - downPaymentCash;
    let amountFinanced = loanAmount;
    let loanToCost = 100 - Number(DownPayment);
    let loanToValue = (loanAmount / Number(ARV)) * 100;
    loanToValue = loanToValue.toFixed(2);
    let loanPayment = 0;
    let rateOfInterest = Number(InterestRate) / 1200;
    if (LoanType === "Interest Only") {
      loanPayment = loanAmount * rateOfInterest;
    } else {
      loanPayment =
        (loanAmount * rateOfInterest) /
        (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
    }
    //all kinds of rehab costs + overrun
    let rehabCombined = Number(rehabTotal);
    //overrun if any
    let overrunAmount = Math.round(
      (Number(costOverrun) * Number(rehabTotal)) / 100
    );
    rehabCombined += Number(overrunAmount);
    let recurringTotal = Number(holdingTotal) * Number(rehabPeriod);
    rehabCombined += Number(recurringTotal);
    let totalCashNeeded =
      downPaymentCash + Number(purchaseTotal) + Number(rehabCombined);
    //if financing isn't used
    if (downPaymentCash === 0) {
      totalCashNeeded += Number(purchasePrice);
    }

    //valuation
    let arvPerSq = Math.round(Number(ARV) / Area);
    let pricePerSq = Number(purchasePrice) / Area;
    pricePerSq = pricePerSq.toFixed(2);
    let rehabPerSq = Number(rehabTotal) / Area;
    rehabPerSq = rehabPerSq.toFixed(2);

    //holding costs
    let holdingCosts = 0,
      holdingLoanPayments = 0;
    holdingLoanPayments = loanPayment * Number(holdingPeriod);
    holdingCosts = rehabCombined + holdingLoanPayments;

    //sale & profit
    let saleProceeds = 0;
    if (Number(holdingPeriod) > Number(rehabPeriod)) {
      saleProceeds = Number(sellingPrice) - Number(sellingCostTotal);
    } else {
      saleProceeds = Number(ARV) - Number(sellingCostTotal);
    }
    let profitFlip = 0;
    profitFlip = saleProceeds - loanAmount - holdingCosts - totalCashNeeded;
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
    let rentalPeriod = Number(holdingPeriod) - Number(rehabPeriod);
    let RentalIncome = GrossRentPerMonth * rentalPeriod;
    let VacancyExpense = Math.round(
      (Number(RentalIncome) * Number(Vacancy)) / 100
    );
    let holdingIncome =
      RentalIncome -
      VacancyExpense +
      otherIncomePerMonth * rentalPeriod -
      operatingExpensePerMonth * rentalPeriod;
    let propertyTaxAmt = Math.round((Number(ARV) * Number(propertyTax)) / 1200);
    let propertyInsuranceAmt = Math.round(Number(propertyInsurance) / 12);
    profitFlip += holdingIncome;

    //investment returns
    let ROI = 0,
      annualizedROI = 0,
      cashMultiple = 0,
      IRR = 0;
    cashMultiple = profitFlip / (totalCashNeeded + holdingCosts);
    ROI = cashMultiple * 100;
    annualizedROI = (12 * ROI) / Number(holdingPeriod);
    cashMultiple = cashMultiple.toFixed(2);
    ROI = ROI.toFixed(2);
    annualizedROI = annualizedROI.toFixed(2);
    let rentalPeriodIncome =
      RentalIncome -
      VacancyExpense +
      otherIncomePerMonth * rentalPeriod -
      operatingExpensePerMonth * rentalPeriod;
    let rentalPeriodIncomePMO = Math.round(rentalPeriodIncome / rentalPeriod);
    let totalPV = 0;
    for (
      let month = 1;
      month <= Number(holdingPeriod) - Number(rehabPeriod);
      month++
    ) {
      let NPV =
        rentalPeriodIncomePMO /
        Math.pow(1 + discountRate, (Number(rehabPeriod) + month) / 12);
      totalPV += NPV;
    }
    totalPV +=
      (Number(sellingPrice) - Number(sellingCostTotal)) /
      Math.pow(1 + discountRate, Number(holdingPeriod) / 12);
    let totalNPV = totalPV - totalCashNeeded;
    IRR = (totalNPV / totalCashNeeded) * 100;
    IRR = IRR.toFixed(2);
  };
  FlipCalculations();

  let downPaymentCash = (Number(DownPayment) * Number(purchasePrice)) / 100;
  downPaymentCash = (downPaymentCash * 10) / 10;

  let totalCashNeeded =
    downPaymentCash + Number(purchaseTotal) + Number(rehabTotal);
  if (downPaymentCash === 0) {
    totalCashNeeded += Number(purchasePrice);
  }
  let overrunAmount = (Number(costOverrun) * Number(rehabTotal)) / 100;
  overrunAmount = Math.round(overrunAmount);
  if (overrunAmount) {
    totalCashNeeded += Number(overrunAmount);
  }

  let rehabFinal = Number(rehabTotal);
  rehabFinal += overrunAmount;
  let amountFinanced = Number(purchasePrice) - downPaymentCash;
  let VacancyExpense = Math.round((Number(GrossRent) * Number(Vacancy)) / 100);
  let operatingIncome =
    Number(GrossRent) - VacancyExpense + Number(otherIncomeTotal);
  let operatingExpenseCombined = Number(operatingExpenseTotal);
  let propertyTaxAmt = Math.round((Number(propertyTax) * Number(ARV)) / 100);
  operatingExpenseCombined += propertyTaxAmt;
  operatingExpenseCombined += Number(propertyInsurance);
  let NOI = operatingIncome - Number(operatingExpenseCombined);
  let capRate = (NOI * 1200) / purchasePrice;
  capRate = capRate.toFixed(1);

  let refLoanAmt = 0,
    refLoanToValue = 0;
  if (reportType === "BRRRR") {
    if (refinanceLoanAmount) {
      refLoanAmt = Number(refinanceLoanAmount);
    } else {
      refLoanAmt =
        Number(ARV) - Math.round((Number(remainingEquity) * Number(ARV)) / 100);
    }
    refLoanToValue = (refLoanAmt / Number(ARV)) * 100;
    refLoanToValue = refLoanToValue.toFixed(2);
  }

  let loanAmount = Number(purchasePrice) - downPaymentCash;

  let loanToCost = 100 - Number(DownPayment);

  let loanToValue = (loanAmount / Number(ARV)) * 100;
  loanToValue = loanToValue.toFixed(2);

  let arvPerSq = Number(ARV) / Area;
  arvPerSq = arvPerSq.toFixed(0);

  let pricePerSq = Number(purchasePrice) / Area;
  pricePerSq = pricePerSq.toFixed(2);

  let rehabPerSq = Number(rehabTotal) / Area;
  rehabPerSq = rehabPerSq.toFixed(2);

  let loanPayment = 0,
    refLoanPayment = 0;

  let rateOfInterest = Number(InterestRate) / 1200;
  let refInterestRate = Number(refinanceInterestRate) / 1200;

  if (reportType === "BRRRR") {
    if (refinanceLoanType === "Interest Only") {
      refLoanPayment = refLoanAmt * refInterestRate;
    } else {
      refLoanPayment =
        (refLoanAmt * refInterestRate) /
        (1 - Math.pow(1 + refInterestRate, -12 * Number(refinanceLoanTerm)));
    }
  }

  if (LoanType === "Interest Only") {
    loanPayment = loanAmount * rateOfInterest;
  } else {
    loanPayment =
      (loanAmount * rateOfInterest) /
      (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
  }

  let holdingLoanPayments = 0,
    holdingCosts = 0,
    holdingCostsPMO = 0,
    refinanceCashOut = 0,
    totalCashInvested = 0;

  let holdOperatingExpense = [];
  if (reportType !== "Rental") {
    holdingLoanPayments = loanPayment * Number(holdingPeriod);
    if (reportType === "Flip") {
      holdingCosts = Number(holdingPeriod) * Number(holdingTotal);
    } else {
      holdingCosts = Number(holdingPeriod) * Number(operatingExpenseTotal);
    }
    holdingLoanPayments = Math.round(holdingLoanPayments);

    holdingCosts += holdingLoanPayments;
    refinanceCashOut =
      refLoanAmt - Number(refinanceCostTotal) - loanAmount - holdingCosts;
    ExpenseData.forEach((data) => {
      let exp = Number(data.value);
      holdOperatingExpense.push(exp * Number(holdingPeriod));
    });
    totalCashInvested = totalCashNeeded - refinanceCashOut;
  }
  holdingCostsPMO = Math.round(holdingCosts / 3);
  holdingCosts = Math.round(holdingCosts);

  let saleProceeds = Number(ARV) - Number(sellingCostTotal);
  let profitFlip = 0,
    postTaxProfitFlip;

  if (reportType === "Flip") {
    profitFlip = saleProceeds - loanAmount - holdingCosts - totalCashNeeded;
    postTaxProfitFlip = (1 - taxRate) * profitFlip;
    profitFlip = Math.round(profitFlip);
    postTaxProfitFlip = Math.round(postTaxProfitFlip);
  }
  let cashFlow = NOI - loanPayment;
  if (reportType === "BRRRR") {
    cashFlow = NOI - refLoanPayment;
  }

  let COC = (cashFlow * 12 * 100) / totalCashNeeded;
  COC = COC.toFixed(1);

  let ROI = 0,
    annualizedROI = 0;
  if (reportType === "Flip") {
    ROI = (profitFlip * 100) / (totalCashNeeded + holdingCosts);
    annualizedROI = (12 * ROI) / Number(holdingPeriod);
    ROI = ROI.toFixed(1);
    annualizedROI = annualizedROI.toFixed(1);
  }

  let capRateMarket = (NOI * 1200) / Number(ARV);
  capRateMarket = capRateMarket.toFixed(1);

  let totalEquity = Number(ARV);
  let loanBalance = 0;
  if (LoanType === "Interest Only") {
    loanBalance = loanAmount - 12 * loanPayment;
  } else {
    let pmt = Number(loanAmount);
    for (let i = 0; i < 12; i++) {
      let currPayment =
        (pmt * rateOfInterest) /
        (1 - Math.pow(1 + rateOfInterest, -12 * Number(LoanTerm)));
      pmt -= currPayment;
    }
    loanBalance = pmt;
  }
  totalEquity -= loanBalance;

  let postTaxCashFlow = cashFlow * (1 - taxRate);
  postTaxCashFlow = Math.round(postTaxCashFlow);

  let ROE = (postTaxCashFlow * 1200) / totalEquity;
  ROE = ROE.toFixed(1);

  let grossRentArray = [],
    otherIncomeArray = [];
  grossRentArray.push(Number(GrossRent) * 12);
  otherIncomeArray.push(Number(otherIncomeTotal) * 12);
  let inc = 1 + Number(IncomeIncrease) / 100;
  for (let i = 1; i < 30; i++) {
    grossRentArray.push(grossRentArray[i - 1] * inc);
    otherIncomeArray.push(otherIncomeArray[i - 1] * inc);
  }

  let vacancyArray = [],
    operatingIncomeArray = [];
  let dec = Number(Vacancy) / 100;
  for (let i = 0; i < 30; i++) {
    vacancyArray.push(grossRentArray[i] * dec);
  }
  for (let i = 0; i < 30; i++) {
    operatingIncomeArray.push(
      grossRentArray[i] - vacancyArray[i] + otherIncomeArray[i]
    );
  }

  let ExpenseArray = [];
  ExpenseData.forEach((data) => {
    let val = Number(data.value);
    let temp = [];
    temp.push(val * 12);
    let x = 1 + Number(ExpenseIncrease) / 100;
    for (let i = 1; i < 30; i++) {
      temp[i] = temp[i - 1] * x;
    }
    for (let i = 0; i < 30; i++) {
      temp[i] = Math.round(temp[i]);
    }
    ExpenseArray.push(temp);
  });

  let holdingArray = [];
  holdingData.forEach((data) => {
    let temp = [];
    let val = Math.round(Number(data.value) / Number(holdingPeriod));
    for (let i = 1; i <= 20; i += 0.5) {
      temp.push(val * i);
    }
    holdingArray.push(temp);
  });

  let operatingExpenseArray = [];
  for (let i = 0; i < 30; i++) {
    let sum = 0;
    ExpenseArray.forEach((arr) => {
      sum += Number(arr[i]);
    });
    operatingExpenseArray.push(sum);
  }

  for (let i = 0; i < 30; i++) {
    grossRentArray[i] = Math.round(grossRentArray[i]);
    vacancyArray[i] = Math.round(vacancyArray[i]);
    otherIncomeArray[i] = Math.round(otherIncomeArray[i]);
    operatingIncomeArray[i] = Math.round(operatingIncomeArray[i]);
  }

  let netOperatingIncomeArray = [],
    loanPaymentArray = [],
    holdingLoanPaymentArray = [];
  for (let i = 0; i < 30; i++) {
    netOperatingIncomeArray[i] =
      operatingIncomeArray[i] - operatingExpenseArray[i];
  }

  if (reportType === "Flip") {
    for (let i = 1; i <= 20; i += 0.5) {
      holdingLoanPaymentArray.push(Math.round(loanPayment * i));
    }
  }
  if (reportType === "BRRRR") {
    loanPaymentArray.push(Math.round(Number(refLoanPayment) * 12));
  } else {
    loanPaymentArray.push(Math.round(Number(loanPayment) * 12));
  }
  for (let i = 1; i < 30; i++) {
    loanPaymentArray[i] = loanPaymentArray[i - 1];
  }

  let cashFlowArray = [];
  for (let i = 0; i < 30; i++) {
    cashFlowArray.push(netOperatingIncomeArray[i] - loanPaymentArray[i]);
  }

  let propertyValueArray = [],
    loanBalanceArray = [],
    totalEquityArray = [];
  let x = 1 + Number(Appreciation) / 100;
  propertyValueArray.push(Number(ARV) * x);
  for (let i = 1; i < 30; i++) {
    propertyValueArray[i] = propertyValueArray[i - 1] * x;
  }
  for (let i = 0; i < 30; i++) {
    propertyValueArray[i] = Math.round(propertyValueArray[i]);
  }
  for (let i = 0; i < 30; i++) {
    let loanBal = 0;
    let roi = Number(InterestRate) / 1200;
    let lp = Number(loanPayment);
    let lamt = Number(loanAmount);
    if (reportType === "BRRRR") {
      lp = Number(refLoanPayment);
      roi = Number(refinanceInterestRate) / 1200;
      lamt = Number(refLoanAmt);
    }
    loanBal =
      Number(lamt) * Math.pow(1 + roi, 12 * (i + 1)) -
      (Number(lp) * (Math.pow(1 + roi, 12 * (i + 1)) - 1)) / roi;
    loanBalanceArray.push(loanBal);
    loanBalanceArray[i] = Math.round(loanBalanceArray[i]);
  }
  for (let i = 0; i < 30; i++) {
    totalEquityArray[i] = propertyValueArray[i] - loanBalanceArray[i];
  }

  let holdingCostsArray = [];
  let sz = holdingLoanPaymentArray.length;
  for (let i = 0; i < sz; i++) {
    let sum = 0;
    sum += holdingLoanPaymentArray[i];
    holdingArray.forEach((arr) => {
      sum += arr[i];
    });
    holdingCostsArray.push(Math.round(sum));
  }

  //Sale & Profit section arrays
  let ARVArray = [],
    sellingCostsArray = [],
    saleProceedsArray = [],
    loanAmtArray = [],
    investedCashArray = [],
    totalProfitArray = [];
  for (let i = 0; i <= 15; i++) {
    ARVArray.push(Number(ARV));
    sellingCostsArray.push(Number(sellingCostTotal));
    saleProceedsArray.push(Number(saleProceeds));
    loanAmtArray.push(Number(loanAmount));
    investedCashArray.push(Number(totalCashNeeded));
  }
  let sze = ARVArray.length;
  for (let i = 0; i < sze; i++) {
    totalProfitArray[i] =
      saleProceedsArray[i] -
      loanAmtArray[i] -
      holdingCostsArray[i] -
      investedCashArray[i];
  }

  let ROIArray = [],
    annualizedROIArray = [];
  let cnt = 0;
  for (let i = 1; i <= 10 && cnt < sze; i += 0.5) {
    let val =
      (100 * totalProfitArray[cnt]) /
      (investedCashArray[cnt] + holdingCostsArray[cnt]);
    val = val.toFixed(1);
    ROIArray.push(val);
    let aROI = (12 * Number(val)) / i;
    aROI = aROI.toFixed(1);
    annualizedROIArray.push(aROI);
    cnt++;
  }

  loanPayment = Math.round(loanPayment);
  refLoanPayment = Math.round(refLoanPayment);
  cashFlow = Math.round(cashFlow);

  return {
    downPaymentCash,
    overrunAmount,
    totalCashNeeded,
    rehabFinal,
    loanAmount,
    loanToCost,
    loanToValue,
    arvPerSq,
    pricePerSq,
    rehabPerSq,
    VacancyExpense,
    operatingIncome,
    propertyTaxAmt,
    operatingExpenseCombined,
    NOI,
    saleProceeds,
    holdingLoanPayments,
    holdingCosts,
    holdingCostsPMO,
    holdOperatingExpense,
    refLoanAmt,
    refLoanToValue,
    refinanceCashOut,
    totalCashInvested,
    profitFlip,
    postTaxProfitFlip,
    loanPayment,
    refLoanPayment,
    cashFlow,
    postTaxCashFlow,
    capRate,
    capRateMarket,
    COC,
    ROE,
    ROI,
    annualizedROI,
    amountFinanced,
    grossRentArray,
    vacancyArray,
    otherIncomeArray,
    operatingIncomeArray,
    ExpenseArray,
    operatingExpenseArray,
    netOperatingIncomeArray,
    loanPaymentArray,
    cashFlowArray,
    propertyValueArray,
    loanBalanceArray,
    totalEquityArray,
    holdingLoanPaymentArray,
    holdingArray,
    ARVArray,
    sellingCostsArray,
    saleProceedsArray,
    loanAmtArray,
    holdingCostsArray,
    investedCashArray,
    totalProfitArray,
    ROIArray,
    annualizedROIArray,
  };
};

export default calculate;
