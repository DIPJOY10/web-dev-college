import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Criteria from "../Reports/Criteria";
import DoughnutChart from "../DoughnutChart";


const useStyles = makeStyles((theme) => ({
    selectorCont: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: "15px"
    },
    title: {
        fontSize: "20px",
        marginLeft: "15px",
        fontWeight: "510",
        color: theme.palette.primary.main,
    },
    allDetailsCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 20px",
        paddingTop: "5px"
    },
    subAllDetailsCont: {
        width: "47%",
    },
    labelValue: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "10px 0px",
        fontSize: "13px",
        fontWeight: "500",
    },
    calc_head_container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "15px 0px 50px",
        flexWrap: "wrap",
    },
    calculate_header: {
        display: "flex",
        justifyContent: "center",
        borderRadius: "15px",
        alignItems: "center",
        flexDirection: "column",
        width: "20%",
        height: "100px",
        "& p": {
            color: "#1684ea",
            fontSize: "16px",
            marginTop: "10px"
        },
        "& h4": {
            color: "#626060",
            fontWeight: "550",
            fontSize: "19px"
        },
        [theme.breakpoints.down('md')]: {
            width: "40%",
            margin: "8px"
        },
        [theme.breakpoints.down('sm')]: {
            width: "42%",
            margin: "8px",
            height: "90px",
            "& p": {
                marginTop: "5px",
                fontSize: "13px"
            },
            "& h4": {
                color: "#626060",
                fontWeight: "550",
                fontSize: "15px"
            },
        }
    },
    criteriaMainCont: {
        width: "100%",
        height: "765px",
        paddingLeft: "50px",
        marginTop: "20px",
    },
    purchaseAndRehabCont: {
        width: "100%",
        height: "965px",
        padding: "0px 20px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "space-between",
    },
    cashFlowCont: {
        width: "100%",
        height: "960px",
        padding: "0px 20px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "space-between",
    },
    valuationAndRatio: {
        width: "100%",
        height: "1000px",
        padding: "0px 20px",
        overflow: "hidden",
    },
    dataCont: {
        width: "49%",
    },
    piChartCont: {
        width: "48%",
    },
    purchase_row: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "black",
        padding: "7px",
        "& h3": {
            fontWeight: "normal",
            fontSize: "13px"
        },
        "& p": {
            fontSize: "12px"
        },
    },
    purchase_rowForBreakdown: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "black",
        padding: "7px",
        "& h3": {
            fontWeight: "normal",
            fontSize: "12px"
        },
        "& p": {
            fontSize: "11px"
        },
    },
    label_text: {
        width: "55%",
        display: "flex",
        alignItems: "center",
    },
    signStyle: {
        fontSize: "17px",
        fontWeight: "510"
    },
    valueCont: {
        width: "32%",
        textAlign: "right",
        display: "flex",
        flexDirection: "column",
    },
    resultText: {
        color: "#1684ea",
        borderTop: "2px solid #1684ea",
    },
    chart: {
        zIndex: "100",
        width: "100%",
        height: "230px",
    },
    breakDownCont: {
        color: theme.palette.primary.main,
        fontSize: "14px"
    },
    noBData: {
        textAlign: "center",
        marginTop: "15px",
        color: "red"
    },
    graphLabel: {
        fontSize: "16px",
        color: theme.palette.primary.main,
        fontWeight: "500",
        textAlign: "center",
    }
}));

