import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import ProjectionTable from "../ProjectionTable";
import { useMediaQuery } from '@material-ui/core';
import configObject from "../../../config/index"
import AnalysisHeader from "../../styled/CommonComponents/AnalysisHead";
import LineGraph from "../LineChart";
import CustomBtn from "../../styled/CommonComponents/CustomBtn";
import EditIcon from "@material-ui/icons/Edit";
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import HomeIcon from '@material-ui/icons/Home';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import GetAppIcon from '@material-ui/icons/GetApp';
import ReportShareDialog from "../ReportShareDialog";


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
  calc_head_container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "15px 0px 50px",
    flexWrap: "wrap",
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
  graphContainer: {
    marginBottom: "30px",
    padding: "15px 0px",
    borderRadius: "18px"
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

export default function FlipProjection({
  currentReport,
  resultData,
  setView,
  yearsArr,
  setYearsArr,
  isViewOnly,
  projectData,
  pageHight
}) {
  const classes = useStyles();
  const theme = useTheme()
  const history = useHistory();
  const { teamId } = useParams();
  const [projHoldingData, setProjHoldingData] = useState({});
  const [sellingCostData, setSellingCostData] = useState({});
  const [returnsData, setReturnsData] = useState({});
  const [openShareDialog, setOpenShareDialog] = useState(false)
  const [holdingText, setHoldingText] = useState("Holding Costs")
  const [pofitGraphArr, setPofitGraphArr] = useState([])
  const [roiGraphArr, setROIGraphArr] = useState([])

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));



  useEffect(() => {
    if (currentReport?.rentalPeriod) {
      setHoldingText("Net Costs")
    } else {
      setHoldingText("Holding Costs")
    }

    let myRehabPeriod = Number(currentReport?.rehabPeriod);
    let rehabVariation = 1
    if ((myRehabPeriod - 3) > 1) {
      rehabVariation = myRehabPeriod - 3;
    }

    let count = 0;
    let arr = [];

    while (count < 7) {
      arr.push(rehabVariation);
      rehabVariation++;
      count++;
    }
    setYearsArr(arr)
  }, [currentReport])

  console.log(resultData)

  useEffect(() => {
    let holding_data = {};
    holding_data["Loan Payments"] = resultData?.loanPaymentArrayCumulativeTotal;
    holding_data["Operating Expenditure"] = resultData?.operatingExpenditureArrayCumulativeTotal;
    if (currentReport?.rentalPeriod) {
      holding_data["Income"] = resultData?.IncomeArrayCumulativeTotal;
    }
    holding_data[holdingText] = resultData?.netCostsArrayCumulativeTotal;
    setProjHoldingData(holding_data);


    let sale_data = {};
    sale_data["Selling Price"] = resultData?.sellingPriceArrayCur;
    sale_data["Selling Costs"] = resultData?.sellingCostsArrayCur;
    sale_data["Sale Proceeds"] = resultData?.saleProceedsArrayCur;
    sale_data["Loan Repayments"] = resultData?.loanBalanceArrayCur;
    sale_data["Total Net Costs"] = resultData?.netCostsArrayCumulativeTotal;
    sale_data["Total Cash Invested"] = resultData?.investedCashArrayCur;
    sale_data["Total Profit"] = resultData?.totalProfitArrayCur;
    setSellingCostData(sale_data);


    let returns_data = {};
    returns_data["Return on Investment"] = resultData?.ROIArrayCur;
    returns_data["Annualized ROI"] = resultData?.annualizedROIArrayCur;
    setReturnsData(returns_data);


    let pofitGraphData = [];
    yearsArr.map((year, i) => {
      let lab = year;
      if (Number(currentReport?.rentalPeriod)) {
        lab = year + Number(currentReport?.rentalPeriod);
      }
      pofitGraphData.push({
        name: lab,
        "Total Profit": resultData?.totalProfitArrayCur[i],
      })
    })
    setPofitGraphArr(pofitGraphData);


    let roiGraphData = [];
    yearsArr.map((year, i) => {
      let lab = year;
      if (Number(currentReport?.rentalPeriod)) {
        lab = year + Number(currentReport?.rentalPeriod);
      }
      roiGraphData.push({
        name: lab,
        "ROI": resultData?.ROIArrayCur[i],
      })
    })
    setROIGraphArr(roiGraphData)
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
            pageDesc={<>This page shows monthly net cost and final profit. <a style={{ textDecoration: 'none', color: "#2196F3" }} href={configObject?.tutorialLinks?.brrrrLink} target="_blank" >View tutorial</a> </>}
            rightBtns={<>
              <CustomBtn
                startPart={isSmall ? null : <EditIcon style={{ fontSize: "19px" }} />}
                text={isSmall ? <EditIcon style={{ fontSize: "19px" }} /> : "Edit Worksheet"}
                onClick={() => { setView("worksheet"); }}
                style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
              />
              <CustomBtn
                startPart={isSmall ? null : <PieChartRoundedIcon style={{ fontSize: "19px" }} />}
                text={isSmall ? <PieChartRoundedIcon style={{ fontSize: "19px" }} /> : "Report"}
                onClick={() => { setView("analysisReport"); }}
                style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
              />
              <CustomBtn
                text={<ShareIcon style={{ fontSize: "19px" }} />}
                onClick={() => { setOpenShareDialog(true) }}
                style={isSmall ? { padding: "7px 7px 2px" } : { padding: "10px 8px 5px" }}
              />
              <ReportShareDialog
                report={currentReport}
                projectData={projectData}
                setOpenShareDialog={setOpenShareDialog}
                openShareDialog={openShareDialog}
              />
            </>}
          />)}
        <div className={classes.calc_head_container} >
          <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
            <h4>Rehab Costs</h4>
            <p>{`$ ${parseFloat(resultData.rehabCombined).toFixed(2)}`}</p>
          </div>
          <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
            <h4>Holding Period</h4>
            <p>{`${resultData.holdingPeriod} Months`}</p>
          </div>
          <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
            <h4>Loan Payments</h4>
            <p>{`$ ${parseFloat(resultData.loanPayment).toFixed(2)} /mo`}</p>
          </div>
          {currentReport?.rentalPeriod ? (
            <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
              <h4>Total Net Cost</h4>
              <p>{`$ ${parseFloat(resultData?.netCostsArrayCumulativeTotal[yearsArr.indexOf(Number(currentReport?.rehabPeriod))]).toFixed(2)
                }`}</p>
            </div>
          ) : (
            <div className={classes.calculate_header} style={pageHight ? { boxShadow: "none" } : {}} >
              <h4>Holding Cost</h4>
              <p>{`$ ${parseFloat(resultData?.holdingCosts / (currentReport?.rehabPeriod)).toFixed(2)}`} /mo</p>
            </div>
          )}
        </div>
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>{currentReport?.rentalPeriod ? "Net Costs" : "Holding Costs"} </h3>
            </div>
            <div>
            </div>
          </div>
        </div>
        <ProjectionTable
          pageHight={pageHight}
          reportType={currentReport.reportType}
          tablePrefix={{
            "Loan Payments": "+" + "\xa0\xa0\xa0" + "$",
            "Operating Expenditure": "+" + "\xa0\xa0\xa0" + "$",
            "Income": "-" + "\xa0\xa0\xa0" + "$",
            [holdingText]: "=" + "\xa0\xa0\xa0" + "$",
          }}
          tableHead={"Holding Period"}
          tableData={projHoldingData}
          tableSuffix={""}
          iterations={7}
          isNew={true}
          currentReport={currentReport}
          indexArr={yearsArr}
        />
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Sale & Profit</h3>
            </div>
            <div>
            </div>
          </div>
        </div>
        <ProjectionTable
          reportType={currentReport.reportType}
          pageHight={pageHight}
          tablePrefix={{
            "Selling Price": "+" + "\xa0\xa0\xa0" + "$",
            "Selling Costs": "-" + "\xa0\xa0\xa0" + "$",
            "Sale Proceeds": "=" + "\xa0\xa0\xa0" + "$",
            "Loan Repayments": "-" + "\xa0\xa0\xa0" + "$",
            "Total Net Costs": "-" + "\xa0\xa0\xa0" + "$",
            "Total Cash Invested": "-" + "\xa0\xa0\xa0" + "$",
            "Total Profit": "=" + "\xa0\xa0\xa0" + "$",
            "Post Tax Profit": "" + "\xa0\xa0\xa0" + "$",
          }}
          tableHead={"Holding Period"}
          tableData={sellingCostData}
          tableSuffix={""}
          iterations={7}
          isNew={true}
          currentReport={currentReport}
          indexArr={yearsArr}
        />
      </div>


      <div style={pageHight ? { height: pageHight, width: "100%", overflow: "hidden", margin: "0px", padding: "0px" } : { margin: "0px", padding: "0px" }} >
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Investment Returns</h3>
            </div>
            <div>
            </div>
          </div>
        </div>
        <ProjectionTable
          reportType={currentReport.reportType}
          pageHight={pageHight}
          tablePrefix={""}
          tableHead={"Holding Period"}
          tableData={returnsData}
          tableSuffix={"%"}
          iterations={7}
          currentReport={currentReport}
          indexArr={yearsArr}
        />
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>Profit vs Holding Period</h3>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div className={classes.graphContainer} >
          <LineGraph
            pageHight={pageHight}
            LineGraphData={pofitGraphArr}
            keys={["Total Profit"]}
            referenceLine={Number(currentReport?.rentalPeriod) + Number(currentReport?.rehabPeriod)}
            yUnit={"$"}
            xUnit="Month"
            yAxisLabel={"Total Profit"} xAxisLabel={"Holding period in month(s)"}
          />
        </div>
        <div className={classes.nameDescHeadCont} >
          <div className={classes.nameBtnCont} >
            <div>
              <h3>ROI vs Holding Period</h3>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div className={classes.graphContainer} >
          <LineGraph
            pageHight={pageHight}
            LineGraphData={roiGraphArr}
            keys={["ROI"]}
            referenceLine={Number(currentReport?.rentalPeriod) + Number(currentReport?.rehabPeriod)}
            yUnit={"%"}
            xUnit="Month"
            yAxisLabel={"ROI"} xAxisLabel={"Holding period in month(s)"}
          />
        </div>
      </div>
    </div>
  );
}


