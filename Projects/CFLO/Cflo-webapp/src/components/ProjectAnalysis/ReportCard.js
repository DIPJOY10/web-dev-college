import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import RentalReport from "./Reports/RentalReport";
import BRRRRReport from "./Reports/BRRRRReport";
import FlipReport from "./Reports/FlipReport";
import RentalCalculations from "./FinanceCalculator/RentalCalculations";
import BRRRRCalculations from "./FinanceCalculator/BRRRRCalculations";
import FlipCalculations from "./FinanceCalculator/FlipCalculations";
import CircularProgress from "@material-ui/core/CircularProgress";
import configObject from "../../config/index"
import { getReport, updateAnalysisReport, updatePurchaseCriteria } from "./api.call";
import CriteriaEdit from "./CriteriaEdit";
import OfferCalculator from "./Reports/OfferCalculator";
import FunctionsIcon from '@material-ui/icons/Functions';
import EditIcon from "@material-ui/icons/Edit";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ShareIcon from '@material-ui/icons/Share';
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import AnalysisHeader from "../styled/CommonComponents/AnalysisHead";
import projectionIcon from "../../Assets/ProjectionIcon.svg"
import CustomBtn from "../styled/CommonComponents/CustomBtn";
import HomeIcon from '@material-ui/icons/Home';
import MyPopOver from "../styled/CommonComponents/MyPopOver";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportShareDialog from "./ReportShareDialog";
import ReportPdf from "./ReportPdf";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  progress: {
    position: "absolute",
    left: "50%",
    top: "50%",
  },
  headerBar: {
    backgroundColor: "white",
    height: '60px',
    display: 'flex',
    padding: '0px 20px',
    paddingLeft: "5px",
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0px',
      paddingLeft: "5px",
    },
    [theme.breakpoints.down('xs')]: {
      height: '50px',
      padding: '0px',
      paddingLeft: "0px",
    },
  },
  innerLeft: {
    display: "flex",
    alignItems: "center",
  },
  innerRight: {
    display: "flex",
    alignItems: "center",
  },
  mainCont: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "white",
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
  backIcon: {
    fontSize: "30px",
    opacity: "0.8",
    cursor: "pointer",
    marginRight: "6px"
  },
  propertyNamesty: {
    fontSize: "23px",
    fontWeight: "510",
    textTransform: "capitalize",
    [theme.breakpoints.down('sm')]: {
      fontSize: "18px",
    }
  },
  propertyTypeSty: {
    marginTop: "8px",
    fontSize: "14px",
    fontWeight: "550",
    opacity: "0.7",
    [theme.breakpoints.down('sm')]: {
      fontSize: "9px",
    }
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
  criteriaTitle: {
    fontWeight: "510",
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: "16px",
    }
  },
  iconBtn: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: "4px",
    fontSize: "36px",
    marginRight: "20px",
    padding: "3px",
    color: theme.palette.primary.main,
    cursor: "pointer",
    [theme.breakpoints.down('sm')]: {
      fontSize: "29px",
      marginRight: "15px",
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: "29px",
      marginRight: "7px",
    },
  },
}));

