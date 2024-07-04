import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import projectionIcon from "../../Assets/ProjectionIcon.svg"
import projectionGray from "../../Assets/projectionGray.svg"
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import reportIcon from "../../Assets/ReportIcon.svg"
import EditIcon from '@material-ui/icons/Edit';
import PieChartIcon from '@material-ui/icons/PieChart';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import SmallReportCard from "../ProjectAnalysis/SmallReportCard.js"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import DownloadAllCsv from "./Projections/DownloadAllCsv";
import ReportShareDialog from "./ReportShareDialog";
import MyPopOver from "../styled/CommonComponents/MyPopOver";
import ReportPdf from "./ReportPdf"
import NormalDialog from "../styled/CommonComponents/NormalDialog";
import CustomBtn from "../styled/CommonComponents/CustomBtn";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    rowMainCont: {
        width: "100%",
        padding: "10px 20px",
        margin: "10px 0px",
        display: "flex",
        borderRadius: "12px",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            alignItems: "initial",
        },
        [theme.breakpoints.down('xs')]: {
            padding: "10px",
        }
    },
    svgStyle: {
        width: "90px",
        height: "auto",
        marginRight: "20px",
        [theme.breakpoints.down('xs')]: {
            marginBottom: "15px"
        }
    },
    displayFLex: {
        display: "flex",
        alignItems: "center",
    },
    imgDataCont: {
        display: "flex",
        alignItems: "center",
        width: "calc(100% - 215px)",
        cursor: "pointer",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        },
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column",
            alignItems: "flex-start",
        }
    },
    btn: {
        margin: "0px 15px"
    },
    actionAndDataCont: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        [theme.breakpoints.down('xs')]: {
            marginTop: "20px"
        }
    },
    textStyle: {
        fontSize: "14px",
        fontWeight: "500",
        [theme.breakpoints.down('xs')]: {
            fontSize: "10px",
        }
    },
    title: {
        color: "#3E4958",
        fontSize: "18px",
        fontWeight: "510",
        display: "flex",
        alignItems: "center",
    },
    iconCri: {
        display: "flex",
        alignItems: "center",
    },
    purchaseText: {
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "12px"
    },
    purchaseStyle: {
        fontSize: "19px",
        fontWeight: "500",
        color: theme.palette.primary.main,
        marginTop: "5px"
    },
    titleStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 15px",
        backgroundColor: theme.palette.primary.main
    },
    rowCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSide: {
        width: "35%",
        fontSize: "15px",
        fontWeight: "510",
    },
    rightSide: {
        width: "65%"
    },
    downloadBtnCont: {
        width: "65%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
    },
    linkCont: {
        width: "100%",
        display: "flex",
        border: "1px solid gray",
        overflowX: "hidden",
        margin: "15px 0px"
    },
    link: {
        width: "calc(100% - 80px)",
        padding: "6px",
        backgroundColor: "#efeded",
        overflowX: "hidden",
        fontSize: "13px"
    },
    socialMediaCont: {
        display: "flex",
        alignItems: "center",
    },
    text: {
        fontSize: "15px",
        fontWeight: "500",
    },
    onClick: {
        padding: "0px 6px",
        borderLeft: "1px solid gray",
        cursor: "pointer",
        backgroundColor: "#d3d1d1"
    },
    copy: {
        padding: "6px",
        borderLeft: "1px solid gray",
        cursor: "pointer",
        backgroundColor: "#d3d1d1"
    },
    btnCont: {
        display: "flex",
        alignItems: "center",
        padding: "4px 6px",
        border: "1px solid gray",
        borderRadius: "3px",
        backgroundColor: "#efeded",
        cursor: "pointer",
    },
    divider: {
        height: '15px',
        width: "1px",
        backgroundColor: "#9E9E9E",
        margin: "0px 5px"
    },
    endArr: {
        fontSize: "18px",
        marginLeft: "15px",
    },
    actionCont: {
        padding: "10px",
        "& div": {
            cursor: "pointer",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            color: "black"
        }
    },
    actionIcon: {
        marginRight: "7px"
    },
    inputCont: {

    },
    btnCont: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    }
}));