export default function FlipReportPDF(props) {
    const classes = useStyles();
    const theme = useTheme();
    const {
        currentReport, pieHoldingData, projectData,
        resultData, piePurchaseData, pieRehabData, pieSellingData,
        rehabOperatingCostsItemized, pageHight,
    } = props
    const { purchase_row, resultText } = classes;

    const redColor = {
        color: "red"
    }

    const themeColor = {
        color: theme.palette.primary.main
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden" } : { height: "1450px", width: "100%" }} >
                <div className={classes.selectorCont} style={{ paddingTop: "5px" }} >
                    <p className={classes.title} >Property Analysis</p>
                    <div></div>
                </div>
                <div className={classes.calc_head_container}>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4>CASH NEEDED</h4>
                        <p>{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
                    </Paper>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4>TOTAL PROFIT</h4>
                        <p>{`$ ${numberWithCommas(parseFloat(resultData.profitFlip).toFixed(2))}`}</p>
                    </Paper>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4>ROI</h4>
                        <p>{`${parseFloat(resultData.ROI).toFixed(2)} %`}</p>
                    </Paper>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4>Annualized ROI</h4>
                        <p>{`${parseFloat(resultData.annualizedROI).toFixed(2)} %`}</p>
                    </Paper>
                </div>
                <div className={classes.selectorCont} >
                    <p className={classes.title} >Criterias</p>
                    <div></div>
                </div>
                <div className={classes.criteriaMainCont} >
                    <Criteria
                        resultData={resultData}
                        currentReport={currentReport}
                        projectData={projectData}
                    />
                </div>
            </div>



            <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden" } : { height: "1450px", width: "100%" }} >
                <div className={classes.selectorCont} style={{ paddingTop: "10px" }} >
                    <p className={classes.title} >Purchase & Rehab</p>
                    <div></div>
                </div>
                <div className={classes.purchaseAndRehabCont} >
                    <div className={classes.dataCont} >
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <p>Purchase Price:</p>
                            </div>
                            <p className={classes.signStyle} >+</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport.purchasePrice).toFixed(2))}`}</p>
                        </div>
                        {currentReport?.RehabCostPercent ? (
                            <div className={`${purchase_row}`}  >
                                <div className={classes.label_text}>
                                    <p>Rehab Costs</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.rehabCombined).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {resultData?.amountFinanced > 0 ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <p>Amount Financed:</p>
                                </div>
                                <p className={classes.signStyle} >-</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.amountFinanced).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {resultData.downPaymentCash > 0 ? (
                            <div className={`${purchase_row} ${resultText}`}>
                                <div className={classes.label_text}>
                                    <p>Down Payment:</p>
                                </div>
                                <p className={classes.signStyle} >=</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.downPaymentCash).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {currentReport.purchaseTotal ? (
                            <div className={`${purchase_row}`} >
                                <div className={classes.label_text}>
                                    <p>Purchase Costs:</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport.purchaseTotal).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {currentReport.rehabTotal && !currentReport?.RehabCostPercent ? (
                            <div className={`${purchase_row}`}  >
                                <div className={classes.label_text}>
                                    <p>Rehab Costs:</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.rehabCombined).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {resultData.mortgageUpfrontAmount > 0 ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <p>Mortgage Upfront:</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.mortgageUpfrontAmount).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <p>Total Cash Needed:</p>
                            </div>
                            <p className={classes.signStyle} >=</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
                        </div>
                        {piePurchaseData.length > 0 ? (<>
                            <p className={classes.graphLabel} style={{ marginTop: "30px" }} >Purchase Costs Graph</p>
                            <div className={classes.chart}>
                                <DoughnutChart
                                    Data={piePurchaseData}
                                    heightNum={"190px"}
                                    chartInnerRadius={40}
                                    chartOuterRadius={85}
                                    isViewOnly={true}
                                    type={"purchase costs"}
                                    fun={() => { }}
                                />
                            </div>
                        </>) : null}
                        {pieRehabData.length > 0 ? (<>
                            <p className={classes.graphLabel} >Rehab Costs Graph</p>
                            <div className={classes.chart}>
                                <DoughnutChart
                                    Data={pieRehabData}
                                    heightNum={"190px"}
                                    chartInnerRadius={40}
                                    chartOuterRadius={85}
                                    isViewOnly={true}
                                    type={"rehab costs"}
                                    fun={() => { }}
                                />
                            </div>
                        </>) : null}
                    </div>
                    <div className={classes.piChartCont} >
                        {pieRehabData.length > 0 ? (
                            <>
                                <p className={classes.breakDownCont} >Rehab Costs Breakdown</p>
                                <div className={classes.p_row_Dropdown} >
                                    {pieRehabData.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <p>{item?.name}</p>
                                            </div>
                                            <p className={classes.signStyle} >+</p>
                                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(item?.value).toFixed(2))}`}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}

                        {piePurchaseData.length > 0 ? (
                            <>
                                <p className={classes.breakDownCont} style={{ marginTop: "15px" }} >Purchase Costs Breakdown</p>
                                <div className={classes.p_row_Dropdown}  >
                                    {piePurchaseData.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <p>{item?.name}</p>
                                            </div>
                                            <p className={classes.signStyle} >+</p>
                                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(item?.value).toFixed(2))}`}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>



            <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden" } : { height: "1450px", width: "100%" }} >
                <div className={classes.selectorCont} style={{ paddingTop: "10px" }} >
                    <p className={classes.title} >Holding Costs</p>
                    <div></div>
                </div>
                <div className={classes.purchaseAndRehabCont} >
                    <div className={classes.dataCont} >
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <p>Rehab Period:</p>
                            </div>
                            <p>{`${currentReport?.rehabPeriod} months`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <p>Loan Payments:</p>
                            </div>
                            <p className={classes.signStyle} >+</p>
                            <div className={classes.valueCont} >
                                <p>{`$ ${numberWithCommas(parseFloat(resultData.holdingLoanPayments).toFixed(2))}`}</p>
                                <p style={{ fontSize: "12px", opacity: "0.8" }} >({`$ ${numberWithCommas(parseFloat((parseInt(resultData.holdingLoanPayments)) / parseInt(currentReport?.rehabPeriod)).toFixed(2))}`}/mo)</p>
                            </div>
                        </div>
                        {resultData?.recurringTotal ? (
                            <div className={`${purchase_row}`} >
                                <div className={classes.label_text}>
                                    <p>Total Rehab Operating Cost:</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.recurringTotal).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <p>Total Holding Costs:</p>
                            </div>
                            <p className={classes.signStyle} >=</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.holdingCosts).toFixed(2))}`}</p>
                        </div>
                        {pieHoldingData.length > 0 ? (<>
                            <p className={classes.graphLabel} style={{ marginTop: "30px" }} >Holding Costs Graph</p>
                            <div className={classes.chart}>
                                <DoughnutChart
                                    Data={pieHoldingData}
                                    heightNum={"190px"}
                                    chartInnerRadius={40}
                                    chartOuterRadius={85}
                                    isViewOnly={true}
                                    type={"holding costs"}
                                    fun={() => { }}
                                />
                            </div>
                        </>) : null}
                    </div>
                    <div className={classes.piChartCont} >
                        {rehabOperatingCostsItemized.length > 0 ? (
                            <>
                                <p className={classes.breakDownCont} >Rehab Operating Costs Breakdown</p>
                                <div className={classes.p_row_Dropdown} >
                                    {rehabOperatingCostsItemized.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <p>{item?.name}</p>
                                            </div>
                                            <p className={classes.signStyle} >+</p>
                                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(item?.value).toFixed(2))}`}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>



            <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden" } : { height: "1450px", width: "100%" }} >
                <div className={classes.selectorCont} style={{ paddingTop: "10px" }} >
                    <p className={classes.title} >Sale & Profit</p>
                    <div></div>
                </div>
                <div className={classes.purchaseAndRehabCont} >
                    <div className={classes.dataCont} >
                        {Number(currentReport?.rentalPeriod) !== 0 ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <p>Selling Price:</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport?.sellingPrice).toFixed(2))}`}</p>
                            </div>
                        ) : (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <p>After Repair Value:</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport?.ARV).toFixed(2))}`}</p>
                            </div>
                        )}
                        {currentReport?.sellingCostTotal ? (
                            <div className={classes.purchase_row} >
                                <div className={classes.label_text}>
                                    <p>Selling Costs:</p>
                                </div>
                                <p className={classes.signStyle} >-</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport?.sellingCostTotal).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <p>Sale Proceeds:</p>
                            </div>
                            <p className={classes.signStyle} >=</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.saleProceeds).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <p>Loan Repayment:</p>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.loanRepayment).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <p>Holding Costs:</p>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.holdingCosts).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <p>Invested Cash:</p>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
                        </div>
                        {currentReport?.rentalPeriod ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <p>Net Rental Income:</p>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.holdingIncome).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <p>Total Profit:</p>
                            </div>
                            <p className={classes.signStyle} >=</p>
                            {resultData?.profitFlip ? (
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.profitFlip).toFixed(2))}`}</p>
                            ) : null}
                        </div>
                        {pieSellingData.length > 0 ? (<>
                            <p className={classes.graphLabel} style={{ marginTop: "30px" }} >Selling Costs Graph</p>
                            <div className={classes.chart}>
                                <DoughnutChart
                                    Data={pieSellingData}
                                    heightNum={"190px"}
                                    chartInnerRadius={40}
                                    chartOuterRadius={85}
                                    isViewOnly={true}
                                    type={"selling costs"}
                                    fun={() => { }}
                                />
                            </div>
                        </>) : null}
                    </div>
                    <div className={classes.piChartCont} >
                        {pieSellingData.length > 0 ? (
                            <>
                                <p className={classes.breakDownCont} >Selling Costs Breakdown</p>
                                <div className={classes.p_row_Dropdown} >
                                    {pieSellingData.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <p>{item?.name}</p>
                                            </div>
                                            <p className={classes.signStyle} >+</p>
                                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(item?.value).toFixed(2))}`}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>



            <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden" } : { height: "1450px", width: "100%" }} >
                <div className={classes.valuationAndRatio} >
                    <div className={classes.selectorCont} style={{ paddingTop: "10px" }} >
                        <p className={classes.title} >Financing (Purchase)</p>
                        <div></div>
                    </div>
                    <div elevation={2} className={classes.allDetailsCont} >
                        <div className={classes.subAllDetailsCont} >
                            <div className={classes.labelValue}>
                                <p>Loan Amount:</p>
                                <p>{`$ ${numberWithCommas(parseFloat(resultData.amountFinanced).toFixed(2))}`}</p>
                            </div>
                            <div className={classes.labelValue}>
                                <p>Loan to Cost:</p>
                                <p>{`${numberWithCommas(parseFloat(resultData.loanToCost).toFixed(2))}%`}</p>
                            </div>
                            <div className={classes.labelValue}>
                                <p>Loan to Value:</p>
                                <p>{`${numberWithCommas(parseFloat(resultData.loanToValue).toFixed(2))}%`}</p>
                            </div>
                        </div>
                        <div className={classes.subAllDetailsCont} >
                            <div className={classes.labelValue}>
                                <p>Financing Of:</p>
                                <p>
                                    {(100 - Number(currentReport?.DownPayment)) > 0 && Number(currentReport?.RehabCostPercent) > 0 ? (
                                        <>Purchase({(100 - Number(currentReport?.DownPayment))}%) Rehab({currentReport?.RehabCostPercent}%)</>
                                    ) : (
                                        <>{(100 - Number(currentReport?.DownPayment)) > 0 ? (<>
                                            Purchase({(100 - Number(currentReport?.DownPayment))}%)
                                        </>) : (<>
                                            {Number(currentReport?.RehabCostPercent) > 0 ? (<>
                                                Rehab({currentReport?.RehabCostPercent}%)
                                            </>) : (<>
                                                no Finance
                                            </>)}
                                        </>)}</>
                                    )}
                                </p>
                            </div>
                            <div className={classes.labelValue}>
                                <p>Loan Type:</p>
                                {currentReport.LoanTerm ? (
                                    <p>{`${currentReport.LoanType}, ${currentReport.LoanTerm} years`}</p>
                                ) : (
                                    <p>{`${currentReport.LoanType}`}</p>
                                )}
                            </div>
                            <div className={classes.labelValue}>
                                <p>Interest Rate:</p>
                                <p>{`${numberWithCommas(parseFloat(currentReport.InterestRate).toFixed(2))}%`}</p>
                            </div>
                            {resultData?.mortgageUpfrontAmount ||
                                resultData?.mortgageRecurringAmount ? (
                                <div className={classes.labelValue}>
                                    <p>Mortgage Insurance:</p>
                                    <div className={classes.verticalMortgage}>
                                        <p>{`Upfront: $${numberWithCommas(parseFloat(resultData?.mortgageUpfrontAmount).toFixed(2))}`}</p>
                                        <p>{`Recurring: $${numberWithCommas(parseFloat(resultData?.mortgageRecurringAmount).toFixed(2))}`}</p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className={classes.selectorCont} >
                        <p className={classes.title} >Valuation</p>
                        <div></div>
                    </div>
                    <div elevation={2} className={classes.allDetailsCont} >
                        <div className={classes.subAllDetailsCont} >
                            <div className={classes.labelValue}>
                                <p>After Repair Value:</p>
                                <p>{`$ ${numberWithCommas(parseFloat(currentReport.ARV).toFixed(2))}`}</p>
                            </div>

                            <div className={classes.labelValue}>
                                <p>ARV Per Square Foot:</p>
                                <p>{`$ ${numberWithCommas(parseFloat(resultData.arvPerSq).toFixed(2))}`}</p>
                            </div>
                        </div>
                        <div className={classes.subAllDetailsCont} >
                            <div className={classes.labelValue}>
                                <p>Price Per Square Foot:</p>
                                <p>{`$ ${numberWithCommas(parseFloat(resultData.pricePerSq).toFixed(2))}`}</p>
                            </div>
                            <div className={classes.labelValue}>
                                <p>Rehab Per Square Foot:</p>
                                <p>{`$ ${numberWithCommas(parseFloat(resultData.rehabPerSq).toFixed(2))}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className={classes.selectorCont} >
                        <p className={classes.title} >Investment Returns</p>
                        <div></div>
                    </div>
                    <div elevation={2} className={classes.allDetailsCont} >
                        <div className={classes.subAllDetailsCont} >
                            <div className={classes.labelValue}>
                                <p style={parseFloat(resultData.ROI) > 0 ? {} : redColor} >Return On Investment:</p>
                                <p style={parseFloat(resultData.ROI) > 0 ? {} : redColor} >{`${parseFloat(resultData.ROI).toFixed(2)}%`}</p>
                            </div>
                        </div>
                        <div className={classes.subAllDetailsCont} >
                            <div className={classes.labelValue}>
                                <p>Annualized ROI:</p>
                                <p>{`${parseFloat(resultData.annualizedROI).toFixed(2)}%`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
