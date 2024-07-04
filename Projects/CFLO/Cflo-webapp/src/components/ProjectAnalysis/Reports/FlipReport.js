import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useTheme } from "@material-ui/core/styles";
import DropDown from "../customDropDown";
import PieGraph from "../PieGraph";
import InfoLabel from "../InputComponents/InfoLabel";
import Criteria from "./Criteria";
import { useMediaQuery } from '@material-ui/core';
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FunctionsIcon from '@material-ui/icons/Functions';
import DoughnutChart from "../DoughnutChart";
import calculator from "../../../Assets/calculator.svg"
import CustomBtn from "../../styled/CommonComponents/CustomBtn";
import PieChartIcon from '@material-ui/icons/PieChart';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import criteriaSwitch from "../../../Assets/criteriaSwitch.svg";
import glossaryObjObj from "../Glossary.Obj";


const useStyles = makeStyles((theme) => ({
  root: {
  },
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
  calc_head_container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "15px 0px 50px",
    flexWrap: "wrap",
  },
  subCalcHeadCont: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
  },
  calculatedCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
    "& h2": {
      fontSize: "15px",
      fontWeight: "510",
    },
    [theme.breakpoints.down('md')]: {
      "& h2": {
        fontSize: "13px"
      },
      padding: "5px",
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
      padding: "10px",
      "& h2": {
        textAlign: "center",
        marginBottom: "15px"
      },
    }
  },
  chart: {
    zIndex: "100",
    width: "100%",
  },
  chart_header: {
    display: "flex",
    justifyContent: "space-around",
    color: "#1684ea",
    padding: "8px 0px 24px 0px",
    "& Button": {
      fontSize: "12px",
      marginRight: "5px",
    },
  },
  chart_container: {
    width: "43%",
    [theme.breakpoints.down('sm')]: {
      width: "100%"
    }
  },
  purchase_container: {
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    borderRadius: "15px",
    padding: "1rem",
    "& h2": {
      color: "#1684ea",
      fontWeight: "normal",
    },
    [theme.breakpoints.down('md')]: {
      "& h2": {
        fontSize: "17px"
      },
    },
    [theme.breakpoints.down('sm')]: {
      padding: "1rem 5px",
    }
  },
  cashFlow_container: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    marginTop: "1rem",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    borderRadius: "15px",
    "& h2": {
      color: "#1684ea",
      fontWeight: "normal",
    },
    [theme.breakpoints.down('md')]: {
      "& h2": {
        fontSize: "17px"
      },
    },
    [theme.breakpoints.down('sm')]: {
      padding: "1rem 5px",
    }
  },
  cashFlow_Chart: {
    width: "43%",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    }
  },
  p_row_Dropdown: {
    display: "flex",
    flexDirection: "column",
    color: "grey",
    padding: "0 1rem",
  },
  label_text: {
    width: "65%",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
      width: "68%",
    },
    [theme.breakpoints.down('sm')]: {
      width: "64%",
      fontSize: "11px",
    }
  },
  valueCont: {
    width: "20%",
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down('md')]: {
      width: "28%",
      fontSize: "12px",
    },
    [theme.breakpoints.down('sm')]: {
      width: "32%",
    }
  },
  signStyle: {
    fontSize: "17px",
    fontWeight: "510"
  },
  headName: {
    margin: "60px 0px 15px 0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
      fontSize: "13px",
      color: "#626060",
      margin: "10px 0px"
    },
    [theme.breakpoints.down('sm')]: {
      "& h3": {
        fontSize: "18px",
        fontWeight: "510",
      },
      "& p": {
        fontSize: "12px",
        color: "#626060",
        margin: "10px 0px"
      },
    }
  },
  financeContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    borderRadius: "15px",
    padding: "30px 10px 10px 10px",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
    }
  },
  labelText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  valueSty: {
    margin: "5px 0px 20px 0px",
    fontWeight: "510",
    [theme.breakpoints.down('sm')]: {
      fontSize: "11px"
    }
  },
  financeSubCont: {
    width: "30%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    "& h3": {
      color: "#626060",
      fontWeight: "450"
    },
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      "& h3": {
        fontSize: "12px"
      },
    },
  },
  financeLabelData: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    [theme.breakpoints.down('sm')]: {
      minWidth: "47%",
    }
  },
  valuationCont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    padding: "30px 0px 10px 0px",
    borderRadius: "15px",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
    }
  },
  valuation2SubCont: {
    width: "49%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    }
  },
  valuationLabelDataCont: {
    width: "48%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    "& h3": {
      color: "#626060",
      fontWeight: "450"
    },
    "& p": {
      margin: "-3px 0px 20px 0px",
      fontWeight: "510",
    },
    [theme.breakpoints.down('sm')]: {
      width: "50%",
      "& h3": {
        fontSize: "12px",
      },
      "& p": {
        fontSize: "11px",
      },
    }
  },
  dataLabelValueRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "black",
    padding: "7px",
    "& h3": {
      fontWeight: "500",
      color: "#626060"
    },
    "& p": {
      color: "black",
      fontWeight: "550",
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: "0px",
      width: "calc(100% - 20px)",
    },
  },
  infoDataCont: {
    display: "flex",
    justifyContent: "space-evenly",
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column"
    }
  },
  infoData: {
    width: "51%",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    }
  },
  criteriaCont: {
    padding: "1rem",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    borderRadius: "15px",
  },
  investmentReturnCont: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "30px 10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    borderRadius: "15px",
  },
  investmentReturnSubCont: {
    width: "48%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& h3": {
      color: "#626060",
      fontWeight: "450"
    },
    "& p": {
      fontWeight: "510",
    },
    [theme.breakpoints.down('sm')]: {
      "& h3": {
        fontSize: "12px",
      },
      "& p": {
        fontSize: "11px",
      },
    }
  },
  DropDownIcon: {
    marginLeft: '5px',
    cursor: "pointer",
    fontWeight: "510"
  }
}));

