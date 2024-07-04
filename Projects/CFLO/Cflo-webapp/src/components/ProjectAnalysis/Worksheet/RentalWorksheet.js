import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import _ from "lodash";
import RentalExpense from "../InputComponents/RentalExpense";
import RentalProjection from "../InputComponents/RentalProjection";
import PurchaseRehab from "../InputComponents/PurchaseRehab";
import Financing from "../InputComponents/Financing";
import SalesSuggestion from "../SalesSuggestion";
import RentSuggestion from "../RentSuggestion";
import RentEstimate from "../RentEstimate";
import configObject from "../../../config/index.js"
import Button from "@material-ui/core/Button";
import NonLinearStepper from "../../styled/CommonComponents/NonLinearStepper";
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CustomBtn from "../../styled/CommonComponents/CustomBtn";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    backgroundColor: "white",
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
  }
}));

export default function RentalWorkSheet({
  reportId,
  currentReport,
  setView,
  setItemType,
  viewReport,
  setCurrentReport,
  setIsDisabled,
  setSuggestionType,
  suggestionType,
  projectData,
  setProjectData,
  isDisabled
}) {
  const classes = useStyles();
  const { teamId } = useParams();

  const [purchaseDisable, setpurchaseDisable] = useState(false);
  const [rentalDisable, setrentalDisable] = useState(false);
  const [projectionDisable, setprojectionDisable] = useState(false);
  const [financingDisable, setFinancingDisable] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [taxpm, setTaxpm] = useState("");
  const [insurancepm, setInsurancepm] = useState("");
  const [prStatus, setPRInputStatus] = useState({})
  const [finStatus, setFinInputStatus] = useState({})
  const [rentStatus, setRentInputStatus] = useState({})
  const [lpStatus, setLPInputStatus] = useState({})

  useEffect(() => {
    let newCompleted = new Set(completed);

    let arr1 = []
    let allover1 = false;
    if (Number(currentReport?.purchasePrice) && Number(currentReport?.ARV) && Number(currentReport?.propertyTax) && Number(currentReport?.propertyInsurance)) {
      arr1 = [
        {
          input: "Purchase Price",
          status: true,
        },
        {
          input: "Property Tax",
          status: true,
        },
        {
          input: "Property Insurance",
          status: true,
        },
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
          input: "Purchase Price",
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

      newCompleted.delete(0);
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
    if (currentReport?.Period && Number(currentReport?.GrossRent)) {
      newCompleted.add(2);
      arr3 = [
        {
          input: "Rental period",
          status: true,
        },
        {
          input: "Gross rent",
          status: true,
        },
      ]
      allover3 = true
    } else {
      newCompleted.delete(2);
      arr3 = [
        {
          input: "Rental period",
          status: currentReport?.Period ? true : false,
        },
        {
          input: "Gross rent",
          status: Number(currentReport?.GrossRent) ? true : false,
        },
      ]
    }
    let obj3 = {
      title: "Rent & Expenses",
      inputStatusArr: arr3,
      allover: allover3
    }
    setRentInputStatus(obj3)



    let arr4 = []
    let allover4 = false;
    if (Number(currentReport?.Appreciation) && Number(currentReport?.IncomeIncrease) && Number(currentReport?.ExpenseIncrease) && Number(currentReport?.SellingCosts)) {
      newCompleted.add(3);
      arr4 = [
        {
          input: "Appreciation",
          status: true,
        },
        {
          input: "Income increase",
          status: true,
        },
        {
          input: "Expense increase",
          status: true,
        },
        {
          input: "Selling costs",
          status: true,
        },
      ]
      allover4 = true;
    } else {
      newCompleted.delete(3);
      arr4 = [
        {
          input: "Appreciation",
          status: Number(currentReport?.Appreciation) ? true : false,
        },
        {
          input: "Income increase",
          status: Number(currentReport?.IncomeIncrease) ? true : false,
        },
        {
          input: "Expense increase",
          status: Number(currentReport?.ExpenseIncrease) ? true : false,
        },
        {
          input: "Selling costs",
          status: Number(currentReport?.SellingCosts) ? true : false,
        },
      ]
    }
    let obj4 = {
      title: "Long Term Projections",
      inputStatusArr: arr4,
      allover: allover4
    }
    setLPInputStatus(obj4)


    setCompleted(newCompleted)

    if (newCompleted.size === 4) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [projectionDisable, purchaseDisable, rentalDisable, currentReport]);


  let WorksheetComponent = null;

  switch (suggestionType) {
    case "inputSheet":
      WorksheetComponent = <>
        <NonLinearStepper
          totalSteps={4}
          steps={[
            "Purchase & Rehab",
            "Financing",
            "Rent & Expenses",
            "Long Term Projections"
          ]}
          stepContent={[
            "Estimates of Purchase price, ARV, Rehab costs, etc.",
            "Customize loan data, rehab financing and mortgage insurance.",
            "Estimates related to rental income, vacancy and operating expense.",
            "Customize assumptions related to long-term projections."
          ]}
          status={{
            "Purchase & Rehab": prStatus,
            "Financing": finStatus,
            "Rent & Expenses": rentStatus,
            "Long Term Projections": lpStatus
          }}
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
            setpurchaseDisable={setpurchaseDisable}
            taxpm={taxpm}
            setTaxpm={setTaxpm}
            insurancepm={insurancepm}
            setInsurancepm={setInsurancepm}
            setCurrentReport={setCurrentReport}
            setSuggestionType={setSuggestionType}
            suggestionType={suggestionType}
          />
        )}
        {activeStep === 1 && (
          <Financing
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
            setView={setView}
            setItemType={setItemType}
            setCurrentReport={setCurrentReport}
            setFinancingDisable={setFinancingDisable}
            financingDisable={financingDisable}
          />
        )}
        {activeStep === 2 && (
          <RentalExpense
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
            setCurrentReport={setCurrentReport}
            setView={setView}
            setItemType={setItemType}
            rentalDisable={rentalDisable}
            setrentalDisable={setrentalDisable}
            taxpm={taxpm}
            insurancepm={insurancepm}
            setSuggestionType={setSuggestionType}
            suggestionType={suggestionType}
          />
        )}
        {activeStep === 3 && (
          <RentalProjection
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
            setIsDisabled={setIsDisabled}
            projectionDisable={projectionDisable}
            setprojectionDisable={setprojectionDisable}
            setCurrentReport={setCurrentReport}
          />
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

          {activeStep === 3 ? (<>
            <CustomBtn
              startPart={<PieChartRoundedIcon />}
              text={"View Report"}
              disabled={isDisabled}
              onClick={viewReport}
            />
          </>) : (
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