export default function ReportCard(props) {
  const {
    reportId, currentReport, setCurrentReport, ItemType, projectData, setProjectData,
    setView, resultData, setResultData, setOpExpenseData,
    setLoadingBool, setItemType, setItemendAdorn, setPeriod, setAdditionalItems,
    setIsAdditionalItems, setAdditionalItemsCostOR, setLoadingText
  } = props
  const classes = useStyles();
  const theme = useTheme()
  const { teamId } = useParams();
  const history = useHistory();
  const [piePurchaseData, setPurchaseData] = useState([]);
  const [pieRehabData, setRehabData] = useState([]);
  const [taxAndInsuranceItems, setTaxAndInsuranceItems] = useState([]);
  const [additionalItemsCostORLocal, setAdditionalItemsCostORLocal] = useState([]);
  const [pieIncomeData, setIncomeData] = useState([]);
  const [pieExpenseData, setExpenseData] = useState([]);
  const [pieRefinanceData, setRefinanceData] = useState([]);
  const [pieHoldExpenseData, setHoldExpenseData] = useState([]);
  const [pieHoldingData, setHoldingData] = useState([]);
  const [incomePieChart, setIncomePieChart] = useState([]);
  const [openDialog, setOpenDialog] = useState(false)
  const [pieSellingData, setSellingData] = useState([]);
  const [pathState, setPathState] = useState([])
  const [pageTitles, setPageTitles] = useState("")
  const [reportView, setReportView] = useState("reportView")
  const [pageDesc, setPageDesc] = useState("")
  const [rehabOperatingCostsItemized, setRehabOperatingCostsItemized] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [tLink, setTLink] = useState("")
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const componentRef = useRef();

  useEffect(() => {
    if (currentReport?.reportType === "Rental") {
      setTLink(configObject?.tutorialLinks?.rentalLink)
    } else if (currentReport?.reportType === "BRRRR") {
      setTLink(configObject?.tutorialLinks?.brrrrLink)
    } else if (currentReport?.reportType === "Flip") {
      setTLink(configObject?.tutorialLinks?.flipLink)
    }
  }, [currentReport])

  useEffect(() => {
    findReport();
  }, [reportId]);


  async function findReport() {
    await getReport(reportId)
      .then((data) => {
        setCurrentReport(data);

        let purchase_data = [],
          rehab_data = [],
          costOverrun_data = [],
          taxIncreaseArr_data = [],
          opExpense_data = [],
          otherIncome_data = [],
          ref_data = [],
          hold_data = [],
          hold_itemized_data = [],
          rehab_OperatingCosts_Itemized = [],
          selling_data = [];

        let tax = 0,
          insurance = 0;

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

        let Data = {};
        let calculationType = currentReport?.reportType;
        console.log(opExpense_data);
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
      })
      .catch((error) => {
        console.log(error);
      });
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
    setAdditionalItems(taxAndInsuranceItems)
  }, [taxAndInsuranceItems])


  useEffect(() => {
    setAdditionalItemsCostOR(additionalItemsCostORLocal)
  }, [additionalItemsCostORLocal])


  let RightHeaderView = null;

  switch (reportView) {
    case "reportView":
      RightHeaderView = <>
        <CustomBtn
          startPart={isSmall ? null : <EditIcon style={{ fontSize: "19px" }} />}
          text={isSmall ? <EditIcon style={{ fontSize: "19px" }} /> : "Worksheet"}
          onClick={() => { setView("worksheet"); }}
          style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
        />
        <CustomBtn
          startPart={isSmall ? null : <EqualizerIcon style={{ fontSize: "19px" }} />}
          text={isSmall ? <EqualizerIcon style={{ fontSize: "19px" }} /> : "Projections"}
          onClick={() => {
            setOpExpenseData(pieExpenseData);
            setView("projection");
          }}
          style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
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
            <div onClick={() => { setOpenDialog(true) }} >
              <PictureAsPdfIcon className={classes.actionIcon} /> Download PDF
            </div>
            <div onClick={() => { setView("default"); }} >
              <HomeIcon className={classes.actionIcon} /> Home
            </div>
          </div>}
        />
        <ReportPdf
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          incomePieChart={incomePieChart}
          currentReport={currentReport}
          projectData={projectData}
          resultData={resultData}
          piePurchaseData={piePurchaseData}
          pieRehabData={pieRehabData}
          pieExpenseData={pieExpenseData}
          pieIncomeData={pieIncomeData}
          rehabOperatingCostsItemized={rehabOperatingCostsItemized}
          setProjectData={setProjectData}
          pieHoldingData={pieHoldingData}
          pieRefinanceData={pieRefinanceData}
          pieSellingData={pieSellingData}
        />
        <ReportShareDialog
          report={currentReport}
          projectData={projectData}
          setOpenShareDialog={setOpenShareDialog}
          openShareDialog={openShareDialog}
        />
      </>
      break;
    case "criteriaEdit":
      RightHeaderView = <></>
      break;
    case "offerCalculator":
      RightHeaderView = <></>
      break;
  }


  let ReportTypeComponent = null;

  switch (currentReport?.reportType) {
    case "Rental":
      ReportTypeComponent = <RentalReport
        reportId={reportId}
        isViewOnly={false}
        currentReport={currentReport}
        setItemType={setItemType}
        ItemType={ItemType}
        projectData={projectData}
        setView={setView}
        setItemendAdorn={setItemendAdorn}
        resultData={resultData}
        setPeriod={setPeriod}
        setResultData={setResultData}
        setIsAdditionalItems={setIsAdditionalItems}
        piePurchaseData={piePurchaseData}
        pieRehabData={pieRehabData}
        pieIncomeData={pieIncomeData}
        pieExpenseData={pieExpenseData}
        rehabOperatingCostsItemized={rehabOperatingCostsItemized}
        setReportView={setReportView}
      />
      break;
    case "BRRRR":
      ReportTypeComponent = <BRRRRReport
        reportId={reportId}
        currentReport={currentReport}
        ItemType={ItemType}
        projectData={projectData}
        setItemType={setItemType}
        setView={setView}
        isViewOnly={false}
        resultData={resultData}
        setResultData={setResultData}
        piePurchaseData={piePurchaseData}
        pieRehabData={pieRehabData}
        setItemendAdorn={setItemendAdorn}
        setIsAdditionalItems={setIsAdditionalItems}
        setPeriod={setPeriod}
        pieIncomeData={pieIncomeData}
        pieExpenseData={pieExpenseData}
        pieHoldingData={pieHoldingData}
        pieRefinanceData={pieRefinanceData}
        rehabOperatingCostsItemized={rehabOperatingCostsItemized}
        setReportView={setReportView}
      />
      break;
    case "Flip":
      ReportTypeComponent = <FlipReport
        reportId={reportId}
        currentReport={currentReport}
        ItemType={ItemType}
        isViewOnly={false}
        projectData={projectData}
        setItemType={setItemType}
        setView={setView}
        resultData={resultData}
        setResultData={setResultData}
        piePurchaseData={piePurchaseData}
        pieRehabData={pieRehabData}
        pieIncomeData={pieIncomeData}
        setItemendAdorn={setItemendAdorn}
        pieExpenseData={pieExpenseData}
        setIsAdditionalItems={setIsAdditionalItems}
        setPeriod={setPeriod}
        pieHoldExpenseData={pieHoldExpenseData}
        pieHoldingData={pieHoldingData}
        pieRefinanceData={pieRefinanceData}
        pieSellingData={pieSellingData}
        rehabOperatingCostsItemized={rehabOperatingCostsItemized}
        setReportView={setReportView}
      />
      break;
  }

  let ReportViewComponent = null

  switch (reportView) {
    case "reportView":
      ReportViewComponent = <div ref={componentRef}>
        {ReportTypeComponent}
      </div>
      break;

    case "criteriaEdit":
      ReportViewComponent = <CriteriaEdit
        projectData={projectData}
        setProjectData={setProjectData}
        currentReport={currentReport}
        isForManagement={false}
      />
      break;

    case "offerCalculator":
      ReportViewComponent = <OfferCalculator
        currentReport={currentReport}
        setCurrentReport={setCurrentReport}
        projectData={projectData}
        setProjectData={setProjectData}
        reportId={reportId}
        setLoadingText={setLoadingText}
        setIsLoading={setLoadingBool}
      />
      break;
  }

  useEffect(() => {
    let updatedPath = [{
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
    }]

    if (reportView === "reportView") {
      setPageTitles("Report Analysis")
      updatedPath.push({
        text: isSmall ? "Report" : "Report Analysis",
      })
    } else if (reportView === "criteriaEdit") {
      setPageTitles("Purchase Criteria")
      updatedPath.push({
        text: isSmall ? "Report" : "Report Analysis",
        onClick: () => {
          setReportView("reportView")
        }
      })
      updatedPath.push({
        text: "Criteria",
      })
    } else if (reportView === "offerCalculator") {
      setPageTitles("Offer Calculator")
      updatedPath.push({
        text: isSmall ? "Report" : "Report Analysis",
        onClick: () => {
          setReportView("reportView")
        }
      })
      updatedPath.push({
        text: isSmall ? "Calculator" : "Offer Calculator",
      })
    }
    setPathState(updatedPath)
  }, [reportView])



  useEffect(() => {
    if (reportView === "reportView") {
      if (currentReport?.reportType === "Rental") {
        setPageDesc("This page shows the purchase breakdown, cash flow, financial ratios and investment returns for this property for year 1.")
      } else if (currentReport?.reportType === "BRRRR") {
        setPageDesc("This page shows the purchase breakdown, holding costs, cash flow, financial ratios and investment returns for this property for the first year after refinance.")
      } else if (currentReport?.reportType === "Flip") {
        setPageDesc("This page shows the purchase breakdown, holding costs and profit analysis for this property.")
      }
    } else if (reportView === "criteriaEdit") {
      setPageDesc("Use this page to select & edit the purchase criteria associated with different metrics.")

    } else if (reportView === "offerCalculator") {
      setPageDesc("This page shows the calculated offer price which fulfills the selected purchase criteria.")
    }
  }, [currentReport, reportView])



  return (
    <div>
      {resultData ? (
        <div className={classes.root}>
          <div className={classes.mainCont} >
            <AnalysisHeader
              pageTitle={pageTitles}
              pathArr={pathState}
              imgSrc={projectData?.displayPicture?.url}
              propName={projectData?.displayName}
              isImgProps={true}
              propDetails={<>{projectData?.subCategory || "Nan"} \ {projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} BA \ {projectData?.roomNumbers || "Nan"} BR \ {`${projectData?.area || "Nan"} sqft`}</>}
              pageDesc={<>{pageDesc}{` `}<a style={{ textDecoration: 'none', color: "#2196F3" }} href={tLink} target="_blank" >View tutorial</a></>}
              rightBtns={RightHeaderView}
            />
            {ReportViewComponent}
          </div>
        </div>
      ) : (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
