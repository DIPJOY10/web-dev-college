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
        padding: "20px 0px",
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
        height: "955px",
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

export default function BRRRRReportPDF(props) {
    const classes = useStyles();
    const theme = useTheme();
    const {
        currentReport, pieHoldingData, pieRefinanceData, projectData,
        resultData, piePurchaseData, pieRehabData, pieIncomeData,
        pieExpenseData, incomePieChart, rehabOperatingCostsItemized,
        pageHight
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
                    <h3 className={classes.title} >Property Analysis</h3>
                    <div></div>
                </div>
                <div className={classes.calc_head_container}>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4>CASH NEEDED</h4>
                        <p>{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
                    </Paper>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4 style={parseFloat(resultData.LeveredCashFlow) > 0 ? {} : redColor} >CASH FLOW</h4>
                        <p style={parseFloat(resultData.LeveredCashFlow) > 0 ? {} : redColor} >{`$ ${numberWithCommas(parseFloat(parseInt(resultData.LeveredCashFlow) / 12).toFixed(2))}/mo`}</p>
                    </Paper>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4 style={parseFloat(resultData.capRate) > 0 ? {} : redColor} >Cap RATE</h4>
                        <p style={parseFloat(resultData.capRate) > 0 ? {} : redColor} >{`${parseFloat(resultData.capRate).toFixed(2)} %`}</p>
                    </Paper>
                    <Paper elevation={0} className={classes.calculate_header}>
                        <h4 style={parseFloat(resultData.COC) > 0 ? {} : redColor} >COC</h4>
                        <p style={parseFloat(resultData.COC) > 0 ? {} : redColor} >{`${parseFloat(resultData.COC).toFixed(2)} %`}</p>
                    </Paper>
                </div>
                <div className={classes.selectorCont} >
                    <h3 className={classes.title} >Criterias</h3>
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
                    <h3 className={classes.title} >Purchase & Rehab</h3>
                    <div></div>
                </div>
                <div className={classes.purchaseAndRehabCont} >
                    <div className={classes.dataCont} >
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Purchase Price:</h3>
                            </div>
                            <p className={classes.signStyle} >+</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport.purchasePrice).toFixed(2))}`}</p>
                        </div>
                        {currentReport?.RehabCostPercent ? (
                            <div className={classes.purchase_row} >
                                <div className={classes.label_text}>
                                    <h3>Rehab Costs</h3>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.rehabCombined).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {resultData.amountFinanced > 0 ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <h3>Amount Financed:</h3>
                                </div>
                                <p className={classes.signStyle} >-</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.amountFinanced).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {resultData.downPaymentCash > 0 ? (
                            <div className={`${purchase_row} ${resultText}`}>
                                <div className={classes.label_text}>
                                    <h3>Down Payment:</h3>
                                </div>
                                <p className={classes.signStyle} >=</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.downPaymentCash).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {currentReport.purchaseTotal ? (
                            <div className={classes.purchase_row} >
                                <div className={classes.label_text}>
                                    <h3>Purchase Costs:</h3>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport.purchaseTotal).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {currentReport.rehabTotal && !currentReport?.RehabCostPercent ? (
                            <div className={`${purchase_row}`}  >
                                <div className={classes.label_text}>
                                    <h3>Rehab Costs:</h3>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.rehabCombined).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {resultData.mortgageUpfrontAmount > 0 ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <h3>Mortgage Upfront:</h3>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.mortgageUpfrontAmount).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <h3>Total Cash Needed:</h3>
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
                                                <h3>{item?.name}</h3>
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
                                                <h3>{item?.name}</h3>
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
                    <h3 className={classes.title} >Holding Costs</h3>
                    <div></div>
                </div>
                <div className={classes.purchaseAndRehabCont} >
                    <div className={classes.dataCont} >
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Rehab Period:</h3>
                            </div>
                            <p>{`${currentReport?.rehabPeriod} months`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Loan Payments:</h3>
                            </div>
                            <p className={classes.signStyle} >+</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.holdingLoanPayments).toFixed(2))}`}</p>
                        </div>
                        {resultData?.recurringTotal ? (
                            <div className={classes.purchase_row}  >
                                <div className={classes.label_text}>
                                    <h3>Total Rehab Operating Cost:</h3>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.recurringTotal).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <h3>Total Holding Costs:</h3>
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
                                <p className={classes.breakDownCont} >Rehab Costs Breakdown</p>
                                <div className={classes.p_row_Dropdown} >
                                    {rehabOperatingCostsItemized.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <h3>{item?.name}</h3>
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
                    <h3 className={classes.title} >Refinance (After {currentReport?.refinanceTime} months)</h3>
                    <div></div>
                </div>
                <div className={classes.purchaseAndRehabCont} >
                    <div className={classes.dataCont} >
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Refinance Loan Amount:</h3>
                            </div>
                            <p className={classes.signStyle} >+</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.refinanceLoanAmt).toFixed(2))}`}</p>
                        </div>
                        {currentReport.refinanceCostTotal ? (
                            <div className={classes.purchase_row} >
                                <div className={classes.label_text}>
                                    <h3>Refinance Costs:</h3>
                                </div>
                                <p className={classes.signStyle} >-</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport.refinanceCostTotal).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Purchase Loan Repayment:</h3>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.purchaseRepayment).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Total Holding Costs:</h3>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.holdingCosts).toFixed(2))}`}</p>
                        </div>
                        {currentReport?.rehabPeriod != currentReport?.refinanceTime ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <h3>Net Income After Rehab:</h3>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.netIncomeAfterRehab).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {resultData?.mortgageRefUpfrontAmount ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <h3>Refinance Mortgage Upfront:</h3>
                                </div>
                                <p className={classes.signStyle} >-</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.mortgageRefUpfrontAmount).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`} style={{ marginBottom: "10px" }} >
                            <div className={classes.label_text}>
                                <h3 style={parseFloat(resultData.refinanceCashOut) > 0 ? {} : redColor} >Refinance Cash Out:</h3>
                            </div>
                            <p className={classes.signStyle} style={parseFloat(resultData.refinanceCashOut) > 0 ? {} : redColor} >=</p>
                            <p className={classes.valueCont} style={parseFloat(resultData.refinanceCashOut) > 0 ? {} : redColor} >{`$ ${numberWithCommas(parseFloat(resultData.refinanceCashOut).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Invested Cash:</h3>
                            </div>
                            <p className={classes.signStyle} >+</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Refinance Cash Out:</h3>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.refinanceCashOut).toFixed(2))}`}</p>
                        </div>
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <h3>Total Cash Invested:</h3>
                            </div>
                            <p className={classes.signStyle} >=</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.totalCashInvested).toFixed(2))}`}</p>
                        </div>
                        {pieRefinanceData.length > 0 ? (<>
                            <p className={classes.graphLabel} style={{ marginTop: "30px" }} >Refinance Costs Graph</p>
                            <div className={classes.chart}>
                                <DoughnutChart
                                    Data={pieRefinanceData}
                                    heightNum={"190px"}
                                    chartInnerRadius={40}
                                    chartOuterRadius={85}
                                    isViewOnly={true}
                                    type={"refinance costs"}
                                    fun={() => { }}
                                />
                            </div>
                        </>
                        ) : null}
                    </div>
                    <div className={classes.piChartCont} >
                        {pieRefinanceData.length > 0 ? (
                            <>
                                <p className={classes.breakDownCont} >Refinance Costs Breakdown</p>
                                <div className={classes.p_row_Dropdown} >
                                    {pieRefinanceData.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <h3>{item?.name}</h3>
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
                    <h3 className={classes.title} >CASH FLOW (Year 1, After Refinance)</h3>
                    <div></div>
                </div>
                <div className={classes.purchaseAndRehabCont} >
                    <div className={classes.dataCont} >
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Gross Rent:</h3>
                            </div>
                            <p className={classes.signStyle} >+</p>
                            <div className={classes.valueCont} >
                                <p style={{ textAlign: "right" }} >{`$ ${numberWithCommas(parseFloat(resultData?.AnnualRentalIncome).toFixed(2))}`}</p>
                                <p style={{ fontSize: "12px", opacity: "0.8" }} >({`$ ${numberWithCommas(parseFloat(currentReport?.GrossRent).toFixed(2))}`}/mo)</p>
                            </div>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Vacancy:</h3>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData?.VacancyExpense).toFixed(2))}`}</p>
                        </div>
                        {currentReport.otherIncomeTotal ? (
                            <div className={classes.purchase_row}>
                                <div className={classes.label_text}>
                                    <h3>Other Income:</h3>
                                </div>
                                <p className={classes.signStyle} >+</p>
                                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData?.AnnualOtherIncome).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <h3>Operating Income:</h3>
                            </div>
                            <p className={classes.signStyle} >=</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.operatingIncome).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row} >
                            <div className={classes.label_text}>
                                <h3>Operating Expenses:</h3>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.operatingExpenseCombined).toFixed(2))}`}</p>
                        </div>
                        <div className={`${purchase_row} ${resultText}`}>
                            <div className={classes.label_text}>
                                <h3 style={parseFloat(resultData.NOI) > 0 ? themeColor : redColor} >Net Operating Income:</h3>
                            </div>
                            <p className={classes.signStyle} style={parseFloat(resultData.NOI) > 0 ? themeColor : redColor} >=</p>
                            <p className={classes.valueCont} style={parseFloat(resultData.NOI) > 0 ? themeColor : redColor} >{`$ ${numberWithCommas(parseFloat(resultData.NOI).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.purchase_row}>
                            <div className={classes.label_text}>
                                <h3>Loan Payments:</h3>
                            </div>
                            <p className={classes.signStyle} >-</p>
                            <div className={classes.valueCont} >
                                <p style={{ textAlign: "right" }} >{`$ ${numberWithCommas(parseFloat(resultData.AnnualRefinanceLoanPayment).toFixed(2))}`}</p>
                                <p style={{ fontSize: "12px", opacity: "0.8" }} >({`-$ ${numberWithCommas(parseFloat(resultData?.GrossRentPerMonth).toFixed(2))}`}/mo)</p>
                            </div>
                        </div>
                        {resultData.refinanceLoanAmt != 0 ? (
                            <div className={`${purchase_row} ${resultText}`}>
                                <div className={classes.label_text}>
                                    <h3 style={parseFloat(resultData.LeveredCashFlow) > 0 ? themeColor : redColor} >Cash Flow:</h3>
                                </div>
                                <p className={classes.signStyle} style={parseFloat(resultData.LeveredCashFlow) > 0 ? themeColor : redColor} >=</p>
                                <p className={classes.valueCont} style={parseFloat(resultData.LeveredCashFlow) > 0 ? themeColor : redColor} >{`$ ${numberWithCommas(parseFloat(resultData.LeveredCashFlow).toFixed(2))}`}</p>
                            </div>
                        ) : null}
                        {incomePieChart.length > 0 ? (<>
                            <p className={classes.graphLabel} style={{ marginTop: "30px" }} >Income Graph</p>
                            <div className={classes.chart}>
                                <DoughnutChart
                                    Data={incomePieChart}
                                    heightNum={"190px"}
                                    chartInnerRadius={40}
                                    chartOuterRadius={85}
                                    isViewOnly={true}
                                    type={"income"}
                                    fun={() => { }}
                                />
                            </div>
                        </>) : null}
                        {pieExpenseData.length > 0 ? (<>
                            <p className={classes.graphLabel} style={{ marginTop: "30px" }} >Expenses Graph</p>
                            <div className={classes.chart}>
                                <DoughnutChart
                                    Data={pieExpenseData}
                                    heightNum={"190px"}
                                    chartInnerRadius={40}
                                    chartOuterRadius={85}
                                    isViewOnly={true}
                                    type={"expenses"}
                                    fun={() => { }}
                                />
                            </div>
                        </>) : null}
                    </div>
                    <div className={classes.piChartCont} >
                        {incomePieChart.length > 0 ? (
                            <>
                                <p className={classes.breakDownCont} >Income Breakdown</p>
                                <div className={classes.p_row_Dropdown} >
                                    {incomePieChart.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <h3>{item?.name}</h3>
                                            </div>
                                            <p className={classes.signStyle} >+</p>
                                            <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(item?.value).toFixed(2))}`}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                        {pieExpenseData.length > 0 ? (
                            <>
                                <p className={classes.breakDownCont} >Expense Breakdown</p>
                                <div className={classes.p_row_Dropdown} >
                                    {pieExpenseData.map((item) => (
                                        <div className={classes.purchase_rowForBreakdown}>
                                            <div className={classes.label_text}>
                                                <h3>{item?.name}</h3>
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
                    <h3 className={classes.title} >Financing (Purchase)</h3>
                    <div></div>
                </div>
                <div elevation={2} className={classes.allDetailsCont} >
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p>Loan Amount</p>
                            <p>{`$ ${numberWithCommas(parseFloat(resultData.amountFinanced).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p>Loan to Cost</p>
                            <p>{`${numberWithCommas(parseFloat(resultData.loanToCost).toFixed(2))}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p>Loan to Value</p>
                            <p>{`${numberWithCommas(parseFloat(resultData.loanToValue).toFixed(2))}%`}</p>
                        </div>
                    </div>
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p>Financing Of</p>
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
                        <div className={classes.labelValue} >
                            <p>Loan Type</p>
                            {currentReport.LoanTerm ? (
                                <p>{`${currentReport.LoanType}, ${currentReport.LoanTerm} years`}</p>
                            ) : (
                                <p>{`${currentReport.LoanType}`}</p>
                            )}
                        </div>
                        <div className={classes.labelValue} >
                            <p>Interest Rate</p>
                            <p>{`${parseFloat(currentReport.InterestRate).toFixed(2)}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            {resultData?.mortgageUpfrontAmount ||
                                resultData?.mortgageRecurringAmount ? (<>
                                    <p>Mortgage Insurance:</p>
                                    <div>
                                        <p>{`Upfront: $${numberWithCommas(parseFloat(resultData?.mortgageUpfrontAmount).toFixed(2))}`}</p>
                                        <p>{`Recurring: $${numberWithCommas(parseFloat(resultData?.mortgageRecurringAmount).toFixed(2))}`}</p>
                                    </div>
                                </>) : null}
                        </div>
                    </div>
                </div>

                <div className={classes.selectorCont} >
                    <h3 className={classes.title} >Valuation</h3>
                    <div></div>
                </div>
                <div elevation={2} className={classes.allDetailsCont} >
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p>After Repair Value</p>
                            <p>{`$ ${numberWithCommas(parseFloat(currentReport.ARV).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p>ARV Per Square Foot</p>
                            <p>{`$ ${numberWithCommas(parseFloat(resultData.arvPerSq).toFixed(2))}`}</p>
                        </div>
                    </div>
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p>Price Per Square Foot</p>
                            <p>{`$ ${numberWithCommas(parseFloat(resultData.pricePerSq).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p>Rehab Per Square Foot</p>
                            <p>{`$ ${numberWithCommas(parseFloat(resultData.rehabPerSq).toFixed(2))}`}</p>
                        </div>
                    </div>
                </div>

                <div className={classes.selectorCont} style={{ paddingTop: "10px" }} >
                    <h3 className={classes.title} >Financing (Refinance)</h3>
                    <div></div>
                </div>
                <div elevation={2} className={classes.allDetailsCont} >
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p>Loan Amount</p>
                            <p>{`$ ${numberWithCommas(parseFloat(resultData.refinanceLoanAmt).toFixed(2))}`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p>Loan to Value</p>
                            <p>{`${parseFloat(resultData.refinanceLoanToValue).toFixed(2)}%`}</p>
                        </div>
                    </div>
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p>Loan Type</p>
                            {currentReport.refinanceLoanTerm ? (
                                <p>{`${currentReport.refinanceLoanType}, ${currentReport.refinanceLoanTerm} years`}</p>
                            ) : (
                                <p>{`${currentReport.refinanceLoanType}`}</p>
                            )}
                        </div>
                        <div className={classes.labelValue} >
                            <p>Interest Rate</p>
                            <p>{`${parseFloat(currentReport.refinanceInterestRate).toFixed(2)}%`}</p>
                        </div>
                        {resultData?.mortgageRefUpfrontAmount || resultData?.mortgageRefRecurringAmount ? (
                            <div className={classes.labelValue} >
                                <p>Refinance Mortgage Insurance</p>
                                <div>
                                    <p>{`Upfront: $${numberWithCommas(parseFloat(resultData?.mortgageRefUpfrontAmount).toFixed(2))}`}</p>
                                    <p>{`Recurring: $${numberWithCommas(parseFloat(resultData?.mortgageRefRecurringAmount).toFixed(2))}`}</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className={classes.selectorCont} >
                    <h3 className={classes.title} >INVESTMENT RETURNS (Year 1)</h3>
                    <div></div>
                </div>
                <div elevation={2} className={classes.allDetailsCont} >
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.capRate) > 0 ? {} : redColor} >Cap Rate(Purchase Price):</p>
                            <p style={parseFloat(resultData.capRate) > 0 ? {} : redColor} >{`${parseFloat(resultData.capRate).toFixed(2)}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.capRateMarket) > 0 ? {} : redColor} >Cap Rate(ARV):</p>
                            <p style={parseFloat(resultData.capRateMarket) > 0 ? {} : redColor} >{`${parseFloat(resultData.capRateMarket).toFixed(2)}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.COC) > 0 ? {} : redColor} >Cash on Cash Return:</p>
                            <p style={parseFloat(resultData.COC) > 0 ? {} : redColor} >{`${parseFloat(resultData.COC).toFixed(2)}%`}</p>
                        </div>
                    </div>
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.ROE) > 0 ? {} : redColor} >Return On Equity:</p>
                            <p style={parseFloat(resultData.ROE) > 0 ? {} : redColor} >{`${parseFloat(resultData.ROE).toFixed(2)}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.ROI) > 0 ? {} : redColor} >Return On Investment:</p>
                            <p style={parseFloat(resultData.ROI) > 0 ? {} : redColor} >{`${parseFloat(resultData.ROI).toFixed(2)}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData?.LeveredIRRArray[0]) > 0 ? {} : redColor} >Internal Rate of Return (Levered):</p>
                            <p style={parseFloat(resultData?.LeveredIRRArray[0]) > 0 ? {} : redColor} >{`${parseFloat(resultData?.LeveredIRRArray[0]).toFixed(2)}%`}</p>
                        </div>
                    </div>
                </div>

                <div className={classes.selectorCont} >
                    <h3 className={classes.title} >FINANCIAL RATIOS (After Refinance)</h3>
                    <div></div>
                </div>
                <div elevation={2} className={classes.allDetailsCont} >
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} >
                            <p>Rent To Value</p>
                            <p></p>
                        </div>
                        <div className={classes.labelValue} style={{ paddingLeft: "10px" }} >
                            <p>At Purchase</p>
                            <p>{`${parseFloat(resultData.rentToValue).toFixed(2)}`}%</p>
                        </div>
                        <div className={classes.labelValue} style={{ paddingLeft: "10px" }} >
                            <p>At Year End:</p>
                            <p>{`${parseFloat(resultData.rentToValueYearEnd).toFixed(2)}`}%</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p>Gross Rent Multiplier</p>
                            <p></p>
                        </div>
                        <div className={classes.labelValue} style={{ paddingLeft: "10px" }} >
                            <p>At Purchase</p>
                            <p>{`${parseFloat(resultData.GRM).toFixed(2)}`}</p>
                        </div>
                        <div className={classes.labelValue} style={{ paddingLeft: "10px" }} >
                            <p>At Year End:</p>
                            <p>{`${parseFloat(resultData.GRMYearEnd).toFixed(2)}`}</p>
                        </div>
                    </div>
                    <div className={classes.subAllDetailsCont} >
                        <div className={classes.labelValue} style={{ marginTop: "40px" }} >
                            <p style={parseFloat(resultData.equityMultiple) > 1 ? {} : redColor} >Equity Multiple:</p>
                            <p style={parseFloat(resultData.equityMultiple) > 1 ? {} : redColor} >{`${parseFloat(resultData.equityMultiple).toFixed(2)}`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.breakEvenRatio) < 99 ? {} : redColor} >Break Even Ratio:</p>
                            <p style={parseFloat(resultData.breakEvenRatio) < 99 ? {} : redColor} >{`${parseFloat(resultData.breakEvenRatio).toFixed(2)}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.debtYield) > 0 ? {} : redColor} >Debt Yield:</p>
                            <p style={parseFloat(resultData.debtYield) > 0 ? {} : redColor} >{`${parseFloat(resultData.debtYield).toFixed(2)}%`}</p>
                        </div>
                        <div className={classes.labelValue} >
                            <p style={parseFloat(resultData.debtCoverageRatio) >= 1 ? {} : redColor} >Debt Coverage Ratio:</p>
                            <p style={parseFloat(resultData.debtCoverageRatio) >= 1 ? {} : redColor} >{`${parseFloat(resultData.debtCoverageRatio).toFixed(2)}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