function FlipReport({
  currentReport,
  projectData,
  setView,
  resultData,
  piePurchaseData,
  pieRehabData,
  pieHoldingData,
  setItemendAdorn,
  pieSellingData,
  rehabOperatingCostsItemized,
  setReportView,
  setItemType,
  setPeriod,
  isViewOnly,
  setIsAdditionalItems,
}) {
  const classes = useStyles();
  const { teamId } = useParams();
  const theme = useTheme()
  const [btnA, setBtnA] = useState(true);
  const [b1Color, setB1Color] = useState("contained");
  const [b2Color, setB2Color] = useState("outlined");
  const [rehabCostsBreakdown, setRehabCostsBreakdown] = useState(false)
  const [purchaseBreakdown, setPurchaseBreakdown] = useState(false)
  const [purchasePercentBreakdown, setPurchasePercentBreakdown] = useState(false)
  const [rehabOperatingBreakdown, setRehabOperatingBreakdown] = useState(false)
  const [sellingCostsBreakdown, setSellingCostsBreakdown] = useState(false)
  const [purchaseRehabGP, setPurchaseRehabGP] = useState("doughnutChart")
  const [holdingGP, setHoldingGP] = useState("doughnutChart")
  const [sellingGP, setSellingGP] = useState("doughnutChart")

  const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const redColor = {
    color: theme.palette.primary.fail
  }
  const themeColor = {
    color: theme.palette.primary.main
  }
  const successColor = {
    color: theme.palette.primary.success
  }

  useEffect(() => {
    console.log(currentReport);
  }, []);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }



  return (
    <div className={classes.root}>
      <div className={classes.calc_head_container}>
        <Paper elevation={2} className={classes.calculate_header}>
          <h4>Cash Needed</h4>
          <p
            style={projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashNeededLimit >= parseFloat(resultData.totalCashNeeded) ? successColor : redColor}
          >{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
        </Paper>
        <Paper elevation={2} className={classes.calculate_header}>
          <h4>Total Profit</h4>
          <p style={parseFloat(resultData.profitFlip) > 0 ? successColor : redColor} >{`$ ${numberWithCommas(parseFloat(resultData.profitFlip).toFixed(2))}`}</p>
        </Paper>
        <Paper elevation={2} className={classes.calculate_header}>
          <h4>ROI</h4>
          <p style={parseFloat(resultData.ROI) > 0 ? successColor : redColor} >{`${parseFloat(resultData.ROI).toFixed(2)} %`}</p>
        </Paper>
        <Paper elevation={2} className={classes.calculate_header}>
          <h4>Annualized ROI</h4>
          <p style={parseFloat(resultData.annualizedROI) > 0 ? successColor : redColor} >{`${parseFloat(resultData.annualizedROI).toFixed(2)} %`}</p>
        </Paper>
      </div>


      <div className={classes.headName} >
        <div style={isSmall ? { width: "70%" } : {}} >
          <h3>Purchase Criteria</h3>
          <p></p>
        </div>
        <div>
          {!isViewOnly && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setReportView("criteriaEdit") }}
              startIcon={<EditIcon />}
            >
              edit
            </Button>
          )}
        </div>
      </div>


      <Paper className={classes.criteriaCont}>
        <Criteria
          resultData={resultData}
          currentReport={currentReport}
          projectData={projectData}
        />
        {!isViewOnly && (
          <div className={classes.calculatedCont}>
            <h2>Use reverse valuation to calculate your max allowable offer price based on selected criteria</h2>
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={() => { setReportView("offerCalculator") }}
            >
              <img src={calculator} style={{ width: "20px", marginRight: "7px" }} /> calculate
            </Button>
          </div>
        )}
      </Paper>

      <div className={classes.headName} >
        <div>
          <h3>Purchase and Rehab</h3>
          <p></p>
        </div>
        <div></div>
      </div>

      <Paper className={classes.purchase_container}>
        <div className={classes.infoDataCont}>
          <div className={classes.infoData}>
            <div className={classes.dataLabelValueRow}>
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Purchase Price"]} />
                <h3>Purchase Price:</h3>
              </div>
              <p className={classes.signStyle} >+</p>
              <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport.purchasePrice).toFixed(2))}`}</p>
            </div>
            {currentReport?.RehabCostPercent ? (
              <div style={isViewOnly ? {} : isSmall ? { width: "100%", display: "flex" } : { width: "103%", display: "flex" }} >
                <div className={classes.dataLabelValueRow}  >
                  <div className={classes.label_text}>
                    <InfoLabel
                      obj={glossaryObjObj?.["Rehab Costs"]}
                    />
                    <h3 style={{ display: "flex", alignItems: "center" }} >
                      Rehab Costs
                      {rehabCostsBreakdown ? (
                        <KeyboardArrowUpIcon
                          onClick={() => { setRehabCostsBreakdown(false) }}
                          className={classes.DropDownIcon}
                        />
                      ) : (
                        <ExpandMoreIcon
                          onClick={() => { setRehabCostsBreakdown(true) }}
                          className={classes.DropDownIcon}
                        />
                      )}
                    </h3>
                  </div>
                  <p className={classes.signStyle} >+</p>
                  <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.rehabCombined).toFixed(2))}`}</p>
                </div>
                {!isViewOnly && (
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: theme.palette.primary.main,
                      cursor: "pointer",
                      marginTop: "7px"
                    }}
                    onClick={() => {
                      setItemendAdorn("")
                      setPeriod(0)
                      setIsAdditionalItems("costOverrun")
                      setItemType("Rehab Cost")
                      setView("itemized")
                    }}
                  />
                )}
              </div>
            ) : null}
            {currentReport?.RehabCostPercent ? (
              <div className={classes.p_row_Dropdown} style={{ width: "98%" }} >
                <DropDown
                  list={pieRehabData}
                  openCloseBool={rehabCostsBreakdown}
                  isMonthly={false}
                />
              </div>
            ) : null}
            {resultData?.amountFinanced > 0 ? (
              <div className={classes.dataLabelValueRow}>
                <div className={classes.label_text}>
                  <InfoLabel
                    obj={glossaryObjObj?.["Amount Financed"]}
                  />
                  <h3>Amount Financed:</h3>
                </div>
                <p className={classes.signStyle} >-</p>
                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.amountFinanced).toFixed(2))}`}</p>
              </div>
            ) : null}
            {resultData.downPaymentCash > 0 ? (
              <div className={classes.dataLabelValueRow} style={{ borderTop: "1px solid #D1CCCC" }} >
                <div className={classes.label_text}>
                  <InfoLabel
                    obj={glossaryObjObj?.["Down Payment"]}
                  />
                  <h3 style={{ color: theme.palette.primary.main }} >Down Payment:</h3>
                </div>
                <p className={classes.signStyle} >=</p>
                <p className={classes.valueCont} style={{ color: theme.palette.primary.main }} >{`$ ${numberWithCommas(parseFloat(resultData.downPaymentCash).toFixed(2))}`}</p>
              </div>
            ) : null}
            {currentReport.purchaseTotal ? (
              <div style={isViewOnly ? {} : isSmall ? { width: "100%", display: "flex" } : { width: "103%", display: "flex" }} >
                <div className={classes.dataLabelValueRow} >
                  <div className={classes.label_text}>
                    <InfoLabel
                      obj={glossaryObjObj?.["Purchase Costs"]}
                    />
                    <h3 style={{ display: "flex", alignItems: "center" }} >
                      Purchase Costs
                      {purchaseBreakdown ? (
                        <KeyboardArrowUpIcon
                          onClick={() => { setPurchaseBreakdown(false) }}
                          className={classes.DropDownIcon}
                        />
                      ) : (
                        <ExpandMoreIcon
                          onClick={() => { setPurchaseBreakdown(true) }}
                          className={classes.DropDownIcon}
                        />
                      )}
                    </h3>
                  </div>
                  <p className={classes.signStyle} >+</p>
                  <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport.purchaseTotal).toFixed(2))}`}</p>
                </div>
                {!isViewOnly && (
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: theme.palette.primary.main,
                      cursor: "pointer",
                      marginTop: "7px"
                    }}
                    onClick={() => {
                      setItemendAdorn("")
                      setPeriod(0)
                      setIsAdditionalItems(null)
                      setItemType("Purchase Cost")
                      setView("itemized")
                    }}
                  />
                )}
              </div>
            ) : null}
            {currentReport.purchaseTotal ? (
              <div className={classes.p_row_Dropdown} style={{ width: "98%" }}>
                <DropDown
                  list={piePurchaseData}
                  openCloseBool={purchaseBreakdown}
                  isMonthly={false}
                />
              </div>
            ) : null}
            {currentReport.rehabTotal && !currentReport?.RehabCostPercent ? (
              <div style={isViewOnly ? {} : isSmall ? { width: "100%", display: "flex" } : { width: "103%", display: "flex" }} >
                <div className={classes.dataLabelValueRow}  >
                  <div className={classes.label_text}>
                    <InfoLabel
                      obj={glossaryObjObj?.["Rehab Costs"]}
                    />
                    <h3 style={{ display: "flex", alignItems: "center" }} >
                      Rehab Costs
                      {purchasePercentBreakdown ? (
                        <KeyboardArrowUpIcon
                          onClick={() => { setPurchasePercentBreakdown(false) }}
                          className={classes.DropDownIcon}
                        />
                      ) : (
                        <ExpandMoreIcon
                          onClick={() => { setPurchasePercentBreakdown(true) }}
                          className={classes.DropDownIcon}
                        />
                      )}
                    </h3>
                  </div>
                  <p className={classes.signStyle} >+</p>
                  <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.rehabCombined).toFixed(2))}`}</p>
                </div>
                {!isViewOnly && (
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: theme.palette.primary.main,
                      cursor: "pointer",
                      marginTop: "7px"
                    }}
                    onClick={() => {
                      setItemendAdorn("")
                      setPeriod(0)
                      setIsAdditionalItems("costOverrun")
                      setItemType("Rehab Cost")
                      setView("itemized")
                    }}
                  />
                )}
              </div>
            ) : null}
            {currentReport.rehabTotal && !currentReport?.RehabCostPercent ? (
              <div className={classes.p_row_Dropdown} style={{ width: "98%" }}>
                <DropDown
                  list={pieRehabData}
                  openCloseBool={purchasePercentBreakdown}
                  isMonthly={false}
                />
              </div>
            ) : null}
            {resultData.mortgageUpfrontAmount > 0 ? (
              <div className={classes.dataLabelValueRow}>
                <div className={classes.label_text}>
                  <InfoLabel
                    obj={glossaryObjObj?.["Mortgage Upfront"]}
                  />
                  <h3>Mortgage Upfront:</h3>
                </div>
                <p className={classes.signStyle} >+</p>
                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.mortgageUpfrontAmount).toFixed(2))}`}</p>
              </div>
            ) : null}
            <div className={classes.dataLabelValueRow} style={{ borderTop: "1px solid #D1CCCC" }} >
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Total Cash Needed"]}
                />
                <h3 style={{ color: theme.palette.primary.main }} >Total Cash Needed:</h3>
              </div>
              <p className={classes.signStyle} >=</p>
              <p className={classes.valueCont} style={{ color: theme.palette.primary.main }} >{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
            </div>
          </div>
          <div className={classes.chart_container}>
            <div className={classes.chart_header}>
              <CustomBtn
                text={"Purchase Costs"}
                onClick={() => {
                  setBtnA(true);
                  setB1Color("contained");
                  setB2Color("outlined");
                }}
                style={b1Color === "contained" ? { backgroundColor: theme.palette.primary.main, color: "white" } : {}}
              />

              <div style={{ display: "flex", alignItems: "center" }} >
                <CustomBtn
                  text={"Rehab Costs"}
                  onClick={() => {
                    setBtnA(false);
                    setB2Color("contained");
                    setB1Color("outlined");
                  }}
                  style={b2Color === "contained" ? { backgroundColor: theme.palette.primary.main, color: "white", marginRight: "15px" } : { marginRight: "15px" }}
                />
                {purchaseRehabGP === "pieChart" && (
                  <CustomBtn
                    style={{ padding: "7px 2px 2px" }}
                    text={<DonutLargeIcon />}
                    endPart={<img src={criteriaSwitch} style={{ width: "8px", marginTop: "-5px", marginRight: "5px" }} />}
                    onClick={() => {
                      setPurchaseRehabGP("doughnutChart")
                    }}
                  />
                )}
                {purchaseRehabGP === "doughnutChart" && (
                  <CustomBtn
                    style={{ padding: "7px 2px 2px" }}
                    endPart={<img src={criteriaSwitch} style={{ width: "8px", marginTop: "-5px", marginRight: "5px" }} />}
                    text={<PieChartIcon />}
                    onClick={() => {
                      setPurchaseRehabGP("pieChart")
                    }}
                  />
                )}
              </div>
            </div>
            {btnA ? (
              <div className={classes.chart}>
                {purchaseRehabGP === "pieChart" && (
                  <PieGraph
                    Data={piePurchaseData}
                    chartRadius={85}
                    heightNum={"190px"}
                    isViewOnly={isViewOnly}
                    type={"purchase costs"}
                    fun={() => {
                      if (!isViewOnly) {
                        setItemendAdorn("")
                        setPeriod(0)
                        setIsAdditionalItems(null)
                        setItemType("Purchase Cost")
                        setView("itemized")
                      }
                    }}
                  />
                )}
                {purchaseRehabGP === "doughnutChart" && (
                  <DoughnutChart
                    Data={piePurchaseData}
                    chartInnerRadius={40}
                    chartOuterRadius={85}
                    heightNum={"190px"}
                    isViewOnly={isViewOnly}
                    type={"purchase costs"}
                    fun={() => {
                      if (!isViewOnly) {
                        setItemendAdorn("")
                        setPeriod(0)
                        setIsAdditionalItems(null)
                        setItemType("Purchase Cost")
                        setView("itemized")
                      }
                    }}
                  />
                )}
              </div>
            ) : (
              <div className={classes.chart}>
                {purchaseRehabGP === "pieChart" && (
                  <PieGraph
                    Data={pieRehabData}
                    chartRadius={85}
                    heightNum={"190px"}
                    isViewOnly={isViewOnly}
                    type={"rehab costs"}
                    fun={() => {
                      if (!isViewOnly) {
                        setItemendAdorn("")
                        setPeriod(0)
                        setIsAdditionalItems("costOverrun")
                        setItemType("Rehab Cost")
                        setView("itemized")
                      }
                    }}
                  />
                )}
                {purchaseRehabGP === "doughnutChart" && (
                  <DoughnutChart
                    Data={pieRehabData}
                    chartInnerRadius={40}
                    isViewOnly={isViewOnly}
                    chartOuterRadius={85}
                    heightNum={"190px"}
                    type={"rehab costs"}
                    fun={() => {
                      if (!isViewOnly) {
                        setItemendAdorn("")
                        setPeriod(0)
                        setIsAdditionalItems("costOverrun")
                        setItemType("Rehab Cost")
                        setView("itemized")
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Paper>

      <div className={classes.headName} >
        <div>
          <h3>Financing</h3>
          <p></p>
        </div>
        <div></div>
      </div>

      <Paper className={classes.financeContainer}>
        <div className={classes.financeSubCont} >
          <div className={classes.financeLabelData} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["Loan Amount"]}
              />
              <h3>Loan Amount:</h3>
            </div>
            <p className={classes.valueSty} >{`$ ${numberWithCommas(parseFloat(resultData.amountFinanced).toFixed(2))}`}</p>
          </div>
          <div className={classes.financeLabelData} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["Financing Of"]}
              />
              <h3>Financing Of:</h3>
            </div>
            <div className={classes.valueSty} >
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
            </div>
          </div>
          {resultData?.mortgageUpfrontAmount || resultData?.mortgageRecurringAmount ? (
            <div className={classes.financeLabelData}>
              <div className={classes.labelText}>
                <InfoLabel
                  obj={glossaryObjObj?.["Mortgage Insurance"]}
                />
                <h3>Mortgage Insurance</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <p>{`Upfront: $${numberWithCommas(parseFloat(resultData?.mortgageUpfrontAmount).toFixed(2))}`}</p>
                <p>{`Recurring: $${numberWithCommas(parseFloat(resultData?.mortgageRecurringAmount).toFixed(2))}`}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className={classes.financeSubCont} >
          <div className={classes.financeLabelData} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["Loan to Cost"]}
              />
              <h3>Loan to Cost:</h3>
            </div>
            <p className={classes.valueSty} >{`${numberWithCommas(parseFloat(resultData.loanToCost).toFixed(2))}%`}</p>
          </div>
          <div className={classes.financeLabelData} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["Loan to Value"]}
              />
              <h3>Loan to Value:</h3>
            </div>
            <p className={classes.valueSty} >{`${numberWithCommas(parseFloat(resultData.loanToValue).toFixed(2))}%`}</p>
          </div>
        </div>
        <div className={classes.financeSubCont} >
          <div className={classes.financeLabelData} >
            <div className={classes.labelText} >
              <InfoLabel
                obj={glossaryObjObj?.["Loan Type"]}
              />
              <h3>Loan Type:</h3>
            </div>
            {currentReport.LoanTerm ? (
              <p className={classes.valueSty} >{`${currentReport.LoanType}, ${currentReport.LoanTerm} years`}</p>
            ) : (
              <p className={classes.valueSty} >{`${currentReport.LoanType}`}</p>
            )}
          </div>
          <div className={classes.financeLabelData} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["Interest Rate"]}
              />
              <h3>Interest Rate:</h3>
            </div>
            <p className={classes.valueSty} >{`${numberWithCommas(parseFloat(currentReport.InterestRate).toFixed(2))}%`}</p>
          </div>
        </div>
      </Paper>

      <div className={classes.headName} >
        <div>
          <h3>Valuation</h3>
          <p></p>
        </div>
        <div></div>
      </div>

      <Paper className={classes.valuationCont}>
        <div className={classes.valuation2SubCont} >
          <div className={classes.valuationLabelDataCont} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["After Repair Value"]}
              />
              <h3>After Repair Value:</h3>
            </div>
            <p>{`$ ${numberWithCommas(parseFloat(currentReport.ARV).toFixed(2))}`}</p>
          </div>
          <div className={classes.valuationLabelDataCont} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["ARV Per Square Foot"]}
              />
              <h3>ARV Per Square Foot:</h3>
            </div>
            <p>{`$ ${numberWithCommas(parseFloat(resultData.arvPerSq).toFixed(2))}`}</p>
          </div>
        </div>
        <div className={classes.valuation2SubCont} >
          <div className={classes.valuationLabelDataCont} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["Price Per Square Foot"]}
              />
              <h3>Price Per Square Foot:</h3>
            </div>
            <p>{`$ ${numberWithCommas(parseFloat(resultData.pricePerSq).toFixed(2))}`}</p>
          </div>
          <div className={classes.valuationLabelDataCont} >
            <div className={classes.labelText}>
              <InfoLabel
                obj={glossaryObjObj?.["Rehab Per Square Foot"]}
              />
              <h3>Rehab Per Square Foot:</h3>
            </div>
            <p>{`$ ${numberWithCommas(parseFloat(resultData.rehabPerSq).toFixed(2))}`}</p>
          </div>
        </div>
      </Paper>

      <div className={classes.headName} >
        <div>
          <h3>Holding Costs</h3>
          <p></p>
        </div>
        <div></div>
      </div>

      <Paper className={classes.cashFlow_container}>
        <div className={classes.infoDataCont}>
          <div className={classes.infoData}>
            <div className={classes.dataLabelValueRow}>
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Rehab Period"]}
                />
                <h3>Rehab Period:</h3>
              </div>
              <p>{`${currentReport?.rehabPeriod} months`}</p>
            </div>
            <div className={classes.dataLabelValueRow}>
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Loan Payments"]}
                />
                <h3>Loan Payments:</h3>
              </div>
              <p className={classes.signStyle} >+</p>
              <div className={classes.valueCont} >
                <p>{`$ ${numberWithCommas(parseFloat(resultData.holdingLoanPayments).toFixed(2))}`}</p>
                <p style={{ fontSize: "12px", opacity: "0.8" }} >({`$ ${numberWithCommas(parseFloat((parseInt(resultData.holdingLoanPayments)) / parseInt(currentReport?.rehabPeriod)).toFixed(2))}`}/mo)</p>
              </div>
            </div>
            {resultData?.recurringTotal ? (
              <div style={isViewOnly ? {} : isSmall ? { width: "100%", display: "flex" } : { width: "103%", display: "flex" }} >
                <div className={classes.dataLabelValueRow} >
                  <div className={classes.label_text}>
                    <InfoLabel
                      obj={glossaryObjObj?.["Total Rehab Operating Cost"]}
                    />
                    <h3 style={{ display: "flex", alignItems: "center" }} >
                      Total Rehab Operating Cost
                      {rehabOperatingBreakdown ? (
                        <KeyboardArrowUpIcon
                          onClick={() => { setRehabOperatingBreakdown(false) }}
                          className={classes.DropDownIcon}
                        />
                      ) : (
                        <ExpandMoreIcon
                          onClick={() => { setRehabOperatingBreakdown(true) }}
                          className={classes.DropDownIcon}
                        />
                      )}
                    </h3>
                  </div>
                  <p className={classes.signStyle} >+</p>
                  <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.recurringTotal).toFixed(2))}`}</p>
                </div>
                {!isViewOnly && (
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: theme.palette.primary.main,
                      cursor: "pointer",
                      marginTop: "7px"
                    }}
                    onClick={() => {
                      setItemendAdorn("Per Month")
                      setPeriod(Number(currentReport?.rehabPeriod))
                      setIsAdditionalItems("taxAndInsurance")
                      setItemType("Recurring Rehab Cost")
                      setView("itemized")
                    }}
                  />
                )}
              </div>
            ) : null}
            {resultData?.recurringTotal ? (
              <div className={classes.p_row_Dropdown} style={{ width: "98%" }} >
                <DropDown
                  list={rehabOperatingCostsItemized}
                  openCloseBool={rehabOperatingBreakdown}
                  isMonthly={true}
                />
              </div>
            ) : null}
            <div className={classes.dataLabelValueRow} style={{ borderTop: "1px solid #D1CCCC" }} >
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Total Holding Costs"]}
                />
                <h3 style={{ color: theme.palette.primary.main }} >Total Holding Costs:</h3>
              </div>
              <p className={classes.signStyle} >=</p>
              <p className={classes.valueCont} style={{ color: theme.palette.primary.main }} >{`$ ${numberWithCommas(parseFloat(resultData.holdingCosts).toFixed(2))}`}</p>
            </div>
          </div>
          <div className={classes.chart_container}>
            <div className={classes.chart_header}>
              <p style={{ marginRight: "15px" }} >Holding Costs</p>
              {holdingGP === "pieChart" && (
                <CustomBtn
                  style={{ padding: "7px 2px 2px" }}
                  text={<DonutLargeIcon />}
                  endPart={<img src={criteriaSwitch} style={{ width: "8px", marginTop: "-5px", marginRight: "5px" }} />}
                  onClick={() => {
                    setHoldingGP("doughnutChart")
                  }}
                />
              )}
              {holdingGP === "doughnutChart" && (
                <CustomBtn
                  style={{ padding: "7px 2px 2px" }}
                  endPart={<img src={criteriaSwitch} style={{ width: "8px", marginTop: "-5px", marginRight: "5px" }} />}
                  text={<PieChartIcon />}
                  onClick={() => {
                    setHoldingGP("pieChart")
                  }}
                />
              )}
            </div>
            <div className={classes.chart}>
              {holdingGP === "pieChart" && (
                <PieGraph
                  Data={pieHoldingData}
                  chartRadius={85}
                  heightNum={"190px"}
                  type={"holding costs"}
                  isViewOnly={isViewOnly}
                  fun={() => {
                    if (!isViewOnly) {
                      setItemendAdorn("Per Month")
                      setPeriod(Number(currentReport?.rehabPeriod))
                      setIsAdditionalItems("taxAndInsurance")
                      setItemType("Recurring Rehab Cost")
                      setView("itemized")
                    }
                  }}
                />
              )}
              {holdingGP === "doughnutChart" && (
                <DoughnutChart
                  Data={pieHoldingData}
                  chartInnerRadius={40}
                  chartOuterRadius={85}
                  heightNum={"190px"}
                  isViewOnly={isViewOnly}
                  type={"holding costs"}
                  fun={() => {
                    if (!isViewOnly) {
                      setItemendAdorn("Per Month")
                      setPeriod(Number(currentReport?.rehabPeriod))
                      setIsAdditionalItems("taxAndInsurance")
                      setItemType("Recurring Rehab Cost")
                      setView("itemized")
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Paper>

      <div className={classes.headName} >
        <div>
          <h2>Sale & Profit</h2>
          <p></p>
        </div>
        <div></div>
      </div>

      <Paper className={classes.cashFlow_container}>
        <div className={classes.infoDataCont}>
          <div className={classes.infoData}>
            {Number(currentReport?.rentalPeriod) !== 0 ? (
              <div className={classes.dataLabelValueRow}>
                <div className={classes.label_text}>
                  <InfoLabel
                    obj={glossaryObjObj?.["Selling Price"]}
                  />
                  <h3>Selling Price:</h3>
                </div>
                <p className={classes.signStyle} >+</p>
                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport?.sellingPrice).toFixed(2))}`}</p>
              </div>
            ) : (
              <div className={classes.dataLabelValueRow}>
                <div className={classes.label_text}>
                  <InfoLabel
                    obj={glossaryObjObj?.["After Repair Value"]}
                  />
                  <h3>After Repair Value:</h3>
                </div>
                <p className={classes.signStyle} >+</p>
                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport?.ARV).toFixed(2))}`}</p>
              </div>
            )}
            {currentReport?.sellingCostTotal ? (
              <div style={isViewOnly ? {} : isSmall ? { width: "100%", display: "flex" } : { width: "103%", display: "flex" }} >
                <div className={classes.dataLabelValueRow} >
                  <div className={classes.label_text}>
                    <InfoLabel
                      obj={glossaryObjObj?.["Selling Costs"]}
                    />
                    <h3 style={{ display: "flex", alignItems: "center" }} >
                      Selling Costs
                      {sellingCostsBreakdown ? (
                        <KeyboardArrowUpIcon
                          onClick={() => { setSellingCostsBreakdown(false) }}
                          className={classes.DropDownIcon}
                        />
                      ) : (
                        <ExpandMoreIcon
                          onClick={() => { setSellingCostsBreakdown(true) }}
                          className={classes.DropDownIcon}
                        />
                      )}
                    </h3>
                  </div>
                  <p className={classes.signStyle} >-</p>
                  <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(currentReport?.sellingCostTotal).toFixed(2))}`}</p>
                </div>
                {!isViewOnly && (
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: theme.palette.primary.main,
                      cursor: "pointer",
                      marginTop: "7px"
                    }}
                    onClick={() => {
                      setItemendAdorn("")
                      setIsAdditionalItems(null)
                      setPeriod(0)
                      setItemType("Selling Cost")
                      setView("itemized")
                    }}
                  />
                )}
              </div>
            ) : null}
            {currentReport?.sellingCostTotal ? (
              <div className={classes.p_row_Dropdown} style={{ width: "98%" }} >
                <DropDown
                  list={pieSellingData}
                  isMonthly={false}
                  openCloseBool={sellingCostsBreakdown}
                />
              </div>
            ) : null}
            <div className={classes.dataLabelValueRow} style={{ borderTop: "1px solid #D1CCCC" }} >
              <div className={classes.label_text}>
                <h3 style={{ color: theme.palette.primary.main }} >Sale Proceeds:</h3>
              </div>
              <p className={classes.signStyle} >=</p>
              <p className={classes.valueCont} style={{ color: theme.palette.primary.main }} >{`$ ${numberWithCommas(parseFloat(resultData.saleProceeds).toFixed(2))}`}</p>
            </div>
            <div className={classes.dataLabelValueRow}>
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Loan Repayments"]}
                />
                <h3>Loan Repayment:</h3>
              </div>
              <p className={classes.signStyle} >-</p>
              <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.loanRepayment).toFixed(2))}`}</p>
            </div>
            <div className={classes.dataLabelValueRow}>
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Holding Costs"]}
                />
                <h3>Holding Costs:</h3>
              </div>
              <p className={classes.signStyle} >-</p>
              <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.holdingCosts).toFixed(2))}`}</p>
            </div>
            <div className={classes.dataLabelValueRow}>
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Invested Cash"]}
                />
                <h3>Invested Cash:</h3>
              </div>
              <p className={classes.signStyle} >-</p>
              <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.totalCashNeeded).toFixed(2))}`}</p>
            </div>
            {currentReport?.rentalPeriod ? (
              <div className={classes.dataLabelValueRow}>
                <div className={classes.label_text}>
                  <InfoLabel
                    obj={glossaryObjObj?.["Net Rental Income"]}
                  />
                  <h3>Net Rental Income:</h3>
                </div>
                <p className={classes.signStyle} >+</p>
                <p className={classes.valueCont} >{`$ ${numberWithCommas(parseFloat(resultData.holdingIncome).toFixed(2))}`}</p>
              </div>
            ) : null}
            <div className={classes.dataLabelValueRow} style={{ borderTop: "1px solid #D1CCCC" }} >
              <div className={classes.label_text}>
                <InfoLabel
                  obj={glossaryObjObj?.["Total Profit Flip"]}
                />
                <h3 style={{ color: theme.palette.primary.main }} >Total Profit:</h3>
              </div>
              <p className={classes.signStyle} >=</p>
              {resultData?.profitFlip ? (
                <p className={classes.valueCont} style={{ color: theme.palette.primary.main }} >{`$ ${numberWithCommas(parseFloat(resultData.profitFlip).toFixed(2))}`}</p>
              ) : null}
            </div>
          </div>
          <div className={classes.chart_container}>
            <div className={classes.chart_header}>
              <p style={{ marginRight: "15px" }} >Selling Costs</p>
              {sellingGP === "pieChart" && (
                <CustomBtn
                  style={{ padding: "7px 2px 2px" }}
                  text={<DonutLargeIcon />}
                  endPart={<img src={criteriaSwitch} style={{ width: "8px", marginTop: "-5px", marginRight: "5px" }} />}
                  onClick={() => {
                    setSellingGP("doughnutChart")
                  }}
                />
              )}
              {sellingGP === "doughnutChart" && (
                <CustomBtn
                  style={{ padding: "7px 2px 2px" }}
                  endPart={<img src={criteriaSwitch} style={{ width: "8px", marginTop: "-5px", marginRight: "5px" }} />}
                  text={<PieChartIcon />}
                  onClick={() => {
                    setSellingGP("pieChart")
                  }}
                />
              )}
            </div>
            <div className={classes.chart}>
              {sellingGP === "pieChart" && (
                <PieGraph
                  Data={pieSellingData}
                  chartRadius={85}
                  type={"selling costs"}
                  heightNum={"190px"}
                  isViewOnly={isViewOnly}
                  fun={() => {
                    if (!isViewOnly) {
                      setItemendAdorn("")
                      setIsAdditionalItems(null)
                      setPeriod(0)
                      setItemType("Selling Cost")
                      setView("itemized")
                    }
                  }}
                />
              )}
              {sellingGP === "doughnutChart" && (
                <DoughnutChart
                  Data={pieSellingData}
                  chartInnerRadius={40}
                  chartOuterRadius={85}
                  type={"selling costs"}
                  isViewOnly={isViewOnly}
                  heightNum={"230px"}
                  fun={() => {
                    if (!isViewOnly) {
                      setItemendAdorn("")
                      setIsAdditionalItems(null)
                      setPeriod(0)
                      setItemType("Selling Cost")
                      setView("itemized")
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Paper>

      <div className={classes.headName} >
        <div>
          <h2>Investment Returns</h2>
          <p></p>
        </div>
        <div></div>
      </div>

      <Paper className={classes.investmentReturnCont}>
        <div className={classes.investmentReturnSubCont} >
          <div className={classes.labelText} >
            <InfoLabel
              obj={glossaryObjObj?.["Return on Investment"]}
            />
            <h3 style={parseFloat(resultData.ROI) > 0 ? {} : redColor} >Return On Investment:</h3>
          </div>
          <p style={parseFloat(resultData.ROI) > 0 ? {} : redColor} >{`${parseFloat(resultData.ROI).toFixed(2)}%`}</p>
        </div>
        <div className={classes.investmentReturnSubCont} >
          <div className={classes.labelText} >
            <InfoLabel
              obj={glossaryObjObj?.["Annualized ROI"]}
            />
            <h3>Annualized ROI:</h3>
          </div>
          <p>{`${parseFloat(resultData.annualizedROI).toFixed(2)}%`}</p>
        </div>
      </Paper>
    </div>
  );
}

export default FlipReport;
