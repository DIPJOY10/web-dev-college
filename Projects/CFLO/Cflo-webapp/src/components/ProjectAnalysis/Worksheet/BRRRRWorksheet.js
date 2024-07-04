import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import _ from "lodash";
import PurchaseRehab from "../InputComponents/PurchaseRehab";
import Financing from "../InputComponents/Financing";
import BRRRRRefinance from "../InputComponents/BRRRRRefinance";
import RentalExpense from "../InputComponents/RentalExpense";
import RentalProjection from "../InputComponents/RentalProjection";
import SalesSuggestion from "../SalesSuggestion";
import Button from "@material-ui/core/Button";
import RentSuggestion from "../RentSuggestion";
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import configObject from "../../../config/index.js"
import RentEstimate from "../RentEstimate";
import NonLinearStepper from "../../styled/CommonComponents/NonLinearStepper";
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CustomBtn from "../../styled/CommonComponents/CustomBtn";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "20px",
    width: "100%",
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

export default function BRRRRWorkSheet({
  reportId,
  currentReport,
  setView,
  setItemType,
  viewReport,
  setIsDisabled,
  setCurrentReport,
  setSuggestionType,
  suggestionType,
  projectData,
  isDisabled,
  setProjectData
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
  const [reFinStatus, setReFinInputStatus] = useState({})
  const [rentStatus, setRentInputStatus] = useState({})
  const [lpStatus, setLPInputStatus] = useState({})


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
      }
      arr2.push({
        input: "Down payment",
        status: true,
      })
      arr2.push({
        input: "Interest rate",
        status: true,
      })
      if (Number(currentReport?.LoanTerm)) {
        arr2.push({
          input: "Loan term",
          status: true,
        })
      }
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




    let arr5 = []
    let allover5 = false;
    if (Number(currentReport?.refinanceTime) && Number(currentReport?.refinanceTime) > Number(currentReport?.rehabPeriod) && ((currentReport?.refinanceLoanType === "Interest Only" && Number(currentReport?.remainingEquity) && Number(currentReport?.refinanceInterestRate)) || (currentReport?.refinanceLoanType === "Amortizing" && Number(currentReport?.remainingEquity) && Number(currentReport?.refinanceInterestRate) && Number(currentReport?.refinanceLoanTerm)))) {
      newCompleted.add(2);
      arr5.push({
        input: "Refinance period",
        status: true,
      })
      if (currentReport?.refinanceLoanType === "Interest Only") {
        arr5.push({
          input: "Loan type (Interest Only)",
          status: true,
        })
      } else {
        arr5.push({
          input: "Loan type (Amortizing)",
          status: true,
        })
        arr5.push({
          input: "Loan term",
          status: true,
        })
      }
      arr5.push({
        input: "Remaining equity",
        status: true,
      })
      arr5.push({
        input: "Interest rate",
        status: true,
      })
      allover5 = true;
    } else {
      newCompleted.delete(2);
      if (currentReport?.refinanceLoanType === "Interest Only") {
        arr5.push({
          input: "Loan type (Interest Only)",
          status: true,
        })
      } else {
        arr5.push({
          input: "Loan type (Amortizing)",
          status: true,
        })
        arr5.push({
          input: "Loan term",
          status: Number(currentReport?.refinanceLoanTerm) ? true : false,
        })
      }
      arr5.push({
        input: "Remaining equity",
        status: Number(currentReport?.remainingEquity) ? true : false,
      })
      arr5.push({
        input: "Interest rate",
        status: Number(currentReport?.refinanceInterestRate) ? true : false,
      })
      if (Number(currentReport?.refinanceTime)) {
        if (Number(currentReport?.refinanceTime) > Number(currentReport?.rehabPeriod)) {
          arr5.push({
            input: "Refinance period",
            status: true,
          })
        } else {
          arr5.push({
            input: "Refinance period should be greater than rehab period",
            status: false,
          })
        }
      } else {
        arr5.push({
          input: "Refinance period",
          status: false,
        })
      }
    }
    let obj5 = {
      title: "Financing (Refinance)",
      inputStatusArr: arr5,
      allover: allover5
    }
    setReFinInputStatus(obj5)





    let arr3 = []
    let allover3 = false;

    if (currentReport?.Period && Number(currentReport?.GrossRent)) {
      newCompleted.add(3);
      arr3 = [
        {
          input: "Rental period",
          status: true,
        },
        {
          input: "Gross rent",
          status: true,
        }
      ]
      allover3 = true
    } else {
      newCompleted.delete(3);
      arr3 = [
        {
          input: "Rental period",
          status: currentReport?.Period ? true : false,
        },
        {
          input: "Gross rent",
          status: Number(currentReport?.GrossRent) ? true : false,
        }
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
      newCompleted.add(4);
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
      newCompleted.delete(4);
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

    if (newCompleted.size === 5) {
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
            "Financing (Refinance)",
            "Rent & Expenses",
            "Long Term Projections"
          ]}
          status={{
            "Purchase & Rehab": prStatus,
            "Financing": finStatus,
            "Financing (Refinance)": reFinStatus,
            "Rent & Expenses": rentStatus,
            "Long Term Projections": lpStatus
          }}
          stepContent={[
            "Estimates of Purchase price, ARV, Rehab costs, etc.",
            "Customize loan data, rehab financing and mortgage insurance.",
            "Customize long-term financing and refinance costs.",
            "Estimates related to rental income, vacancy and operating expense.",
            "Customize assumptions related to long-term projections."
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
            setView={setView}
            setItemType={setItemType}
            purchaseDisable={purchaseDisable}
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
          <BRRRRRefinance
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
            setView={setView}
            setItemType={setItemType}
            setCurrentReport={setCurrentReport}
          />
        )}
        {activeStep === 3 && (
          <RentalExpense
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
            setView={setView}
            setItemType={setItemType}
            rentalDisable={rentalDisable}
            setrentalDisable={setrentalDisable}
            taxpm={taxpm}
            insurancepm={insurancepm}
            setCurrentReport={setCurrentReport}
            setSuggestionType={setSuggestionType}
            suggestionType={suggestionType}
          />
        )}
        {activeStep === 4 && (
          <RentalProjection
            reportId={reportId}
            teamId={teamId}
            currentReport={currentReport}
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

          {activeStep === 4 ? (
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
