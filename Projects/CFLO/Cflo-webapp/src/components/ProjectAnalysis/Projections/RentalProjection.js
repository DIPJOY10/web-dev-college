import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import ProjectionTable from "../ProjectionTable";
import LineGraph from "../LineChart";
import DownloadExcel from "./DownloadExcel";
import EditIcon from "@material-ui/icons/Edit";
import DownloadAllCsv from "./DownloadAllCsv";
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import { useMediaQuery } from '@material-ui/core';
import configObject from "../../../config/index"
import HomeIcon from '@material-ui/icons/Home';
import AnalysisHeader from "../../styled/CommonComponents/AnalysisHead";
import MyPopOver from "../../styled/CommonComponents/MyPopOver";
import FilterListIcon from '@material-ui/icons/FilterList';
import CustomBtn from "../../styled/CommonComponents/CustomBtn";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import GetAppIcon from '@material-ui/icons/GetApp';
import ReportShareDialog from "../ReportShareDialog";


const TypesArr = ["Milestones", "5 Years", "10 Years", "20 Years", "All Years"]

const useStyles = makeStyles((theme) => ({
  calculate_header: {
    display: "flex",
    justifyContent: "center",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    borderRadius: "15px",
    alignItems: "center",
    flexDirection: "column",
    width: "20%",
    height: "100px",
    "& p": {
      fontSize: "16px",
      marginTop: "10px",
      color: "#009C79"
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
    },
    [theme.breakpoints.down('xs')]: {
      "& p": {
        marginTop: "5px",
        fontSize: "11px"
      },
      "& h4": {
        color: "#626060",
        fontWeight: "550",
        fontSize: "13px"
      },
    },
  },
  calc_head_container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "15px 0px 50px",
    flexWrap: "wrap",
  },
  actionIcon: {
    marginRight: "7px"
  },
  graphContainer: {
    marginBottom: "30px",
    padding: "15px 0px",
    borderRadius: "18px"
  },
  mainCont: {
    width: "100%",
    padding: `5px ${theme.sideMargin.fullScreen} 20px`,
    [theme.breakpoints.down('md')]: {
      padding: `5px ${theme.sideMargin.mdScreen} 20px`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: `5px ${theme.sideMargin.smScreen} 20px`,
    },
    [theme.breakpoints.down('xs')]: {
      padding: `3px ${theme.sideMargin.sxScreen} 20px`,
    },
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
  nameDescHeadCont: {
    margin: "60px 0px 15px 0px",
    "& h3": {
      fontSize: "22px",
      fontWeight: "510",
    },
    "& h4": {
      fontSize: "14px",
      color: "#808494",
      margin: "3px 0px",
      fontWeight: "400"
    },
    "& p": {
      fontSize: "14px",
      color: "#626060",
      margin: "10px 0px"
    },
    [theme.breakpoints.down('sm')]: {
      "& h3": {
        fontSize: "18px",
        fontWeight: "510",
      },
      "& h4": {
        fontSize: "13px",
        color: "#808494",
        margin: "3px 0px",
        fontWeight: "400"
      },
      "& p": {
        fontSize: "13px",
        color: "#626060",
        margin: "10px 0px"
      },
    }
  },
  nameBtnCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterCont: {
    padding: "7px",
    "& div": {
      padding: "5px 15px",
      fontSize: "16px",
      cursor: "pointer",
      fontWeight: "500"
    },
    [theme.breakpoints.down('sm')]: {
      padding: "4px",
      "& div": {
        padding: "5px 10px",
        fontSize: "11px",
        cursor: "pointer",
        fontWeight: "500"
      },
    }
  },
  selectorCont: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: "40px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "510",
    color: "#00345D",
    [theme.breakpoints.down("xs")]: {
      fontSize: "17px",
    }
  },
}));

