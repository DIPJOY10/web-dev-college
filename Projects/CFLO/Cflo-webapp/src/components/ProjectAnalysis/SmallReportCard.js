import React, { useEffect, useState } from "react";
import RentalCalculations from "./FinanceCalculator/RentalCalculations";
import BRRRRCalculations from "./FinanceCalculator/BRRRRCalculations";
import FlipCalculations from "./FinanceCalculator/FlipCalculations";


export default function SmallReportCard(props) {
    const {
        currentReport, projectData, setResultData,
        setExpenseData, setHoldingData, setRehabOperatingCostsItemize,
        setPiePurchaseData, setPieRehabData, setPieIncomeData,
        setPieExpenseData, setPieHoldingData, setPieRefinanceData,
        setPieSellingData
    } = props

    const [piePurchaseData, setPurchaseData] = useState([]);
    const [pieRehabData, setRehabData] = useState([]);
    const [taxAndInsuranceItems, setTaxAndInsuranceItems] = useState([]);
    const [additionalItemsCostORLocal, setAdditionalItemsCostORLocal] = useState([]);
    const [pieIncomeData, setIncomeData] = useState([]);
    const [pieRefinanceData, setRefinanceData] = useState([]);
    const [pieHoldExpenseData, setHoldExpenseData] = useState([]);
    const [pieSellingData, setSellingData] = useState([]);
    const [rehabOperatingCostsItemized, setRehabOperatingCostsItemized] = useState([]);

    useEffect(() => {
        findReport(currentReport);
    }, [currentReport]);

    const findReport = async (currentReport) => {
        let data = currentReport;

        let purchase_data = [], rehab_data = [], costOverrun_data = [],
            taxIncreaseArr_data = [], opExpense_data = [], otherIncome_data = [],
            ref_data = [], hold_data = [], hold_itemized_data = [],
            rehab_OperatingCosts_Itemized = [], selling_data = [];

        let tax = 0, insurance = 0;

        let overrunAmount = Math.round((Number(currentReport?.costOverrun) * Number(currentReport?.rehabTotal)) / 100);
        rehab_data.push({
            name: "Cost Overrun",
            value: overrunAmount,
        });
        costOverrun_data.push({
            name: "Cost Overrun",
            value: overrunAmount,
        })

        if (currentReport?.propertyTax) {
            tax = (Number(currentReport?.propertyTax) * Number(currentReport?.ARV)) / 1200;
            tax = tax.toFixed(2);
            hold_itemized_data.push({
                name: "Property Tax",
                value: tax * Number(currentReport?.rehabPeriod),
            });
            rehab_OperatingCosts_Itemized.push({
                name: "Property Tax",
                value: tax
            })
            opExpense_data.push({
                name: "Property Tax",
                value: tax,
            });
            taxIncreaseArr_data.push({
                name: "Property Tax",
                value: tax,
            })
        }

        if (currentReport?.propertyInsurance) {
            insurance = Number(currentReport?.propertyInsurance) / 12;
            insurance = insurance.toFixed(2);
            hold_itemized_data.push({
                name: "Property Insurance",
                value: insurance * Number(currentReport?.rehabPeriod),
            });
            rehab_OperatingCosts_Itemized.push({
                name: "Property Insurance",
                value: insurance
            })
            opExpense_data.push({
                name: "Property Insurance",
                value: insurance,
            });
            taxIncreaseArr_data.push({
                name: "Property Insurance",
                value: insurance,
            })
        }

        if (currentReport?.purchaseCostsItemized?.length != 0) {
            currentReport.purchaseCostsItemized.forEach((item) => {
                purchase_data.push({
                    name: item.Name,
                    value: Number(item.Amount),
                });
            });
        }

        if (currentReport?.rehabCostsItemized?.length != 0) {
            currentReport.rehabCostsItemized.forEach((item) => {
                rehab_data.push({
                    name: item.Name,
                    value: Number(item.Amount),
                });
            });
        }

        if (currentReport?.operatingExpenseItemized?.length != 0) {
            currentReport.operatingExpenseItemized.forEach((item) => {
                opExpense_data.push({
                    name: item.Name,
                    value: Number(item.Amount),
                });
                if (currentReport?.reportType === "BRRRR" || currentReport?.reportType === "Flip") {
                    let val = Number(item.Amount) * Number(currentReport?.rehabPeriod);
                    hold_data.push({
                        name: item.Name,
                        value: val,
                    });
                }
            });
        }

        if (currentReport?.otherIncomeItemized?.length != 0) {
            currentReport.otherIncomeItemized.forEach((item) => {
                otherIncome_data.push({
                    name: item.Name,
                    value: Number(item.Amount),
                });
            });
        }

        if (currentReport?.refinanceCostsItemized?.length != 0) {
            currentReport.refinanceCostsItemized.forEach((item) => {
                ref_data.push({
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
                });
                rehab_OperatingCosts_Itemized.push({
                    name: item.Name,
                    value: item.Amount
                })
            });
        }

        if (currentReport?.sellingCostsItemized?.length != 0) {
            currentReport.sellingCostsItemized.forEach((item) => {
                selling_data.push({
                    name: item.Name,
                    value: Number(item.Amount),
                });
            });
        }

        setRehabData(rehab_data);
        setPurchaseData(purchase_data);
        setIncomeData(otherIncome_data);
        setExpenseData(opExpense_data);
        setTaxAndInsuranceItems(taxIncreaseArr_data)
        setAdditionalItemsCostORLocal(costOverrun_data)
        setRefinanceData(ref_data);
        setHoldExpenseData(hold_data);
        setHoldingData(hold_itemized_data);
        setSellingData(selling_data);
        setRehabOperatingCostsItemized(rehab_OperatingCosts_Itemized)

        if (setRehabOperatingCostsItemize) {
            setRehabOperatingCostsItemize(rehab_OperatingCosts_Itemized)
        }
        if (setPiePurchaseData) {
            setPiePurchaseData(purchase_data)
        }
        if (setPieRehabData) {
            setPieRehabData(rehab_data)
        }
        if (setPieIncomeData) {
            setPieIncomeData(otherIncome_data)
        }
        if (setPieRefinanceData) {
            setPieRefinanceData(ref_data)
        }
        if (setPieSellingData) {
            setPieSellingData(selling_data)
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
        setResultData(Data);
    }

    return (<></>);
}
