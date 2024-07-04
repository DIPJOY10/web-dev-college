import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { CSVLink } from "react-csv";
import downloadIcon from "../../../Assets/downloadIcon.svg"
import CustomBtn from "../../styled/CommonComponents/CustomBtn";

const useStyles = makeStyles({

});

export default function DownloadAllCsv(props) {
    const classes = useStyles();
    const theme = useTheme();
    const {
        incomeData, expenseData, cashFlowData, taxBenefitsAndDeductionData,
        equityData, salesData, investmentData, financialRatioData, projectData,
        currentReport, appreciation, incomeIncrease, expenseIncrease, sellingCosts,
        clickContent, landingPage = false, yearsArr
    } = props

    const isSmall = useMediaQuery(theme.breakpoints.down("md"));
    const isMoreSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [data, setData] = useState()


    useEffect(() => {
        let locData = [];
        let len = yearsArr.length

        let topDatalabel = ["", "Appreciation", "Income Increase", "Expense Increase", "Selling Costs"];
        locData.push(topDatalabel);

        let topData = ["", appreciation + "%", incomeIncrease + "%", expenseIncrease + "%", sellingCosts + "%"];
        locData.push(topData)

        locData.push([])
        locData.push([])
        locData.push([])

        let incomeHeader = [];
        incomeHeader.push("INCOME");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            incomeHeader.push(header);
        }
        locData.push(incomeHeader)

        let allKeys = Object.keys(incomeData)
        allKeys.map((key) => {
            let arr = incomeData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })

        locData.push([])
        locData.push([])
        locData.push([])


        let expenseHeader = [];
        expenseHeader.push("EXPENSE");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            expenseHeader.push(header);
        }
        locData.push(expenseHeader)

        allKeys = Object.keys(expenseData)
        allKeys.map((key) => {
            let arr = expenseData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })

        locData.push([])
        locData.push([])
        locData.push([])


        let cashFlowHeader = [];
        cashFlowHeader.push("CASH FLOW");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            cashFlowHeader.push(header);
        }
        locData.push(cashFlowHeader)

        allKeys = Object.keys(cashFlowData)
        allKeys.map((key) => {
            let arr = cashFlowData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })

        locData.push([])
        locData.push([])
        locData.push([])


        let taxBenefitsAndDeductionHeader = [];
        taxBenefitsAndDeductionHeader.push("TAX BENEFITS AND DEDUCTION");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            taxBenefitsAndDeductionHeader.push(header);
        }
        locData.push(taxBenefitsAndDeductionHeader)

        allKeys = Object.keys(taxBenefitsAndDeductionData)
        allKeys.map((key) => {
            let arr = taxBenefitsAndDeductionData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })


        locData.push([])
        locData.push([])
        locData.push([])


        let equityHeader = [];
        equityHeader.push("EQUITY");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            equityHeader.push(header);
        }
        locData.push(equityHeader)

        allKeys = Object.keys(equityData)
        allKeys.map((key) => {
            let arr = equityData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })


        locData.push([])
        locData.push([])
        locData.push([])


        let salesHeader = [];
        salesHeader.push("SALES");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            salesHeader.push(header);
        }
        locData.push(salesHeader)

        allKeys = Object.keys(salesData)
        allKeys.map((key) => {
            let arr = salesData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })


        locData.push([])
        locData.push([])
        locData.push([])


        let investmentHeader = [];
        investmentHeader.push("INVESTMENT");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            investmentHeader.push(header);
        }
        locData.push(investmentHeader)

        allKeys = Object.keys(investmentData)
        allKeys.map((key) => {
            let arr = investmentData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })


        locData.push([])
        locData.push([])
        locData.push([])


        let financialRatioHeader = [];
        financialRatioHeader.push("FINANCIAL RATIOS");
        for (let i = 0; i < len; i++) {
            let header = "Year " + (yearsArr[i] + 1);
            financialRatioHeader.push(header);
        }
        locData.push(financialRatioHeader)

        allKeys = Object.keys(financialRatioData)
        allKeys.map((key) => {
            let arr = financialRatioData?.[key]
            let localArr = [key]
            for (let i = 0; i < len; i++) {
                localArr.push(parseFloat(arr[i] || 0).toFixed(2))
            }
            locData.push(localArr)
        })

        setData(locData)

    }, [incomeData, expenseData, cashFlowData,
        taxBenefitsAndDeductionData, equityData,
        salesData, investmentData, financialRatioData
    ])


    return (
        <>
            {data?.length > 0 ? (
                <CSVLink
                    filename={`${projectData?.displayName}_${currentReport?.reportTitle}_All_files.csv`}
                    data={data}
                    style={{ textDecoration: "none" }}
                >
                    {landingPage ? (clickContent) : (
                        <div>
                            {isSmall ? (
                                <CustomBtn
                                    text={<img src={downloadIcon} style={{ height: "20px" }} />}
                                    style={{ padding: "5px 2px" }}
                                />
                            ) : (
                                <CustomBtn
                                    text={"Download All CSV"}
                                    startPart={<img src={downloadIcon} style={{ height: "20px" }} />}
                                />
                            )}
                        </div>)}
                </CSVLink>
            ) : (
                <></>
            )}
        </>
    );
}
