import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import PropertyInfo from "./PropertyInfo";
import { Button, Grow, Paper, Typography, useMediaQuery } from "@material-ui/core";
import ConfirmationDialog from "../styled/ConfirmationDialog";
import ReportEditDialog from "./ReportEditDialog";
import { fetchReports, getAllAdminProfileCriteria, updateProjectData } from "./api.call";
import AddIcon from '@material-ui/icons/Add';
import SingleReportRow from "./SingleReportRow";
import emptyFolder from "../../Assets/FileIcon/emptyfolder.png"
import YoutubeTuts from "../youtubeTuts";
import EditBtn from "../styled/actionBtns/edit.btn";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from "@material-ui/core";
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import LessText from "../styled/CommonComponents/LessText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ClearIcon from '@material-ui/icons/Clear';
import { useSelector, useDispatch } from "react-redux";
import CustomBtn from "../styled/CommonComponents/CustomBtn";
import AnalysisHeader from "../styled/CommonComponents/AnalysisHead.js";
import criteriaSwitch from "../../Assets/criteriaSwitch.svg"
import NormalDialog from "../styled/CommonComponents/NormalDialog";


const useStyles = makeStyles((theme) => ({
  mainCont: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "white",
    padding: `0px ${theme.sideMargin.fullScreen}`,
    [theme.breakpoints.down('md')]: {
      padding: `0px ${theme.sideMargin.mdScreen}`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: `0px ${theme.sideMargin.smScreen}`,
    },
    [theme.breakpoints.down('xs')]: {
      padding: "0px 5px",
      padding: `0px ${theme.sideMargin.sxScreen}`,
    },
  },
  left__section: {
    width: '100%',
    display: "flex",
    justifyContent: "center",
  },
  right_section: {
    width: '100%',
  },
  reports: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 450px)",
    alignItems: 'center',
    width: '100%',
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxHeight: "100vh",
      height: "calc(100vh - 70px)",
    },
    [theme.breakpoints.down('xs')]: {
      maxHeight: "100vh",
      height: "calc(100vh - 120px)",
    }
  },
  rightParentContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: "15px 0px 0px 0px",
    borderTop: "1px solid #D1CCCC",
    margin: "20px 0px 15px",
    "& p": {
      fontSize: "23px",
      fontWeight: "510",
    },
    [theme.breakpoints.down('xs')]: {
      "& p": {
        fontSize: "15px",
        fontWeight: "510"
      },
    }
  },
  imgCont: {
    width: "170px",
    marginTop: "30px",
    [theme.breakpoints.down('sm')]: {
      marginTop: "40px",
      width: "150px",
    }
  },
  emptyText: {
    fontSize: "17px",
    opacity: "0.8",
    textAlign: "center",
    marginLeft: "-10px"
  },
  dialogTitleStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 15px",
    backgroundColor: theme.palette.primary.main
  },
  dividers: {
    width: "500px",
    height: "450px",
    overflowY: "auto",
    padding: "16px 8px",
    [theme.breakpoints.down("xs")]: {
      padding: "10px",
      width: "300px",
    }
  },
  allCriteriaCont: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: "500px",
    [theme.breakpoints.down("xs")]: {
      minWidth: "0px",
      height: "300px",
      overflowY: "auto"
    }
  },
  criteCont: {
    border: "1px solid gray",
    borderRadius: "20px",
    padding: "4px 15px",
    margin: "5px",
    cursor: "pointer",
    "& h2": {
      fontSize: "13px",
      fontWeight: "500"
    },
    "& p": {
      fontSize: "10px"
    }
  },
  rightButtons: {
    display: "flex",
    alignItems: "center",
  },
  policyLineCont: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start"
    }
  },
  differentCriteriaCont: {
    width: "calc(100% - 220px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    "& h3": {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      "&:hover": {
        color: theme.palette.primary.main
      }
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: "5px 0px 20px"
    }
  },
  unDifferentCriteriaCont: {
    width: "calc(100% - 220px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    "& h3": {
      opacity: "0.5",
      display: "flex",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: "5px 0px 20px"
    }
  },
  iconBtn: {
    cursor: "pointer",
    width: "50px",
    [theme.breakpoints.down("sm")]: {
      width: "35px",
    }
  }
}));

