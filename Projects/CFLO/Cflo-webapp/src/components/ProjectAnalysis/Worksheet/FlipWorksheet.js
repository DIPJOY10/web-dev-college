import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from '@material-ui/core';
import { updateAnalysisReport } from "../api.call";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";
import PurchaseRehab from "../InputComponents/PurchaseRehab";
import Button from "@material-ui/core/Button";
import Financing from "../InputComponents/Financing";
import FlipRental from "../InputComponents/FlipRental";
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import InfoLabel from "../InputComponents/InfoLabel";
import DynamicMultiInput from "../InputComponents/DynamicMultiInput";
import SalesSuggestion from "../SalesSuggestion";
import RentSuggestion from "../RentSuggestion";
import TextFieldNumberFormated from "../../styled/CommonComponents/TextFieldNumberFormated";
import configObject from "../../../config/index.js"
import RentEstimate from "../RentEstimate";
import NonLinearStepper from "../../styled/CommonComponents/NonLinearStepper";
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CustomBtn from "../../styled/CommonComponents/CustomBtn";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    backgroundColor: "white",
  },
  rentSaleCont: {
    "& h2": {
      color: "#1684ea",
      fontWeight: "normal",
      margin: "1rem 0 1rem 0",
    },
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    }
  },
  linkStyle: {
    margin: "0rem 0rem 2rem",
    [theme.breakpoints.down('sm')]: {
      margin: "0px 0px 20px",
    }
  },
  btnCont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px"
  },
  control_switch: {
    marginLeft: "auto",
  },
  onButton: {
    margin: "0.5rem 0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subLabel: {
    fontSize: "16px",
    fontWeight: "510",
    opacity: "1",
    color: "black",
  },
  subSubLabel: {
    fontSize: "15px",
    fontWeight: "500",
    opacity: "0.8"
  },
}));

