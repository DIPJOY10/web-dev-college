import RentalCalculations from "./FinanceCalculator/RentalCalculations";
import BRRRRCalculations from "./FinanceCalculator/BRRRRCalculations";
import FlipCalculations from "./FinanceCalculator/FlipCalculations";


export const reportDataCalculation = async (currentReport, projectData) => {
    let data = currentReport;

    let opExpense_data = [], hold_itemized_data = []
    let tax = 0, insurance = 0;

    if (currentReport?.propertyTax) {
        tax = (Number(currentReport?.propertyTax) * Number(currentReport?.ARV)) / 1200;
        tax = tax.toFixed(2);
        hold_itemized_data.push({
            name: "Property Tax",
            value: tax * Number(currentReport?.rehabPeriod),
        });
        opExpense_data.push({
            name: "Property Tax",
            value: tax,
        });
    }

    if (currentReport?.propertyInsurance) {
        insurance = Number(currentReport?.propertyInsurance) / 12;
        insurance = insurance.toFixed(2);
        hold_itemized_data.push({
            name: "Property Insurance",
            value: insurance * Number(currentReport?.rehabPeriod),
        });
        opExpense_data.push({
            name: "Property Insurance",
            value: insurance,
        });
    }

    if (currentReport?.operatingExpenseItemized?.length != 0) {
        currentReport.operatingExpenseItemized.forEach((item) => {
            opExpense_data.push({
                name: item.Name,
                value: Number(item.Amount),
            });
        });
    }

    if (currentReport?.holdingCostsItemized?.length != 0) {
        currentReport.holdingCostsItemized.forEach((item) => {
            let val = Number(item.Amount) * Number(currentReport?.rehabPeriod);
            hold_itemized_data.push({
                name: item.Name,
                value: val,
            })
        });
    }

    let Data = {};
    let calculationType = currentReport?.reportType;

    if (calculationType == "Rental") {
        Data = RentalCalculations(
            data,
            projectData,
            opExpense_data,
            hold_itemized_data
        );
    } else if (calculationType == "BRRRR") {
        Data = BRRRRCalculations(
            data,
            projectData,
            opExpense_data,
            hold_itemized_data
        );
    } else {
        Data = FlipCalculations(
            data,
            projectData,
            opExpense_data,
            hold_itemized_data
        );
    }
    return Data;
}