export default function DefaultView({
  reports, setReports, setOpenDialog, setReportType, reportId, setResultData,
  setReportId, setView, projectData, setProjectData, setCurrentReport,
  setReportName, setLoadingBool, setOpExpenseData, setCriteriaType
}) {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { teamId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [findProperty, setFindProperty] = useState(false);
  const [checked, setChecked] = useState(false);
  const [reportTitle, setReportTitle] = useState(null);
  const [criteriaDialog, setCriteriaDialog] = useState(false);
  const [allCriterias, setAllCriterias] = useState([])
  const [selectedCriteria, setSelectedCriteria] = useState({})
  const [pageDesc, setPageDesc] = useState("")

  let isMobile = useMediaQuery(theme.breakpoints.down('xs'));


  useEffect(() => {
    getReports()
  }, [teamId]);


  const getReports = async () => {
    setLoadingBool(true)
    await fetchReports(teamId)
      .then((data) => {
        setReports(data);
        setLoadingBool(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleCloseCriteria = () => {
    setCriteriaDialog(false)
  }

  useEffect(() => {
    const policy = projectData?.purchasePolicy
    setSelectedCriteria(policy)
  }, [projectData])

  console.log(projectData)
  console.log(selectedCriteria)

  useEffect(() => {
    getAllAdminProfileCriteria({ profileId: user.profile })
      .then((data) => {
        console.log(data)
        setAllCriterias(data)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [user.profile])

  const updateCriteria = async (policyId) => {
    setLoadingBool(true)
    await updateProjectData({
      _id: projectData?._id,
      purchasePolicy: policyId
    })
      .then((data) => {
        setProjectData(data)
        setSelectedCriteria(data?.purchasePolicy)
      })
      .catch((err) => {
        console.log(err);
      })
    setLoadingBool(false)
  }

  const pathArr = [
    {
      text: "Project",
      onClick: () => {
        history.push(`/projects/${teamId}`)
      }
    },
    {
      text: "Analysis",
    }
  ]




  useEffect(() => {
    if ((projectData?.isImported) || (projectData?.area && projectData?.address?.streetAddress && projectData?.address?.zip && projectData?.address?.city && projectData?.address?.region)) {
      setPageDesc("This page shows a brief description of the property and all the reports created for its investment analysis. Use this page to create new reports and compare existing reports.")
    } else {
      setPageDesc("Use this page to import property data or add description manually, and create new reports.")
    }
  }, [projectData])





  return (
    <div className={classes.mainCont} >
      <AnalysisHeader
        pageTitle={"Investment Analysis"}
        pathArr={pathArr}
        imgSrc={projectData?.displayPicture?.url}
        propName={projectData?.displayName}
        isImgProps={false}
        propDetails={<>{projectData?.subCategory || "Nan"} \ {projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} BA \ {projectData?.roomNumbers || "Nan"} BR \ {`${projectData?.area || "Nan"} sqft`}</>}
        pageDesc={pageDesc}
        rightBtns={<>
          <CustomBtn
            text={isMobile ? <CompareArrowsIcon style={{ fontSize: "20px" }} /> : "Compare"}
            style={isMobile ? { marginRight: "10px", padding: "8px 3px 1px" } : { marginRight: "10px" }}
            startPart={isMobile ? null : <CompareArrowsIcon style={{ fontSize: "20px" }} />}
            onClick={() => {
              history.push("/investment/analysis/compare");
            }}
          />
          <CustomBtn
            text={<YoutubeTuts name={"Analysis"} />}
            style={{ padding: "6px 3px" }}
          />
        </>}
      />
      <div className={classes.left__section}>
        <PropertyInfo
          projectData={projectData}
          setProjectData={setProjectData}
          setView={setView}
          setLoadingBool={setLoadingBool}
          findProperty={findProperty}
          setFindProperty={setFindProperty}
        />
      </div>
      <div className={classes.right_section}>
        <NormalDialog
          openDialog={criteriaDialog}
          handleCloseShare={handleCloseCriteria}
          pageTitle={"Switch Criteria"}
          content={<>
            <div className={classes.allCriteriaCont} >
              {allCriterias.length > 0 ? (
                allCriterias.map((criteria) => (
                  <div className={classes.policyLineCont} >
                    <div className={classes.criteCont}
                      style={criteria?._id === selectedCriteria?._id ?
                        {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          border: "none",
                          cursor: "context-menu"
                        } : {}}
                      onClick={() => {
                        if (criteria?._id !== selectedCriteria?._id) {
                          updateCriteria(criteria?._id)
                        }
                      }}
                    >
                      <h2>
                        <LessText
                          limit={25}
                          string={criteria?.title}
                        />
                      </h2>
                      <p>By{` `}
                        <LessText
                          limit={25}
                          string={criteria?.profile?.parent?.displayName}
                        />
                      </p>
                    </div>
                    <div className={criteria?._id === selectedCriteria?._id ? classes.differentCriteriaCont : classes.unDifferentCriteriaCont} >
                      <h3
                        onClick={() => {
                          if (criteria?._id === selectedCriteria?._id) {
                            setView("Criteria"); setCriteriaType("Rental")
                          }
                        }}
                      >Rental <EditIcon style={{ fontSize: "17px", marginLeft: "5px" }} /></h3>
                      <h3
                        onClick={() => {
                          if (criteria?._id === selectedCriteria?._id) {
                            setView("Criteria"); setCriteriaType("BRRRR")
                          }
                        }}
                      >BRRRR <EditIcon style={{ fontSize: "17px", marginLeft: "5px" }} /></h3>
                      <h3
                        onClick={() => {
                          if (criteria?._id === selectedCriteria?._id) {
                            setView("Criteria"); setCriteriaType("Flip")
                          }
                        }}
                      >Flip <EditIcon style={{ fontSize: "17px", marginLeft: "5px" }} /></h3>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </>}
        />
        <div className={classes.rightParentContainer}>
          <p>Analysis Reports</p>
          <div className={classes.rightButtons} >
            <CustomBtn
              text={isMobile ? "Criteria" : "Purchase Criteria"}
              onClick={() => { setCriteriaDialog(true) }}
              style={isMobile ? { marginRight: "5px" } : { marginRight: "10px" }}
              startPart={<img src={criteriaSwitch} style={{ width: "10px" }} />}
            />
            <CustomBtn
              text={"Report"}
              startPart={<AddIcon style={{ fontSize: "20px" }} />}
              onClick={() => {
                setReportType("Rental");
                setOpenDialog(true);
              }}
            />
          </div>
        </div>
        <div className={classes.reports}>
          {reports?.length > 0 ? reports?.map((report) => {
            return (
              <>
                <SingleReportRow
                  report={report}
                  projectData={projectData}
                  setReportId={setReportId}
                  setCurrentReport={setCurrentReport}
                  setReportType={setReportType}
                  setReportName={setReportName}
                  setView={setView}
                  setOpExpenseData={setOpExpenseData}
                  setResultData={setResultData}
                  deleteFun={() => {
                    setOpenConfirmationDialog(true);
                    setReportId(report?._id);
                  }}
                />
              </>
            );
          })
            :
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} >
              <img className={classes.imgCont} src={emptyFolder} alt={"empty"} />
              <Typography className={classes.emptyText} >
                You don't have any analysis reports.
                <span
                  onClick={() => {
                    setReportType("Rental");
                    setOpenDialog(true);
                  }}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Click here
                </span>  to create one.
              </Typography>
            </div>
          }
        </div>
      </div>
      <Grow in={checked}>
        <ConfirmationDialog
          open={openConfirmationDialog}
          setOpen={setOpenConfirmationDialog}
          reportId={reportId}
          teamId={teamId}
          setReports={setReports}
          message={"Do you really want to delete these records ? This process cannot be undone."}
          btnText={"Delete"}
        />
      </Grow>
      <Grow in={checked}>
        <ReportEditDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          reportId={reportId}
          reportTitle={reportTitle}
          teamId={teamId}
          setReports={setReports}
          setReportTitle={setReportTitle}
        />
      </Grow>
    </div>
  );
}