export default function FlipWorkSheet({
  reportId,
  currentReport,
  setCurrentReport,
  setView,
  setItemType,
  viewReport,
  setIsDisabled,
  setSuggestionType,
  suggestionType,
  projectData,
  isDisabled,
  setProjectData
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = useState({
    checkedA: false,
    checkedB: true,
  });
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { teamId } = useParams();

  const updateReport = async (data) => {
    await updateAnalysisReport({
      reportData: data,
      reportId,
      teamId,
    });
  };

  const [purchaseDisable, setpurchaseDisable] = useState(false);
  const [financingDisable, setFinancingDisable] = useState(false);
  const [taxpm, setTaxpm] = useState("");
  const [insurancepm, setInsurancepm] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [sellingCostTotal, setSellingCostTotal] = useState(currentReport?.sellingCostTotal || "");
  const [prStatus, setPRInputStatus] = useState({})
  const [finStatus, setFinInputStatus] = useState({})
  const [rentStatus, setRentInputStatus] = useState({})

  useEffect(() => {
    let newCompleted = new Set(completed);

    let arr1 = []
    let allover1 = false;
    if (Number(currentReport?.purchasePrice) && Number(currentReport?.ARV) && Number(currentReport?.propertyTax) && Number(currentReport?.propertyInsurance) && Number(currentReport?.rehabTotal) && Number(currentReport?.rehabPeriod)) {
      arr1 = [
        {
          input: "Purchase Price",
          status: true,
        },
        {
          input: "ARV",
          status: true,
        },
        {
          input: "Property Insurance",
          status: true,
        },
        {
          input: "Rehab period",
          status: true
        }
      ]
      if (Number(currentReport?.ARV) >= Number(currentReport?.purchasePrice)) {
        newCompleted.add(0);

        arr1.push({
          input: "ARV",
          status: true,
        })
        allover1 = true;
      } else {
        newCompleted.delete(0);

        arr1.push({
          input: "ARV must be greater than purchase price",
          status: false,
        })
      }
    } else {
      newCompleted.delete(0);

      arr1.push({
        input: "Purchase Price",
        status: Number(currentReport?.purchasePrice) ? true : false,
      })
      if (Number(currentReport?.ARV)) {
        if (Number(currentReport?.ARV) >= Number(currentReport?.purchasePrice)) {
          arr1.push({
            input: "ARV",
            status: true,
          })
        } else {
          arr1.push({
            input: "ARV must be greater than purchase price",
            status: false,
          })
        }
      } else {
        arr1.push({
          input: "ARV",
          status: false,
        })
      }
      arr1.push({
        input: "Property Tax",
        status: Number(currentReport?.propertyTax) ? true : false,
      })
      arr1.push({
        input: "Insurance",
        status: Number(currentReport?.propertyInsurance) ? true : false,
      })
      arr1.push({
        input: "Rehab period",
        status: Number(currentReport?.rehabPeriod) ? true : false,
      })
    }
    let obj1 = {
      title: "Purchase & Rehab",
      inputStatusArr: arr1,
      allover: allover1
    }
    setPRInputStatus(obj1)



    let arr2 = []
    let allover2 = false;
    if (!currentReport?.isFinancing) {
      newCompleted.add(1);
      arr2 = [
        {
          input: "Did't apply any financing",
          status: true,
        }
      ]
      allover2 = true;
    } else if ((currentReport?.LoanType === "Interest Only" && Number(currentReport?.DownPayment) && Number(currentReport?.InterestRate)) || (currentReport?.LoanType === "Amortizing" && Number(currentReport?.DownPayment) && Number(currentReport?.InterestRate) && Number(currentReport?.LoanTerm))) {
      newCompleted.add(1);
      if (currentReport?.LoanType === "Interest Only") {
        arr2.push({
          input: "Loan Type (Interest Only)",
          status: true,
        })
      } else {
        arr2.push({
          input: "Loan Type (Amortizing)",
          status: true,
        })
        arr2.push({
          input: "Loan term",
          status: true,
        })
      }
      arr2.push({
        input: "Down payment",
        status: true,
      })
      arr2.push({
        input: "Interest rate",
        status: true,
      })
      allover2 = true;
    } else {
      newCompleted.delete(1);

      arr2.push({
        input: "Down payment",
        status: Number(currentReport?.DownPayment) ? true : false,
      })

      arr2.push({
        input: "Interest rate",
        status: Number(currentReport?.InterestRate) ? true : false,
      })

      if (currentReport?.LoanType === "Interest Only") {
        arr2.push({
          input: "Loan type (Interest Only)",
          status: true,
        })

      } else {
        arr2.push({
          input: "Loan type (Amortizing)",
          status: true,
        })

        arr2.push({
          input: "Loan term",
          status: Number(currentReport?.LoanTerm) ? true : false,
        })
      }

    }
    let obj2 = {
      title: "Financing",
      inputStatusArr: arr2,
      allover: allover2
    }
    setFinInputStatus(obj2)



    let arr3 = []
    let allover3 = false;
    if (Number(currentReport?.rentalPeriod)) {
      if (Number(currentReport?.rentalPeriod) && Number(currentReport?.GrossRent) && Number(currentReport?.sellingPrice) && Number(currentReport?.sellingCostTotal)) {
        arr3 = [
          {
            input: "Rental period",
            status: true,
          },
          {
            input: "Gross rent",
            status: true,
          },
          {
            input: "Selling cost total",
            status: true,
          }
        ]
        if (Number(currentReport?.sellingPrice) >= Number(currentReport?.ARV)) {
          newCompleted.add(2);

          arr3.push({
            input: "Selling price",
            status: true,
          })
          allover3 = true;
        } else {
          newCompleted.delete(2);

          arr3.push({
            input: "Selling price should be greater then ARV",
            status: false,
          })
        }
      } else {
        newCompleted.delete(2);
        arr3 = [
          {
            input: "Rental period",
            status: Number(currentReport?.rentalPeriod) ? true : false,
          },
          {
            input: "Gross rent",
            status: Number(currentReport?.GrossRent) ? true : false,
          },
          {
            input: "Selling cost total",
            status: Number(currentReport?.sellingCostTotal) ? true : false,
          },
          {
            input: "Selling price",
            status: Number(currentReport?.sellingPrice) ? true : false,
          },
        ]
      }
    } else if (Number(currentReport?.sellingCostTotal)) {
      newCompleted.add(2);

      arr3.push({
        input: "Selling cost total",
        status: true,
      })
      arr3.push({
        input: "Didn't apply rental",
        status: true,
      })
      allover3 = true;
    } else {
      newCompleted.delete(2);

      arr3.push({
        input: "Selling cost total",
        status: false,
      })
      arr3.push({
        input: "Didn't apply rental",
        status: true,
      })
    }
    let obj3 = {
      title: "Rent & Sale",
      inputStatusArr: arr3,
      allover: allover3
    }
    setRentInputStatus(obj3)



    if (newCompleted.size === 3) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    setCompleted(newCompleted)
  }, [purchaseDisable, financingDisable, currentReport]);

  useEffect(() => {
    if (
      (Number(currentReport?.rentalPeriod) && Number(currentReport?.rentalPeriod) !== 0) ||
      (Number(currentReport?.GrossRent) && Number(currentReport?.GrossRent) !== 0) ||
      (Number(currentReport?.Vacancy) && Number(currentReport?.Vacancy) !== 0) ||
      (Number(currentReport?.otherIncomeTotal) && Number(currentReport?.otherIncomeTotal) !== 0) ||
      (Number(currentReport?.operatingExpenseTotal) && Number(currentReport?.operatingExpenseTotal) !== 0) ||
      (Number(currentReport?.sellingPrice) && Number(currentReport?.sellingPrice) !== 0)
    ) {
      setState({ ...state, checkedA: true });
    }
  }, [currentReport, activeStep]);

  let WorksheetComponent = null;

  switch (suggestionType) {
    case "inputSheet":
      WorksheetComponent = <>
        <NonLinearStepper
          totalSteps={4}
          steps={[
            "Purchase & Rehab",
            "Financing",
            "Rent & Sale"
          ]}
          status={{
            "Purchase & Rehab": prStatus,
            "Financing": finStatus,
            "Rent & Sale": rentStatus,
          }}
          stepContent={[
            "Estimates of Purchase price, ARV, Rehab costs, etc.",
            "Customize loan data, rehab financing and mortgage insurance.",
            "Customize selling costs, selling price and rental details (if any)."
          ]}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          completed={completed}
          setCompleted={setCompleted}
        />
        {activeStep === 0 && (
          <PurchaseRehab
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
            setCurrentReport={setCurrentReport}
            setView={setView}
            setItemType={setItemType}
            purchaseDisable={purchaseDisable}
            setpurchaseDisable={setpurchaseDisable}
            taxpm={taxpm}
            setTaxpm={setTaxpm}
            insurancepm={insurancepm}
            setInsurancepm={setInsurancepm}
            setSuggestionType={setSuggestionType}
            suggestionType={suggestionType}
          />
        )}
        {activeStep === 1 && (
          <Financing
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
            setCurrentReport={setCurrentReport}
            setView={setView}
            setItemType={setItemType}
            setFinancingDisable={setFinancingDisable}
            financingDisable={financingDisable}
          />
        )}
        {activeStep === 2 && (
          <div className={classes.rentSaleCont} >
            <div className={classes.onButton}>
              <InputLabel className={classes.subLabel} >
                Do you want to Rent the property before selling it?
              </InputLabel>
              <Switch
                className={classes.control_switch}
                checked={state.checkedA}
                onChange={async (event) => {
                  const val = event.target.checked;
                  setState({ ...state, [event.target.name]: val });
                  if (val === false) {
                    console.log("rental flip is reset!");
                    updateReport({
                      rentalPeriod: "",
                      GrossRent: "",
                      Vacancy: "",
                      sellingPrice: "",
                      otherIncomeTotal: "",
                      operatingExpenseTotal: "",
                      otherIncomeItemized: [],
                      operatingExpenseItemized: [],
                    });
                  }
                }}
                name="checkedA"
                color="primary"
              />
            </div>
            {state.checkedA ? (
              <FlipRental
                reportId={reportId}
                teamId={teamId}
                currentReport={currentReport}
                setCurrentReport={setCurrentReport}
                setView={setView}
                setItemType={setItemType}
                taxpm={taxpm}
                insurancepm={insurancepm}
                setSuggestionType={setSuggestionType}
                suggestionType={suggestionType}
              />
            ) : (
              <>
                <p className={classes.subSubLabel} >Selling Price</p>
                <TextFieldNumberFormated
                  value={currentReport?.ARV}
                  onChange={(e) => { }}
                  variant={"outlined"}
                  style={{ width: "100%", margin: "10px 0px 25px 0px" }}
                  size={"small"}
                  disabled={true}
                />
              </>
            )}
            <InfoLabel
              nameClass={classes.subLabel}
              name={"Selling Costs ($)"}
              text={
                "Selling cost (aka closing costs) are expenses and fees due at the closing of a real estate transaction while selling a property"
              }
            />
            <div style={{ width: "100%", margin: "10px 0px 25px 0px" }} >
              <DynamicMultiInput
                items={currentReport?.sellingCostsItemized}
                itemKeyType={"sellingCostsItemized"}
                ItemType={"Selling Cost"}
                currentReport={currentReport}
                setCurrentReport={setCurrentReport}
                total={sellingCostTotal}
                setTotal={setSellingCostTotal}
                totalFieldKey={"sellingCostTotal"}
                inputAdornment={"$"}
              />
            </div>
          </div>
        )}

        <div className={classes.linkStyle} >
          <p>To know more about the default values,
            <a
              href={`${configObject?.BASE_URL}analysis/disclaimer/${currentReport?.reportType}`}
              target="_blank"
              style={{ marginLeft: "5px", cursor: 'pointer', textDecoration: "none" }}
            >click here</a>
          </p>
        </div>

        <div className={classes.btnCont} >
          {activeStep === 0 ? (
            <CustomBtn
              startPart={<ArrowLeftIcon />}
              disabled={true}
              text={"Previous"}
            />
          ) : (
            <CustomBtn
              startPart={<ArrowLeftIcon />}
              text={"Previous"}
              onClick={() => { setActiveStep(activeStep - 1) }}
            />
          )}

          {activeStep === 2 ? (
            <CustomBtn
              startPart={<PieChartRoundedIcon />}
              text={"View Report"}
              disabled={isDisabled}
              onClick={viewReport}
            />
          ) : (
            <CustomBtn
              endPart={<ArrowRightIcon />}
              text={"Next"}
              onClick={() => { setActiveStep(activeStep + 1); }}
            />
          )}
        </div>
      </>
      break;

    case "saleSuggestion":
      WorksheetComponent = <SalesSuggestion
        projectData={projectData}
        zpid={projectData?.zpid || null}
        setCurrentReport={setCurrentReport}
        currentReport={currentReport}
        reportId={reportId}
        teamId={teamId}
        viewOnly={false}
        setSuggestionType={setSuggestionType}
        setProjectData={setProjectData}
      />
      break;

    case "rentSuggestion":
      WorksheetComponent = <>{projectData?.homeStatus === "FOR_RENT" ? (
        <RentSuggestion
          projectData={projectData}
          zpid={projectData?.zpid || null}
          setCurrentReport={setCurrentReport}
          currentReport={currentReport}
          reportId={reportId}
          teamId={teamId}
          setSuggestionType={setSuggestionType}
          setProjectData={setProjectData}
        />
      ) : (
        <RentEstimate
          projectData={projectData}
          zpid={projectData?.zpid || null}
          setCurrentReport={setCurrentReport}
          currentReport={currentReport}
          reportId={reportId}
          teamId={teamId}
          viewOnly={false}
          setSuggestionType={setSuggestionType}
          setProjectData={setProjectData}
        />
      )}</>
      break;
  }

  return (
    <div className={classes.root}>
      {WorksheetComponent}
    </div>
  );
}