export default function SingleReportRow(props) {
    const {
        report, projectData, setReportId, setCurrentReport,
        setReportType, setReportName, setView, setOpExpenseData,
        setResultData, deleteFun
    } = props
    const classes = useStyles();
    const theme = useTheme();

    const setProjectData = (data) => { }
    const [resultData, setMyResultData] = useState(null);
    const [pieExpenseData, setExpenseData] = useState([]);
    const [pieHoldingData, setHoldingData] = useState([]);
    const [criteriaArr, setCriteriaArr] = useState([]);
    const [cashFlow, setCashFlow] = useState(0);
    const [capRate, setCapRate] = useState(0);
    const [coc, setCoc] = useState(0);
    const [profit, setProfit] = useState(0);
    const [roi, setRoi] = useState(0);
    const [annualizedROI, setAnnualizedROI] = useState(0);
    const [expense, setExpense] = useState({})
    const [taxDeductions, setTaxDeductions] = useState({})
    const [saleAnalysis, setSaleAnalysis] = useState({})
    const [cashFlowDownload, setCashFlowDownload] = useState({})
    const [equity, setEquity] = useState({})
    const [invReturns, setInvReturns] = useState({})
    const [financialRatio, setRatio] = useState({})
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [piePurchaseData, setPiePurchaseData] = useState()
    const [pieRehabData, setPieRehabData] = useState()
    const [pieIncomeData, setPieIncomeData] = useState([])
    const [pieRefinanceData, setPieRefinanceData] = useState()
    const [pieSellingData, setPieSellingData] = useState()
    const [incomePieChart, setIncomePieChart] = useState([]);
    const [rehabOperatingCostsItemized, setRehabOperatingCostsItemize] = useState()
    const [openDialog, setOpenDialog] = useState(false)
    const [status, setStatus] = useState(false)
    const [openTitleEdit, setOpenTitleEdit] = useState(false)
    const [title, setTitle] = useState(report?.reportTitle)
    const [yearsArr, setYearsArr] = useState([])


    useEffect(() => {
        let itr = 0;
        if (report?.refinanceLoanTerm && report?.reportType === "BRRRR") {
            itr = Number(report?.refinanceLoanTerm);
        } else if (report?.LoanTerm && report?.reportType === "Rental") {
            itr = Number(report?.LoanTerm);
        } else {
            itr = 30;
        }

        let arr = []
        for (let i = 0; i < itr; i++) {
            arr.push(i);
        }
        setYearsArr(arr)
    }, [])


    const handleCloseShare = () => {
        setOpenTitleEdit(false)
    }

    useEffect(() => {
        let localPieIncomeData = [...pieIncomeData]
        let grossObj = new Object({
            name: "Gross_Rent",
            value: Number(parseFloat(resultData?.GrossRentPerMonth).toFixed(2))
        })
        localPieIncomeData.push(grossObj)
        setIncomePieChart(localPieIncomeData)
    }, [pieIncomeData, resultData])

    useEffect(() => {
        if (resultData) {
            let cf = resultData?.LeveredCashFlow;
            if (cf && cf !== 0) {
                cf = cf / 12;
                cf = cf.toFixed(2)
                setCashFlow(cf)
            }

            let cr = resultData?.capRate;
            if (cr && cr !== 0) {
                cr = cr.toFixed(2)
                setCapRate(cr)
            }

            let cc = resultData?.COC;
            if (cc && cc !== 0) {
                cc = cc.toFixed(2)
                setCoc(cc)
            }

            let getRoi = resultData?.ROI;
            if (getRoi && getRoi !== 0) {
                getRoi = getRoi.toFixed(2)
                setRoi(getRoi)
            }

            let getAnnualizedROI = resultData?.annualizedROI;
            if (getAnnualizedROI && getAnnualizedROI !== 0) {
                getAnnualizedROI = getAnnualizedROI.toFixed(2)
                setAnnualizedROI(getAnnualizedROI)
            }

            let getProfitFlip = resultData?.profitFlip;
            if (getProfitFlip && getProfitFlip !== 0) {
                getProfitFlip = getProfitFlip.toFixed(2)
                setProfit(getProfitFlip)
            }
        }
    }, [resultData])


    const openWorkSheet = () => {
        setReportId(report?._id);
        setCurrentReport(report);
        setReportType(report?.reportType);
        setReportName(report?.reportTitle);
        setView("worksheet");
    }

    const viewReport = () => {
        setCurrentReport(report);
        setResultData(resultData)
        setReportId(report?._id);
        setReportType(report?.reportType);
        setReportName(report?.reportTitle);
        setView("analysisReport");
    }

    const viewProjection = () => {
        setOpExpenseData(pieExpenseData);
        setCurrentReport(report);
        setResultData(resultData)
        setReportId(report?._id);
        setReportType(report?.reportType);
        setReportName(report?.reportTitle);
        setView("projection");
    }

    const shareReport = () => {
        setOpenShareDialog(true)
    }

    function numberWithCommas(x) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return 0;
        }
    }


    useEffect(() => {
        let criteriaArr = [];

        if (resultData && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnPurchasePriceBool && report?.purchasePrice && projectData?.purchasePolicy?.[report?.reportType]?.purchasePriceLimit) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.purchasePriceLimit >= report?.purchasePrice) {
                criteriaArr.push({
                    label: "Purchase Price",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Purchase Price",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (resultData && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnTotalCashNeededBool && projectData?.purchasePolicy?.[report?.reportType]?.TotalCashNeededLimit && resultData?.totalCashNeeded) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.TotalCashNeededLimit >= resultData?.totalCashNeeded) {
                criteriaArr.push({
                    label: "Total Cash Needed",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Total Cash Needed",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType === "BRRRR" && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnTotalCashInvestedBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.TotalCashInvestedLimit && resultData.totalCashInvested) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.TotalCashInvestedLimit >= resultData.totalCashInvested) {
                criteriaArr.push({
                    label: "Total Cash Invested",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Total Cash Invested",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOn70RuleBool && resultData) {
            if (resultData?.is70Rule) {
                criteriaArr.push({
                    label: "70% Rule",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "70% Rule",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnPricePerSqFtBool && resultData && resultData.pricePerSq && projectData?.purchasePolicy?.[report?.reportType]?.pricePerSqFtLimit) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.pricePerSqFtLimit >= resultData.pricePerSq) {
                criteriaArr.push({
                    label: "Price Per SqFt",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Price Per SqFt",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnARVPerSqFtBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.aRVPerSqFtLimit && resultData.arvPerSq) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.aRVPerSqFtLimit >= resultData.arvPerSq) {
                criteriaArr.push({
                    label: "ARV Per SqFt",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "ARV Per SqFt",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOn1RuleBool && resultData) {
            if (resultData?.is1Rule) {
                criteriaArr.push({
                    label: "1% Rule",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "1% Rule",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOn2RuleBool && resultData) {
            if (resultData?.is2Rule) {
                criteriaArr.push({
                    label: "2% Rule",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "2% Rule",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOn50RuleBool && resultData) {
            if (resultData?.is50Rule) {
                criteriaArr.push({
                    label: "50% Rule",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "50% Rule",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnCashFlowBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.cashFlowLimit && resultData.LeveredCashFlow) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.cashFlowLimit <= parseFloat(resultData.LeveredCashFlow) / 12) {
                criteriaArr.push({
                    label: "Monthly Cash Flow",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Monthly Cash Flow",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnCOCBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.cOCLimit && resultData?.COC) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.cOCLimit <= resultData?.COC) {
                criteriaArr.push({
                    label: "Cash on Cash Return",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Cash on Cash Return",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnROEBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.rOELimit && resultData.ROE) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.rOELimit <= resultData.ROE) {
                criteriaArr.push({
                    label: "Return on Equity",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Return on Equity",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnROIBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.rOILimit && resultData?.ROI) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.rOILimit <= resultData?.ROI) {
                criteriaArr.push({
                    label: "Return on Investment",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Return on Investment",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnIRRBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.iRRLimit && resultData?.LeveredIRRArray[0]) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.iRRLimit <= resultData?.LeveredIRRArray[0]) {
                criteriaArr.push({
                    label: "Internal Rate of Return",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Internal Rate of Return",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaAnnualizedROIBool && resultData && report?.annualizedROILimit && resultData?.annualizedROI) {
            if (report?.annualizedROILimit <= resultData?.annualizedROI) {
                criteriaArr.push({
                    label: "Annualized ROI",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Annualized ROI",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnRentToValueBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.rentToValueLimit && resultData.rentToValue) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.rentToValueLimit <= resultData.rentToValue) {
                criteriaArr.push({
                    label: "Rent To Value",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Rent To Value",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnGRMBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.gRMLimit && resultData.GRM) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.gRMLimit >= resultData.GRM) {
                criteriaArr.push({
                    label: "Gross Rent Multiplier",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Gross Rent Multiplier",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnEquityMultipleBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.equityMultipleLimit && resultData.equityMultiple) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.equityMultipleLimit <= resultData.equityMultiple) {
                criteriaArr.push({
                    label: "Equity Multiple",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Equity Multiple",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnBreakEvenRatioBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.breakEvenRatioLimit && resultData.breakEvenRatio) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.breakEvenRatioLimit >= resultData.breakEvenRatio) {
                criteriaArr.push({
                    label: "Break Even Ratio",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Break Even Ratio",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnLoanToCostRatioBool && resultData && report?.isFinancing && resultData.loanToCost && projectData?.purchasePolicy?.[report?.reportType]?.loanToCostRatioLimit) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.loanToCostRatioLimit >= resultData.loanToCost) {
                criteriaArr.push({
                    label: "Loan To Cost",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Loan To Cost",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnLoanToValueRatioBool && resultData && resultData.loanToValue && projectData?.purchasePolicy?.[report?.reportType]?.loanToValueRatioLimit && report?.isFinancing) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.loanToValueRatioLimit >= resultData.loanToValue) {
                criteriaArr.push({
                    label: "Loan To Value",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Loan To Value",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnDebtCoverageRatioBool && resultData && resultData.debtCoverageRatio && projectData?.purchasePolicy?.[report?.reportType]?.debtCoverageRatioLimit && report?.isFinancing) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.debtCoverageRatioLimit <= resultData.debtCoverageRatio) {
                criteriaArr.push({
                    label: "Debt Coverage Ratio",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Debt Coverage Ratio",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (report?.reportType !== "Flip" && criteriaArr.length < 3 && projectData?.purchasePolicy?.[report?.reportType]?.criteriaOnDebtYieldBool && resultData && projectData?.purchasePolicy?.[report?.reportType]?.debtYieldLimit && resultData.debtYield && report?.isFinancing) {
            if (projectData?.purchasePolicy?.[report?.reportType]?.debtYieldLimit <= resultData.debtYield) {
                criteriaArr.push({
                    label: "Debt Yield",
                    isDefult: false,
                    pass: true
                })
            } else {
                criteriaArr.push({
                    label: "Debt Yield",
                    isDefult: false,
                    pass: false
                })
            }
        }

        if (criteriaArr.length === 0) {
            criteriaArr.push({
                label: "Criteria_1",
                isDefult: true,
                pass: false
            })
            criteriaArr.push({
                label: "Criteria_2",
                isDefult: true,
                pass: false
            })
            criteriaArr.push({
                label: "Criteria_3",
                isDefult: true,
                pass: false
            })
        } else if (criteriaArr.length === 1) {
            criteriaArr.push({
                label: "Criteria_2",
                isDefult: true,
                pass: false
            })
            criteriaArr.push({
                label: "Criteria_3",
                isDefult: true,
                pass: false
            })
        } else if (criteriaArr.length === 2) {
            criteriaArr.push({
                label: "Criteria_3",
                isDefult: true,
                pass: false
            })
        }

        setCriteriaArr(criteriaArr)
    }, [report, resultData, projectData])




    useEffect(() => {
        if (report && report?.reportType !== "Flip") {

            let exp = {};
            pieExpenseData.forEach((data, index) => {
                let keyName = data?.name;
                let arr = resultData?.ExpenseArray[index];
                exp[keyName] = arr;
            });
            exp["Operating Expenses"] = resultData?.operatingExpenseArray;
            setExpense(exp);

            let tax = {};
            tax["Operating Expenses"] = resultData?.operatingExpenseArray;
            tax["Loan Interest"] = resultData?.loanInterestArray;
            tax["Depreciation"] = resultData?.depreciationArray;
            tax["Total Deductions"] = resultData?.totalDeductionArray;
            setTaxDeductions(tax);


            let sale = {};
            sale["Equity"] = resultData?.totalEquityArray;
            sale["Selling Costs"] = resultData?.sellingCostsArray;
            sale["Sale Proceeds"] = resultData?.saleProceedsArray;
            sale["Cumulative Cash Flow"] = resultData?.cumulativeCashFlowArray;
            sale["Total Cash Invested"] = resultData?.totalCashInvestedArray;
            sale["Total Profit"] = resultData?.totalProfitArray;
            setSaleAnalysis(sale);


            let cf = {};
            cf["Operating Income"] = resultData?.operatingIncomeArray;
            cf["Operating Expenses"] = resultData?.operatingExpenseArray;
            if (resultData?.loanPayment) {
                cf["Loan Payments"] = resultData?.loanPaymentArray;
                cf["Cash Flow"] = resultData?.LeveredCashFlowArray;
            }
            cf["Net Operating Income"] = resultData?.NOIArray;
            setCashFlowDownload(cf);


            let eqt = {};
            eqt["Property Value"] = resultData?.propertyValueArray;
            eqt["Loan Balance"] = resultData?.loanBalanceArray;
            eqt["Total Equity"] = resultData?.totalEquityArray;
            setEquity(eqt);


            let invret = {};
            invret["Cap Rate (Purchase Price)"] = resultData?.capRatePurchaseArray;
            invret["Cap Rate (Market Value)"] = resultData?.capRateMarketArray;
            invret["Cash on Cash Return"] = resultData?.COCArray;
            invret["Return on Equity"] = resultData?.ROEArray;
            if (resultData?.loanAmount != 0) {
                invret["Internal Rate of Return (Levered)"] = resultData?.LeveredIRRArray;
            }
            invret["Return on Investment"] = resultData?.ROIArray;
            setInvReturns(invret);


            let finRatio = {};
            finRatio["Rent To Value"] = resultData?.rentToValueArray;
            finRatio["Gross Rent Multiplier"] = resultData?.GRMArray;
            finRatio["Equity Multiple"] = resultData?.EquityMultipleArray;
            finRatio["Break Even Ratio"] = resultData?.breakEvenRatioArray;
            finRatio["Debt Yield"] = resultData?.debtYieldArray;
            finRatio["Debt Coverage Ratio"] = resultData?.debtCoverageRatioArray;
            setRatio(finRatio);

        }


        if (report?.reportType === "Rental") {
            let count = 0;
            if (report?.purchasePrice && report?.ARV && report?.propertyTax && report?.propertyInsurance && parseFloat(report?.ARV) >= parseFloat(report?.purchasePrice)) {
                count++;
            }
            if (!report?.isFinancing) {
                count++;
            } else if ((report?.LoanType === "Interest Only" && report?.DownPayment && report?.InterestRate) || (report?.LoanType === "Amortizing" && report?.DownPayment && report?.InterestRate && report?.LoanTerm)) {
                count++;
            }
            if (report?.Period && report?.GrossRent) {
                count++;
            }
            if (report?.Appreciation && report?.IncomeIncrease && report?.ExpenseIncrease && report?.SellingCosts) {
                count++;
            }
            if (count === 4) {
                setStatus(true)
            }
        } else if (report?.reportType === "BRRRR") {
            let count = 0;
            if (report?.purchasePrice && report?.ARV && report?.propertyTax && report?.propertyInsurance && report?.rehabTotal && report?.rehabPeriod && parseFloat(report?.ARV) >= parseFloat(report?.purchasePrice)) {
                count++;
            }
            if (!report?.isFinancing) {
                count++;
            } else if ((report?.LoanType === "Interest Only" && report?.DownPayment && report?.InterestRate) || (report?.LoanType === "Amortizing" && report?.DownPayment && report?.InterestRate && report?.LoanTerm)) {
                count++;
            }
            if (report?.refinanceTime && ((report?.LoanType === "Interest Only" && report?.remainingEquity && report?.refinanceInterestRate) || (report?.LoanType === "Amortizing" && report?.remainingEquity && report?.refinanceInterestRate && report?.refinanceLoanTerm))) {
                count++;
            }
            if (report?.Period && report?.GrossRent) {
                count++;
            }
            if (report?.Appreciation && report?.IncomeIncrease && report?.ExpenseIncrease && report?.SellingCosts) {
                count++;
            }
            if (count === 5) {
                setStatus(true)
            }
        } else if (report?.reportType === "Flip") {
            let count = 0;
            if (report?.purchasePrice && report?.ARV && report?.propertyTax && report?.propertyInsurance && report?.rehabTotal != 0 && report?.rehabPeriod && parseFloat(report?.ARV) >= parseFloat(report?.purchasePrice)) {
                count++;
            }
            if (!report?.isFinancing) {
                count++;
            } else if ((report?.LoanType === "Interest Only" && report?.DownPayment && report?.InterestRate) || (report?.LoanType === "Amortizing" && report?.DownPayment && report?.InterestRate && report?.LoanTerm)) {
                count++;
            }
            if (report?.rentalPeriod) {
                if (report?.rentalPeriod && report?.GrossRent && report?.sellingPrice && report?.sellingCostTotal) {
                    if (report?.sellingPrice >= report?.ARV) {
                        count++;
                    }
                }
            } else if (report?.sellingCostTotal) {
                count++;
            }
            if (count === 3) {
                setStatus(true)
            }
        }
    }, [report, resultData, projectData, pieExpenseData])



    return (
        <div className={classes.rowMainCont}>
            {(report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "Rental" && report?.Appreciation && report?.IncomeIncrease && report?.SellingCosts && report?.ExpenseIncrease && report?.purchasePrice && report?.ARV && report?.propertyInsurance && report?.propertyTax && report?.GrossRent) ||
                (report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "BRRRR" && report?.Appreciation && parseInt(report?.rehabPeriod) > 1 && report?.IncomeIncrease && report?.SellingCosts && report?.ExpenseIncrease && report?.purchasePrice && report?.ARV && report?.propertyInsurance && report?.propertyTax && report?.GrossRent) ||
                (report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "Flip" && report?.purchasePrice && parseInt(report?.rehabPeriod) > 1 && report?.ARV && report?.propertyInsurance && report?.propertyTax) ?
                (
                    <SmallReportCard
                        currentReport={report}
                        projectData={projectData}
                        setResultData={setMyResultData}
                        setExpenseData={setExpenseData}
                        setHoldingData={setHoldingData}
                        setPiePurchaseData={setPiePurchaseData}
                        setPieRehabData={setPieRehabData}
                        setPieIncomeData={setPieIncomeData}
                        setPieRefinanceData={setPieRefinanceData}
                        setPieSellingData={setPieSellingData}
                        setRehabOperatingCostsItemize={setRehabOperatingCostsItemize}
                    />
                ) : null}
            <div className={classes.imgDataCont} onClick={() => { openWorkSheet() }} >
                <img
                    src={reportIcon}
                    alt={"report"}
                    className={classes.svgStyle}
                />
                <div>
                    <div className={classes.title} >{report?.reportTitle} ({report?.reportType}) Property
                        {/* <EditIcon
                            onClick={() => { setOpenTitleEdit(true) }}
                            style={{ fontSize: "19px", marginTop: "6px", marginLeft: "7px" }}
                        /> */}
                    </div>
                    <div className={classes.displayFLex} style={{ margin: "14px 0px" }} >
                        {criteriaArr && criteriaArr.length > 0 && criteriaArr.map((criteria) => (
                            <p className={classes.textStyle} style={{ marginRight: "10px" }} >
                                {criteria?.isDefult ? (<>
                                    <span className={classes.iconCri} style={{ color: "gray" }} >
                                        <CancelIcon style={{ color: "gray", fontSize: "16px", marginRight: "10px" }} />
                                        {criteria?.label}
                                    </span>
                                </>) : (<>{criteria?.pass ? (<>
                                    <span className={classes.iconCri} >
                                        <CheckCircleIcon style={{ color: "green", fontSize: "16px", marginRight: "10px" }} />
                                        {criteria?.label}
                                    </span>
                                </>) : (<>
                                    <span className={classes.iconCri} >
                                        <CancelIcon style={{ color: "red", fontSize: "16px", marginRight: "10px" }} />
                                        {criteria?.label}
                                    </span>
                                </>)}</>)}
                            </p>
                        ))}
                    </div>
                    <div className={classes.displayFLex}  >
                        {resultData ? (<>
                            {report?.reportType === "Flip" ? (<>
                                <p className={classes.textStyle} >{profit > 0 ? (<span style={{ color: theme.palette.primary.main }} >${numberWithCommas(profit)} Profit</span>) : (<span style={{ color: "red" }} >${numberWithCommas(profit)} Profit</span>)} </p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} >{roi > 0 ? (<span style={{ color: theme.palette.primary.main }} >{numberWithCommas(roi)}% ROI</span>) : (<span style={{ color: "red" }} >{numberWithCommas(roi)}% ROI</span>)}</p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} >{annualizedROI > 0 ? (<span style={{ color: theme.palette.primary.main }} >{numberWithCommas(annualizedROI)}% Annualized ROI</span>) : (<span style={{ color: "red" }} >{numberWithCommas(annualizedROI)}% Annualized ROI</span>)}</p>
                            </>) : (<>
                                <p className={classes.textStyle} >{cashFlow >= 0 ? (<span style={{ color: theme.palette.primary.main }} >${numberWithCommas(cashFlow)}/mo Cash Flow</span>) : (<span style={{ color: "red" }} >${numberWithCommas(cashFlow)}/mo Cash Flow</span>)} </p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} >{capRate > 0 ? (<span style={{ color: theme.palette.primary.main }} >{numberWithCommas(capRate)}% Cap Rate</span>) : (<span style={{ color: "red" }} >{numberWithCommas(capRate)}% Cap Rate</span>)}</p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} >{coc > 0 ? (<span style={{ color: theme.palette.primary.main }} >{numberWithCommas(coc)}% COC</span>) : (<span style={{ color: "red" }} >{numberWithCommas(coc)}% COC</span>)}</p>
                            </>)}
                        </>) : (<>
                            {report?.reportType === "Flip" ? (<>
                                <p className={classes.textStyle} ><span style={{ color: "gray" }} >$0 Profit</span></p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} ><span style={{ color: "gray" }} >0% ROI</span></p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} ><span style={{ color: "gray" }} >0% Annualized ROI</span></p>
                            </>) : (<>
                                <p className={classes.textStyle} ><span style={{ color: "gray" }} >$0/mo Cash Flow</span></p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} ><span style={{ color: "gray" }} >0% Cap Rate</span></p><div className={classes.divider} ></div>
                                <p className={classes.textStyle} ><span style={{ color: "gray" }} >0% COC</span></p>
                            </>)}
                        </>)}
                    </div>
                </div>
            </div>
            <div className={classes.actionAndDataCont} >
                <div style={{ fontSize: "13px", opacity: "0.8" }} >07/09/2022</div>
                <div className={classes.purchaseStyle}>$ {numberWithCommas(report?.purchasePrice)}</div>
                <div className={classes.purchaseText} >Purchase Price</div>
                <div className={classes.displayFLex} >
                    <Tooltip title="Report Analysis" placement="top">
                        {(report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "Rental" && report?.Appreciation && report?.IncomeIncrease && report?.SellingCosts && report?.ExpenseIncrease && report?.purchasePrice && report?.ARV && report?.propertyInsurance && report?.propertyTax && report?.GrossRent) ||
                            (report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "BRRRR" && report?.Appreciation && parseInt(report?.rehabPeriod) > 1 && report?.IncomeIncrease && report?.SellingCosts && report?.ExpenseIncrease && report?.purchasePrice && report?.ARV && report?.propertyInsurance && report?.propertyTax && report?.GrossRent) ||
                            (report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "Flip" && report?.purchasePrice && parseInt(report?.rehabPeriod) > 1 && report?.ARV && report?.propertyInsurance && report?.propertyTax) ?
                            (
                                <PieChartIcon
                                    className={classes.btn}
                                    style={{
                                        color: theme.palette.primary.main,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => { viewReport() }}
                                />
                            ) : (
                                <PieChartIcon className={classes.btn} style={{ cursor: "default", color: "gray" }} />
                            )}
                    </Tooltip>
                    <Tooltip title="Projection Analysis" placement="top">
                        {(report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "Rental" && report?.Appreciation && report?.IncomeIncrease && report?.SellingCosts && report?.ExpenseIncrease && report?.purchasePrice && report?.ARV && report?.propertyInsurance && report?.propertyTax && report?.GrossRent) ||
                            (report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "BRRRR" && report?.Appreciation && parseInt(report?.rehabPeriod) > 1 && report?.IncomeIncrease && report?.SellingCosts && report?.ExpenseIncrease && report?.purchasePrice && report?.ARV && report?.propertyInsurance && report?.propertyTax && report?.GrossRent) ||
                            (report?._id && projectData?.area > 0 && projectData && report && report?.reportType === "Flip" && report?.purchasePrice && parseInt(report?.rehabPeriod) > 1 && report?.ARV && report?.propertyInsurance && report?.propertyTax) ?
                            (<>
                                <img
                                    src={projectionIcon}
                                    style={{ width: "20px", margin: "0px 15px", cursor: 'pointer' }}
                                    onClick={() => { viewProjection() }}
                                />
                            </>) : (
                                <img src={projectionGray} style={{ cursor: "default", width: "20px", margin: "0px 15px" }} />
                            )}
                    </Tooltip>
                    <Tooltip title="More" placement="top">
                        <MyPopOver
                            closeOnClick={true}
                            appearContent={
                                <MoreVertIcon
                                    style={{ color: theme.palette.primary.main, cursor: "pointer", marginBottom: "-5px" }}
                                />
                            }
                            showContent={<div className={classes.actionCont} >
                                <div onClick={() => { openWorkSheet() }} ><EditIcon className={classes.actionIcon} /> Edit</div>
                                <div onClick={() => {
                                    if (status) {
                                        shareReport()
                                    }
                                }}
                                    style={status ? {} : { cursor: "default", opacity: "0.6" }}
                                ><ShareIcon className={classes.actionIcon} /> Share</div>
                                <div
                                    onClick={() => {
                                        if (status) {
                                            setOpenDialog(true)
                                        }
                                    }}
                                    style={status ? {} : { cursor: "default", opacity: "0.6" }}
                                ><PictureAsPdfIcon className={classes.actionIcon} /> Download PDF</div>
                                {status && report?.reportType !== "Flip" ? (
                                    <DownloadAllCsv
                                        incomeData={{
                                            "Gross Rent": resultData?.grossRentArray,
                                            "Vacancy Expense": resultData?.vacancyArray,
                                            "Other Income": resultData?.otherIncomeArray,
                                            "Operating Income": resultData?.operatingIncomeArray,
                                        }}
                                        yearsArr={yearsArr}
                                        expenseData={expense}
                                        cashFlowData={cashFlowDownload}
                                        taxBenefitsAndDeductionData={taxDeductions}
                                        equityData={equity}
                                        salesData={saleAnalysis}
                                        investmentData={invReturns}
                                        financialRatioData={financialRatio}
                                        currentReport={report}
                                        projectData={projectData}
                                        appreciation={parseFloat(report?.Appreciation).toFixed(2)}
                                        incomeIncrease={parseFloat(report?.IncomeIncrease).toFixed(2)}
                                        expenseIncrease={parseFloat(report?.ExpenseIncrease).toFixed(2)}
                                        sellingCosts={parseFloat(report?.SellingCosts).toFixed(2)}
                                        landingPage={true}
                                        clickContent={
                                            <div>
                                                <GetAppIcon className={classes.actionIcon} />
                                                Download CSV
                                            </div>
                                        }
                                    />
                                ) : (
                                    <div style={{ cursor: "default", opacity: "0.6" }} >
                                        <GetAppIcon className={classes.actionIcon} />
                                        Download CSV
                                    </div>
                                )}
                                <div onClick={deleteFun} ><DeleteIcon className={classes.actionIcon} /> Delete</div>
                            </div>}
                        />
                    </Tooltip>
                </div>
            </div>
            <ReportPdf
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                currentReport={report}
                projectData={projectData}
                resultData={resultData}
                piePurchaseData={piePurchaseData}
                pieRehabData={pieRehabData}
                incomePieChart={incomePieChart}
                pieExpenseData={pieExpenseData}
                pieIncomeData={pieIncomeData}
                rehabOperatingCostsItemized={rehabOperatingCostsItemized}
                setProjectData={setProjectData}
                pieHoldingData={pieHoldingData}
                pieRefinanceData={pieRefinanceData}
                pieSellingData={pieSellingData}
            />
            <ReportShareDialog
                report={report}
                projectData={projectData}
                openShareDialog={openShareDialog}
                setOpenShareDialog={setOpenShareDialog}
            />
            <NormalDialog
                openDialog={openTitleEdit}
                handleCloseShare={handleCloseShare}
                pageTitle={"Edit Report Title"}
                content={<div className={classes.inputCont} >
                    <h3>Title</h3>
                    <TextField
                        id="outlined-basic"
                        label="Outlined"
                        variant="outlined"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                    />
                    <div className={classes.btnCont} >
                        <div></div>
                        <CustomBtn
                            text={"Save"}
                            onClick={() => { }}
                        />
                    </div>
                </div>}
            />
        </div>
    );
}
