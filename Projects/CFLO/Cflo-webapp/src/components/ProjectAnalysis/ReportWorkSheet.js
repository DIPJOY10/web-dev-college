import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { useParams, useHistory } from "react-router-dom";
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import RentalWorksheet from "./Worksheet/RentalWorksheet";
import BRRRRWorksheet from "./Worksheet/BRRRRWorksheet";
import FlipWorksheet from "./Worksheet/FlipWorksheet";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { useSelector, useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import { getReport, updateData } from "./api.call";
import CircularProgress from "@material-ui/core/CircularProgress";
import LessText from '../styled/CommonComponents/LessText';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Dialog from '@material-ui/core/Dialog';
import configObject from "../../config/index"
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PagePath from "../styled/CommonComponents/Page.Path";
import { FreeBreakfastOutlined } from "@material-ui/icons";
import AnalysisHeader from "../styled/CommonComponents/AnalysisHead";
import CustomBtn from "../styled/CommonComponents/CustomBtn";
import { reportDataCalculation } from "./CalculationFunctions";

const useStyles = makeStyles((theme) => ({
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
  fullWidthDisplay: {
    width: "100%",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  offset: theme.mixins.toolbar,
}));

export default function ReportWorkSheet({
  reportId,
  currentReport,
  setView,
  setItemType,
  setCurrentReport,
  setReportId,
  progress,
  setOpExpenseData,
  setResultData,
  projectData,
  setProjectData
}) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { teamId } = useParams();
  const dispatch = useDispatch();

  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const [isDisabled, setIsDisabled] = useState(true);
  const [pathState, setPathState] = useState([])
  const [pageTitle, setPageTitle] = useState("")
  const [loading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [problemPrompt, setProblemPrompt] = useState(false);
  const [problemText, setProblemText] = useState("");
  const [pageDesc, setPageDesc] = useState("");
  const [suggestionType, setSuggestionType] = useState("inputSheet")
  const [area, setArea] = useState(0)
  const [tLink, setTLink] = useState("")


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
    getReport(reportId)
      .then((data) => {
        setCurrentReport(data);
        console.log(data);

        if ((data?.reportType === "Rental" || data?.reportType === "BRRRR") && data?.Appreciation && data?.IncomeIncrease && data?.SellingCosts && data?.ExpenseIncrease && data?.purchasePrice && data?.ARV && data?.propertyInsurance && data?.propertyTax && data?.GrossRent) {
          setIsDisabled(false)
        } else if (data?.reportType === "Flip" && data?.purchasePrice && data?.ARV && data?.propertyInsurance && data?.propertyTax) {
          setIsDisabled(false)
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }, [reportId]);

  const viewReport = async () => {
    if (parseFloat(currentReport?.ARV) > parseFloat(currentReport?.purchasePrice)) {
      if (projectData?.area) {
        setCurrentReport(currentReport);
        setReportId(currentReport._id);
        setView("analysisReport");
      } else {
        setOpenDialog(true)
      }
    } else {
      setProblemText("After repair value can't be less than purchase price");
      setProblemPrompt(true)
    }
  }
  const closePrompt = () => {
    setProblemPrompt(false)
  }

  const closeDialog = async () => {
    setOpenDialog(false);
  }

  const handleParent = (newParent) => {
    const objPath = teamId + ".parent";
    const newTeamDictionary = _.set(teamDictionary, objPath, newParent);
    console.log(newTeamDictionary);
    dispatch({
      type: "AddTeam",
      payload: {
        teamDictionary: newTeamDictionary,
      },
    });
  }

  const updateProjecct = async () => {
    if (area > 10) {
      const descObject = {
        area
      };
      const newObj = await updateData(projectData, descObject);
      const newParent = { ...parent, ...newObj };
      console.log(newParent);
      handleParent(newParent);
      setProjectData(newObj);
      setView("analysisReport");
    }
  }

  useEffect(() => {
    let updatedPath = [
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
    ]

    if (suggestionType === "inputSheet") {
      setPageTitle("Worksheet")
      updatedPath.push({
        text: "Worksheet"
      })
    } else if (suggestionType === "rentSuggestion") {
      setPageTitle("Rental Comps & Rent Estimates")
      updatedPath.push({
        text: "Worksheet",
        onClick: () => {
          setSuggestionType("inputSheet");
        }
      })
      updatedPath.push({
        text: "Rent Comp"
      })
    } else if (suggestionType === "saleSuggestion") {
      setPageTitle("Sales Comps & ARV Estimates")
      updatedPath.push({
        text: "Worksheet",
        onClick: () => {
          setSuggestionType("inputSheet");
        }
      })
      updatedPath.push({
        text: "Sales Comp"
      })
    }

    setPathState(updatedPath)

  }, [suggestionType])



  let WorkSheetCom = null

  switch (currentReport?.reportType) {
    case "Rental":
      WorkSheetCom = <RentalWorksheet
        reportId={reportId}
        currentReport={currentReport}
        setView={setView}
        setItemType={setItemType}
        isDisabled={isDisabled}
        setCurrentReport={setCurrentReport}
        setIsDisabled={setIsDisabled}
        setSuggestionType={setSuggestionType}
        suggestionType={suggestionType}
        projectData={projectData}
        viewReport={viewReport}
        setProjectData={setProjectData}
      />
      break;
    case "BRRRR":
      WorkSheetCom = <BRRRRWorksheet
        reportId={reportId}
        currentReport={currentReport}
        setView={setView}
        isDisabled={isDisabled}
        setItemType={setItemType}
        setCurrentReport={setCurrentReport}
        setIsDisabled={setIsDisabled}
        viewReport={viewReport}
        setSuggestionType={setSuggestionType}
        suggestionType={suggestionType}
        projectData={projectData}
        setProjectData={setProjectData}
      />
      break;
    case "Flip":
      WorkSheetCom = <FlipWorksheet
        reportId={reportId}
        currentReport={currentReport}
        setView={setView}
        isDisabled={isDisabled}
        viewReport={viewReport}
        setItemType={setItemType}
        setCurrentReport={setCurrentReport}
        setIsDisabled={setIsDisabled}
        setSuggestionType={setSuggestionType}
        suggestionType={suggestionType}
        projectData={projectData}
        setProjectData={setProjectData}
      />
      break;
  }

  useEffect(() => {
    if (suggestionType === "inputSheet") {
      if (currentReport?.reportType === "Rental") {
        setPageDesc("Use this worksheet to customize the purchase, financing, closing costs, rent and expenses, appreciation for this rental. ")
      } else if (currentReport?.reportType === "BRRRR") {
        setPageDesc("Use this worksheet to customize the purchase, financing, rehab budget, refinancing, rent and expenses, appreciation for this BRRRR. ")
      } else if (currentReport?.reportType === "Flip") {
        setPageDesc("Use this worksheet to customize the purchase, financing, closing costs and rehab budget for this flip. ")
      }
    } else if (suggestionType === "rentSuggestion") {
      setPageDesc("This page shows recent comparable rental listings to help you estimate the rent of this property. ")
    } else if (suggestionType === "saleSuggestion") {
      setPageDesc("This page shows recent comparable sales to help you estimate the ARV of this property.")
    }
  }, [currentReport, suggestionType])

  const openProjection = () => {
    if (parseFloat(currentReport?.ARV) > parseFloat(currentReport?.purchasePrice)) {
      if (projectData?.area) {
        reportDataCalculation(currentReport, projectData)
          .then((calculatedData) => {
            setResultData(calculatedData)

            let opExpense_data = []
            if (currentReport?.propertyTax) {
              let tax = (Number(currentReport?.propertyTax) * Number(currentReport?.ARV)) / 1200;
              tax = tax.toFixed(2);
              opExpense_data.push({
                name: "Property Tax",
                value: tax,
              });
            }
            if (currentReport?.propertyInsurance) {
              let insurance = Number(currentReport?.propertyInsurance) / 12;
              insurance = insurance.toFixed(2);
              opExpense_data.push({
                name: "Property Insurance",
                value: insurance,
              });
            }
            if (currentReport?.operatingExpenseItemized?.length != 0) {
              currentReport.operatingExpenseItemized.forEach((item) => {
                opExpense_data.push({
                  name: item.Name,
                  value: Number(item.Amount),
                });
              });
            }
            setCurrentReport(currentReport);
            setReportId(currentReport._id);
            setOpExpenseData(opExpense_data)
            setView("projection");
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        setOpenDialog(true)
      }
    } else {
      setProblemText("After repair value can't be less than purchase price");
      setProblemPrompt(true)
    }
  }


  const View = () => {
    return (
      <div className={classes.mainCont} >
        <AnalysisHeader
          pageTitle={pageTitle}
          pathArr={pathState}
          imgSrc={projectData?.displayPicture?.url}
          propName={projectData?.displayName}
          isImgProps={false}
          propDetails={<>{projectData?.subCategory || "Nan"} \ {projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} BA \ {projectData?.roomNumbers || "Nan"} BR \ {`${projectData?.area || "Nan"} sqft`}</>}
          pageDesc={<>{pageDesc}{` `}<a style={{ textDecoration: 'none', color: "#2196F3" }} href={tLink} target="_blank" >View tutorial</a></>}
          rightBtns={<>
            {suggestionType === "rentSuggestion" || suggestionType === "saleSuggestion" ? null :
              (<>
                <CustomBtn
                  startPart={isSmall ? null : <PieChartRoundedIcon style={{ fontSize: "19px" }} />}
                  text={isSmall ? <PieChartRoundedIcon style={{ fontSize: "19px" }} /> : "Report"}
                  disabled={isDisabled}
                  onClick={() => { viewReport() }}
                  style={isSmall ? { marginRight: "10px", padding: "7px 7px 2px" } : { marginRight: "15px" }}
                />
                <CustomBtn
                  startPart={isSmall ? null : <EqualizerIcon style={{ fontSize: "19px" }} />}
                  text={isSmall ? <EqualizerIcon style={{ fontSize: "19px" }} /> : "Projections"}
                  disabled={isDisabled}
                  style={isSmall ? { padding: "7px 7px 2px" } : {}}
                  onClick={() => { openProjection() }}
                />
              </>)}
          </>}
        />
        {WorkSheetCom}
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div className={classes.fullWidthDisplay} >
          <CircularProgress />
        </div>
      ) : (
        <>{View()}</>
      )}
      <Dialog
        open={problemPrompt}
        onClose={closePrompt}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Typography
            style={{ fontSize: "13px", marginBottom: "5px", color: "red" }}
          >{problemText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePrompt} color="primary">
            ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Typography
            style={{ fontSize: "13px", marginBottom: "22px", color: "red" }}
          >To view the report you have to enter area size (sqft)</Typography>
          <TextField
            id="outlined-basic"
            size="small"
            type="number"
            label="Area"
            variant="outlined"
            style={{ width: "100%" }}
            value={area}
            onChange={(e) => { setArea(e.target.value); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          {area > 10 ? (
            <Button onClick={updateProjecct} color="primary">
              Save
            </Button>
          ) : (
            <Button onClick={updateProjecct} color="primary" disabled >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