export default function RentalProjection({
  currentReport,
  resultData,
  expenseData,
  setView,
  yearsArr,
  setYearsArr,
  isViewOnly,
  pageHight,
  projectData
}) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { teamId } = useParams();
  const [expense, setExpense] = useState({});
  const [cashFlow, setCashFlow] = useState({});
  const [taxDeductions, setTaxDeductions] = useState({});
  const [saleAnalysis, setSaleAnalysis] = useState({});
  const [equity, setEquity] = useState({});
  const [openShareDialog, setOpenShareDialog] = useState(false)
  const [invReturns, setInvReturns] = useState({});
  const [financialRatio, setRatio] = useState({});
  const [incomeData, setIncomeData] = useState({});
  const [cashFlowDataKeys, setCashFlowDataKeys] = useState([]);
  const [cashFlowGraphData, setCashFlowGraphData] = useState([]);
  const [equityDataKeys, setEquityDataKeys] = useState([]);
  const [equityGraphData, setEquityGraphData] = useState([]);
  const [iterations, setIterations] = useState(0);
  const [selectedType, setSelectedType] = useState("All Years")

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const onTypeSelect = (value) => {
    setSelectedType(value);
    let itr = 0;
    if (currentReport?.LoanTerm) {
      itr = Number(currentReport?.LoanTerm);
    }
    if (itr === 0) {
      itr = 30;
    }

    if (value === TypesArr[0]) {
      let yearIndexArr = []

      if (itr === 1) {
        yearIndexArr = [0]
      } else if (itr === 2) {
        yearIndexArr = [0, 1]
      } else if (itr === 3) {
        yearIndexArr = [0, 1, 2]
      } else if (itr === 4) {
        yearIndexArr = [0, 1, 2, 3]
      } else if (itr === 5) {
        yearIndexArr = [0, 1, 2, 4]
      } else if (itr <= 10) {
        yearIndexArr = [0, 1, 2, 4, itr - 1]
      } else if (itr <= 15) {
        yearIndexArr = [0, 1, 2, 4, 9, itr - 1]
      } else if (itr < 20) {
        yearIndexArr = [0, 1, 2, 4, 9, 14, itr - 1]
      } else {
        yearIndexArr = [0, 1, 2, 4, 9, 14]
        let limit = parseInt(itr / 10);
        limit = limit * 10;

        for (let i = 20; i <= limit; i = i + 10) {
          yearIndexArr.push(i - 1);
        }

        if (itr > limit) {
          yearIndexArr.push(itr - 1);
        }
      }
      setYearsArr(yearIndexArr)
    } else if (value === TypesArr[1]) {
      setYearsArr([0, 1, 2, 3, 4])
    } else if (value === TypesArr[2]) {
      setYearsArr([0, 1, 2, 4, 6, 9])
    } else if (value === TypesArr[3]) {
      setYearsArr([0, 1, 2, 4, 9, 14, 19])
    } else if (value === TypesArr[4]) {
      let arr = []
      for (let i = 0; i < itr; i++) {
        arr.push(i);
      }
      setYearsArr(arr)
    }
  }

  useEffect(() => {
    if (isViewOnly) {
      onTypeSelect("Milestones")
    } else {
      onTypeSelect("All Years")
    }
  }, [])

  useEffect(() => {
    // EXPENSE
    let OPEX = []
    let ROEX = []
    let exp = {};
    expenseData.forEach((data, index) => {
      let keyName = data.name;
      let arr = resultData.ExpenseArray[index];
      let modifiedArr = []
      if (yearsArr.length > 0) {
        yearsArr.map((index) => {
          modifiedArr.push(arr[index]);
        })
      }
      exp[keyName] = modifiedArr;
    });
    if (resultData.recurringTotal) {
      if (yearsArr.length > 0) {
        yearsArr.map((index) => {
          ROEX.push(resultData.recurringTotalArray[index]);
        })
      }
    }
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        OPEX.push(resultData.operatingExpenseArray[index]);
      })
    }
    exp["Rehab Operating Expenses"] = ROEX;
    exp["Operating Expenses"] = OPEX;
    setExpense(exp);

    // TAX BENEFITS & DEDUCTIONS
    let OE = []
    let LI = []
    let DA = []
    let TD = []
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        OE.push(resultData.operatingExpenseArray[index]);
        LI.push(resultData.loanInterestArray[index]);
        DA.push(resultData.depreciationArray[index]);
        TD.push(resultData.totalDeductionArray[index]);
      })
    }
    let tax = {};
    tax["Operating Expenses"] = OE;
    tax["Loan Interest"] = LI;
    tax["Depreciation"] = DA;
    tax["Total Deductions"] = TD;
    setTaxDeductions(tax);


    // SALE ANALYSIS
    let TE = []
    let SC = []
    let SP = []
    let CCF = []
    let TCI = []
    let TP = []
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        TE.push(resultData.totalEquityArray[index])
        SC.push(resultData.sellingCostsArray[index])
        SP.push(resultData.saleProceedsArray[index])
        CCF.push(resultData.cumulativeCashFlowArray[index])
        TCI.push(resultData.totalCashInvestedArray[index])
        TP.push(resultData.totalProfitArray[index])
      })
    }
    let sale = {};
    sale["Equity"] = TE;
    sale["Selling Costs"] = SC;
    sale["Sale Proceeds"] = SP;
    sale["Cumulative Cash Flow"] = CCF;
    sale["Total Cash Invested"] = TCI;
    sale["Total Profit"] = TP;
    setSaleAnalysis(sale);

    // CASH FLOW	
    let OI = []
    let OEX = []
    let NOI = []
    let LP = []
    let CF = []
    let PTCF = []
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        OI.push(resultData.operatingIncomeArray[index])
        OEX.push(resultData.operatingExpenseArray[index])
        NOI.push(resultData.NOIArray[index])
        if (resultData.loanPayment) {
          LP.push(resultData.loanPaymentArray[index])
          CF.push(resultData.LeveredCashFlowArray[index])
        }
        PTCF.push(resultData.postTaxCashFlowArray[index])
      })
    }
    let cf = {};
    cf["Operating Income"] = OI;
    cf["Operating Expenses"] = OEX;
    cf["Net Operating Income"] = NOI;
    if (resultData.loanPayment) {
      cf["Loan Payments"] = LP;
      cf["Cash Flow"] = CF;
    }
    // cf["Post Tax Cash Flow"] = PTCF;
    setCashFlow(cf);

    // EQUITY ACCUMULATION
    let PV = []
    let LB = []
    let TEQ = []
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        PV.push(resultData.propertyValueArray[index])
        LB.push(resultData.loanBalanceArray[index])
        TEQ.push(resultData.totalEquityArray[index])
      })
    }
    let eqt = {};
    eqt["Property Value"] = PV;
    eqt["Loan Balance"] = LB;
    eqt["Total Equity"] = TEQ;
    setEquity(eqt);


    // INVESTMENT RETURNS
    let CRPP = [];
    let CPMP = [];
    let COCR = []
    let ROE = []
    let ROI = []
    let IRRU = []
    let IRRL = []
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        CRPP.push(resultData.capRatePurchaseArray[index])
        CPMP.push(resultData.capRateMarketArray[index])
        COCR.push(resultData.COCArray[index])
        ROE.push(resultData.ROEArray[index])
        ROI.push(resultData.ROIArray[index])
        IRRU.push(resultData.UnleveredIRRArray[index])
        if (resultData.loanAmount != 0) {
          IRRL.push(resultData.LeveredIRRArray[index])
        }
      })
    }
    let invret = {};
    invret["Cap Rate (Purchase Price)"] = CRPP;
    invret["Cap Rate (Market Price)"] = CPMP;
    invret["Cash on Cash Return"] = COCR;
    invret["Return on Equity"] = ROE;
    invret["Return on Investment"] = ROI;
    invret["Internal Rate of Return (Unlevered)"] = IRRU;
    if (resultData.loanAmount != 0) {
      invret["Internal Rate of Return (Levered)"] = IRRL;
    }
    setInvReturns(invret);

    // FINANCIAL RATIOS
    let ROV = []
    let GRM = []
    let EM = []
    let BER = []
    let DY = []
    let DCR = []
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        ROV.push(resultData.rentToValueArray[index])
        GRM.push(resultData.GRMArray[index])
        EM.push(resultData.EquityMultipleArray[index])
        BER.push(resultData.breakEvenRatioArray[index])
        DY.push(resultData.debtYieldArray[index])
        DCR.push(resultData.debtCoverageRatioArray[index])
      })
    }
    let finRatio = {};
    finRatio["Rent To Value"] = ROV;
    finRatio["Gross Rent Multiplier"] = GRM;
    finRatio["Equity Multiple"] = EM;
    finRatio["Break Even Ratio"] = BER;
    finRatio["Debt Yield"] = DY;
    finRatio["Debt Coverage Ratio"] = DCR;
    setRatio(finRatio);

    // INCOME
    let GR = []
    let VE = []
    let OTI = []
    let OPI = []
    if (yearsArr.length > 0) {
      yearsArr.map((index) => {
        GR.push(resultData.grossRentArray[index])
        VE.push(resultData.vacancyArray[index])
        OTI.push(resultData.otherIncomeArray[index])
        OPI.push(resultData.operatingIncomeArray[index])
      })
    }
    const IcomeData = {
      "Gross Rent": GR,
      "Vacancy Expense": VE,
      "Other Income": OTI,
      "Operating Income": OPI,
    }
    setIncomeData(IcomeData)

    let itr = 0;
    if (yearsArr.length > 0) {
      itr = yearsArr.length;
    }
    setIterations(itr);
  }, [resultData, yearsArr])


  useEffect(() => {
    setCashFlowDataKeys(["Operating Income", "Cash Flow", "Operating Expense"]);
    setEquityDataKeys(["Property Value", "Total Equity", "Loan Balance"]);
    let len = yearsArr.length

    let cfGraphData = [];
    cfGraphData.push({
      name: 0,
      "Operating Income": 0,
      "Operating Expense": 0,
      "Cash Flow": 0,
    });
    for (let i = 0; i < len; i++) {
      cfGraphData.push({
        name: yearsArr[i] + 1,
        "Operating Income": resultData.operatingIncomeArray[yearsArr[i]],
        "Operating Expense": resultData.operatingExpenseArray[yearsArr[i]],
        "Cash Flow": resultData.LeveredCashFlowArray[yearsArr[i]],
      });
    }
    setCashFlowGraphData(cfGraphData);


    let eqtGraphData = [];
    eqtGraphData.push({
      name: 0,
      "Property Value": Number(currentReport?.purchasePrice),
      "Loan Balance": Number(resultData?.amountFinanced),
      "Total Equity": Number(resultData.downPaymentCash),
    });
    for (let i = 0; i < len; i++) {
      eqtGraphData.push({
        name: yearsArr[i] + 1,
        "Property Value": resultData.propertyValueArray[yearsArr[i]],
        "Loan Balance": resultData.loanBalanceArray[yearsArr[i]],
        "Total Equity": resultData.totalEquityArray[yearsArr[i]],
      });
    }
    setEquityGraphData(eqtGraphData);
  }, [resultData, yearsArr]);

  const pathArr = [
    {
      text: "Project",
      onClick: () => {
        history.push(`/projects/${teamId}`)
      }
    },
    {
      text: "Analysis",
      onClick: () => {
        setView("default");
      }
    },
    {
      text: "Worksheet",
      onClick: () => {
        setView("worksheet");
      }
    },
    {
      text: isSmall ? "Report" : "Report Analysis",
      onClick: () => {
        setView("analysisReport");
      }
    },
    {
      text: "Projections"
    }
  ]

  return (
    <div className={classes.mainCont} style={isViewOnly ? { padding: "0px" } : { marginTop: "0px" }} >
      <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden", margin: "0px", padding: "0px" } : { margin: "0px", padding: "0px" }} >
        {isViewOnly ? (
          <div className={classes.selectorCont} >
            <h3 className={classes.title} >Buy and Hold Projections</h3>
            <div>
              <MyPopOver
                closeOnClick={true}
                appearContent={
                  <CustomBtn
                    startPart={isSmall ? null : <FilterListIcon style={{ fontSize: "19px" }} />}
                    text={isSmall ? <FilterListIcon style={{ fontSize: "19px" }} /> : selectedType}
                    style={isSmall ? { padding: "7px 7px 2px" } : {}}
                  />
                }
                showContent={<div className={classes.filterCont} >
                  {TypesArr && TypesArr.map((type) => (
                    <div onClick={() => { onTypeSelect(type) }} >{type}</div>
                  ))}
                </div>}
              />
            </div>
          </div>
        ) : (
          <AnalysisHeader
            pageTitle={isSmall ? "Projections" : "Buy and Hold Projections"}
            pathArr={pathArr}
            imgSrc={projectData?.displayPicture?.url}
            propName={projectData?.displayName}
            isImgProps={true}
            propDetails={<>{projectData?.subCategory || "Nan"} \ {projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} BA \ {projectData?.roomNumbers || "Nan"} BR \ {`${projectData?.area || "Nan"} sqft`}</>}
            pageDesc={<>These projections show how this property will perform as a rental in the future. <a style={{ textDecoration: 'none', color: "#2196F3" }} href={configObject?.tutorialLinks?.brrrrLink} target="_blank" >View tutorial</a> </>}
            rightBtns={<>
              <CustomBtn
                startPart={isSmall ? null : <EditIcon style={{ fontSize: "19px" }} />}
                text={isSmall ? <EditIcon style={{ fontSize: "19px" }} /> : "Worksheet"}
                onClick={() => { setView("worksheet"); }}
                style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
              />
              <CustomBtn
                startPart={isSmall ? null : <PieChartRoundedIcon style={{ fontSize: "19px" }} />}
                text={isSmall ? <PieChartRoundedIcon style={{ fontSize: "19px" }} /> : "Report"}
                onClick={() => { setView("analysisReport"); }}
                style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
              />
              <MyPopOver
                closeOnClick={true}
                appearContent={
                  <CustomBtn
                    startPart={isSmall ? null : <FilterListIcon style={{ fontSize: "19px" }} />}
                    text={isSmall ? <FilterListIcon style={{ fontSize: "19px" }} /> : selectedType}
                    style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
                  />
                }
                showContent={<div className={classes.filterCont} >
                  {TypesArr && TypesArr.map((type) => (
                    <div onClick={() => { onTypeSelect(type) }} >{type}</div>
                  ))}
                </div>}
              />
              <MyPopOver
                closeOnClick={true}
                appearContent={
                  <CustomBtn
                    text={<MoreVertIcon style={isSmall ? { fontSize: "19px" } : {}} />}
                    style={{ padding: "7px 7px 2px" }}
                  />
                }
                showContent={<div className={classes.actionCont} >
                  <div onClick={() => { setOpenShareDialog(true) }} >
                    <ShareIcon className={classes.actionIcon} /> Share
                  </div>
                  <DownloadAllCsv
                    incomeData={{
                      "Gross Rent": resultData?.grossRentArray,
                      "Vacancy Expense": resultData?.vacancyArray,
                      "Other Income": resultData?.otherIncomeArray,
                      "Operating Income": resultData?.operatingIncomeArray,
                    }}
                    yearsArr={yearsArr}
                    expenseData={expense}
                    taxBenefitsAndDeductionData={taxDeductions}
                    equityData={equity}
                    cashFlowData={cashFlow}
                    salesData={saleAnalysis}
                    investmentData={invReturns}
                    financialRatioData={financialRatio}
                    currentReport={currentReport}
                    projectData={projectData}
                    appreciation={parseFloat(currentReport?.Appreciation).toFixed(2)}
                    incomeIncrease={parseFloat(currentReport?.IncomeIncrease).toFixed(2)}
                    expenseIncrease={parseFloat(currentReport?.ExpenseIncrease).toFixed(2)}
                    sellingCosts={parseFloat(currentReport?.SellingCosts).toFixed(2)}
                    landingPage={true}
                    clickContent={
                      <div>
                        <GetAppIcon className={classes.actionIcon} />
                        All CSV
                      </div>
                    }
                  />
                  <div onClick={() => { setView("default"); }} >
                    <HomeIcon className={classes.actionIcon} /> Home
                  </div>
                </div>}
              />
              <ReportShareDialog
                report={currentReport}
                projectData={projectData}
                setOpenShareDialog={setOpenShareDialog}
                openShareDialog={openShareDialog}
              />
            </>}
          />
        )}
        <div className={classes.calc_head_container}>
          <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
            <h4>Appreciation</h4>
            <p>{`${parseFloat(currentReport.Appreciation).toFixed(2)} % Per Year`}</p>
          </div>
          <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
            <h4>Income Increase</h4>
            <p>{`${parseFloat(currentReport.IncomeIncrease).toFixed(2)} % Per Year`}</p>
          </div>
          <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
            <h4>Expense Increase</h4>
            <p>{`${parseFloat(currentReport.ExpenseIncrease).toFixed(2)} % Per Year`}</p>
          </div>
          <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
            <h4>Selling Costs</h4>
            <p>{`${parseFloat(currentReport.SellingCosts).toFixed(2)} % of Price`}</p>
          </div>
        </div>
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Income</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={incomeData}
                  headerIteration={iterations}
                  title={"INCOME"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          pageHight={pageHight}
          reportType={currentReport.reportType}
          tablePrefix={{
            "Gross Rent": "+" + "\xa0\xa0\xa0" + "$",
            "Vacancy Expense": "-" + "\xa0\xa0\xa0" + "$",
            "Other Income": "+" + "\xa0\xa0\xa0" + "$",
            "Operating Income": "=" + "\xa0\xa0\xa0" + "$",
          }}
          tableHead={"INCOME"}
          tableData={incomeData}
          tableSuffix={""}
          iterations={iterations}
          indexArr={yearsArr}
          isNew={true}
        />
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Expense</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={expense}
                  headerIteration={iterations}
                  title={"EXPENSE"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          reportType={currentReport.reportType}
          tablePrefix={"$"}
          tableHead={"EXPENSE"}
          pageHight={pageHight}
          tableData={expense}
          tableSuffix={""}
          iterations={iterations}
          indexArr={yearsArr}
          isOnlyExpense={true}
        />
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Cash Flow</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={cashFlow}
                  headerIteration={iterations}
                  title={"CASH FLOW"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          reportType={currentReport.reportType}
          pageHight={pageHight}
          tablePrefix={{
            "Operating Income": "+" + "\xa0\xa0\xa0" + "$",
            "Operating Expenses": "-" + "\xa0\xa0\xa0" + "$",
            "Net Operating Income": "=" + "\xa0\xa0\xa0" + "$",
            "Loan Payments": "-" + "\xa0\xa0\xa0" + "$",
            "Cash Flow": "=" + "\xa0\xa0\xa0" + "$",
            // "Post Tax Cash Flow": "" + "\xa0\xa0\xa0" + "$",  // see line number 310
          }}
          tableHead={"CASH FLOW"}
          tableData={cashFlow}
          tableSuffix={""}
          iterations={iterations}
          indexArr={yearsArr}
          isNew={true}
        />
      </div>


      <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden", margin: "0px", padding: "0px" } : { margin: "0px", padding: "0px" }} >
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Tax Benefits & Deductions</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={taxDeductions}
                  headerIteration={iterations}
                  title={"TAX BENEFITS & DEDUCTIONS"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          reportType={currentReport.reportType}
          pageHight={pageHight}
          tablePrefix={{
            "Operating Expenses": "+" + "\xa0\xa0\xa0" + "$",
            "Loan Interest": "+" + "\xa0\xa0\xa0" + "$",
            "Depreciation": "+" + "\xa0\xa0\xa0" + "$",
            "Total Deductions": "=" + "\xa0\xa0\xa0" + "$",
          }}
          tableHead={"TAX BENEFITS & DEDUCTIONS"}
          tableData={taxDeductions}
          tableSuffix={""}
          iterations={iterations}
          indexArr={yearsArr}
          isNew={true}
        />
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Equity Accumulation</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={equity}
                  headerIteration={iterations}
                  title={"EQUITY ACCUMULATION"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          reportType={currentReport.reportType}
          pageHight={pageHight}
          tablePrefix={{
            "Property Value": "+" + "\xa0\xa0\xa0" + "$",
            "Loan Balance": "-" + "\xa0\xa0\xa0" + "$",
            "Total Equity": "=" + "\xa0\xa0\xa0" + "$",
          }}
          tableHead={"EQUITY ACCUMULATION"}
          tableData={equity}
          tableSuffix={""}
          iterations={iterations}
          indexArr={yearsArr}
          isNew={true}
        />
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Sale Analysis</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={saleAnalysis}
                  headerIteration={iterations}
                  title={"SALE ANALYSIS"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          pageHight={pageHight}
          reportType={currentReport.reportType}
          tablePrefix={{
            "Equity": "+" + "\xa0\xa0\xa0" + "$",
            "Selling Costs": "-" + "\xa0\xa0\xa0" + "$",
            "Sale Proceeds": "=" + "\xa0\xa0\xa0" + "$",
            "Cumulative Cash Flow": "+" + "\xa0\xa0\xa0" + "$",
            "Total Cash Invested": "-" + "\xa0\xa0\xa0" + "$",
            "Total Profit": "=" + "\xa0\xa0\xa0" + "$",
          }}
          tableHead={"SALE ANALYSIS"}
          tableData={saleAnalysis}
          tableSuffix={""}
          iterations={iterations}
          indexArr={yearsArr}
          isNew={true}
        />
      </div>


      <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden", margin: "0px", padding: "0px" } : { margin: "0px", padding: "0px" }} >
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Investment Returns</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={invReturns}
                  headerIteration={iterations}
                  title={"INVESTMENT RETURNS"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          pageHight={pageHight}
          reportType={currentReport.reportType}
          tablePrefix={""}
          tableHead={"INVESTMENT RETURNS"}
          tableData={invReturns}
          tableSuffix={"%"}
          iterations={iterations}
          indexArr={yearsArr}
        />
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Financial Ratios</h3>
            </div>
            <div>
              {!isViewOnly && (
                <DownloadExcel
                  yearsArr={yearsArr}
                  dataArr={financialRatio}
                  headerIteration={iterations}
                  title={"FINANCIAL RATIOS"}
                  currentReport={currentReport}
                  projectData={projectData}
                />)}
            </div>
          </div>
        </div>
        <ProjectionTable
          reportType={currentReport.reportType}
          tablePrefix={""}
          pageHight={pageHight}
          tableHead={"FINANCIAL RATIOS"}
          tableData={financialRatio}
          tableSuffix={{
            "Rent To Value": "%",
            "Gross Rent Multiplier": "",
            "Equity Multiple": "",
            "Break Even Ratio": "%",
            "Debt Yield": "%",
            "Debt Coverage Ratio": "",
          }}
          iterations={iterations}
          indexArr={yearsArr}
          isNewTableSuffix={true}
        />
      </div>


      <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden", margin: "0px", padding: "0px" } : { margin: "0px", padding: "0px" }} >
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Cash Flow Over Time</h3>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div className={classes.graphContainer} elevation={2}>
          <LineGraph
            pageHight={pageHight}
            LineGraphData={cashFlowGraphData}
            keys={cashFlowDataKeys}
            yAxisLabel={""} xAxisLabel={"Period in year(s)"}
            yUnit={"$"} xUnit="Year"
          />
        </div>
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Equity Over Time</h3>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div className={classes.graphContainer} elevation={2}>
          <LineGraph
            pageHight={pageHight}
            LineGraphData={equityGraphData}
            keys={equityDataKeys}
            yAxisLabel={""} xAxisLabel={"Period in year(s)"}
            yUnit={"$"} xUnit="Year"
          />
        </div>
      </div>
    </div>
  );
}