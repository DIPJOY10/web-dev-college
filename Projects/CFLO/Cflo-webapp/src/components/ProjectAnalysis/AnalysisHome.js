import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReportWorkSheet from "./ReportWorkSheet";
import Item from "./Item";
import CircularProgress from '@material-ui/core/CircularProgress';
import ReportCard from "./ReportCard";
import ProjectionAnalysis from "./ProjectionAnalysis";
import { fetchReports, deleteReport, findProject, getReport, addDefaultPolicy, getProjectByTeamId } from "./api.call";
import ReportCreationDialog from "./ReportCreationDialog";
import PropertyDescription from "./Property.Description";
import DefaultView from "./DefaultView";
import EditCriteriaDefault from "./Edit.criteria.default";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  loaderCont: {
    position: 'fixed',
    top: "0px",
    right: "0px",
    width: "100vw",
    height: "100vh",
    zIndex: "1000",
    paddingLeft: "100px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('xs')]: {
      paddingLeft: "0px",
    },
  },
}));

export default function AnalysisHome(props) {
  const history = useHistory();
  const classes = useStyles();
  const { root } = classes;
  const { teamId } = useParams();
  const state = useSelector((state) => state);
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;

  const [loadingBool, setLoadingBool] = useState(false);
  const [loadingText, setLoadingText] = useState(null)
  const [reports, setReports] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportType, setReportType] = useState("Rental");
  const [reportId, setReportId] = useState(null);
  const [view, setView] = useState("default");
  const [itemendAdorn, setItemendAdorn] = useState("")
  const [period, setPeriod] = useState(0)
  const [additionalItems, setAdditionalItems] = useState([])
  const [additionalItemsCostOR, setAdditionalItemsCostOR] = useState([])
  const [isAdditionalItems, setIsAdditionalItems] = useState(null)
  const [itemType, setItemType] = useState("");
  const [projectData, setProjectData] = useState(parent || {});
  const [currentReport, setCurrentReport] = useState({});
  const [resultData, setResultData] = useState(null);
  const [opExpenseData, setOpExpenseData] = useState({});
  const [reportName, setReportName] = useState("");
  const [criteriaType, setCriteriaType] = useState("");

  console.log(projectData)

  useEffect(() => {
    getProjectByTeamId({
      teamId
    })
      .then((newData) => {
        setProjectData(newData)
        if (newData && newData?._id && newData?.ownerProfile?._id && !newData?.purchasePolicy) {
          addDefaultPolicy({
            profileId: newData?.ownerProfile?._id,
            projectId: newData?._id,
            userOrOrgName: newData?.ownerProfile?.parent?.displayName
          })
            .then((data) => {
              setProjectData(data)
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])


  return (
    <div className={root}>
      {(() => {
        switch (view) {
          case "info":
            return (
              <PropertyDescription
                projectData={projectData}
                setProjectData={setProjectData}
                setView={setView}
                isAppBar={true}
              />
            );
          case "itemized":
            return (
              <Item
                teamId={teamId}
                reportId={reportId}
                projectData={projectData}
                setView={setView}
                ItemType={itemType}
                setItemType={setItemType}
                currentReport={currentReport}
                setCurrentReport={setCurrentReport}
                itemendAdorn={itemendAdorn}
                period={period}
                additionalItems={additionalItems}
                isAdditionalItems={isAdditionalItems}
                additionalItemsCostOR={additionalItemsCostOR}
              />
            );
          case "analysisReport":
            return (
              <div>
                <ReportCard
                  reportId={reportId}
                  currentReport={currentReport}
                  setCurrentReport={setCurrentReport}
                  ItemType={itemType}
                  setItemendAdorn={setItemendAdorn}
                  setItemType={setItemType}
                  setAdditionalItems={setAdditionalItems}
                  setIsAdditionalItems={setIsAdditionalItems}
                  setAdditionalItemsCostOR={setAdditionalItemsCostOR}
                  projectData={projectData}
                  setProjectData={setProjectData}
                  setPeriod={setPeriod}
                  setView={setView}
                  resultData={resultData}
                  setResultData={setResultData}
                  setOpExpenseData={setOpExpenseData}
                  setLoadingBool={setLoadingBool}
                  setLoadingText={setLoadingText}
                />
              </div>
            );
          case "projection":
            return (
              <ProjectionAnalysis
                reportId={reportId}
                currentReport={currentReport}
                setCurrentReport={setCurrentReport}
                resultData={resultData}
                expenseData={opExpenseData}
                setView={setView}
                projectData={projectData}
              />
            );
          case "worksheet":
            return (
              <ReportWorkSheet
                reportId={reportId}
                currentReport={currentReport}
                setCurrentReport={setCurrentReport}
                setView={setView}
                setOpExpenseData={setOpExpenseData}
                setResultData={setResultData}
                setItemType={setItemType}
                setReportId={setReportId}
                projectData={projectData}
                setProjectData={setProjectData}
              />
            );
          case "Criteria":
            return (
              <EditCriteriaDefault
                criteriaType={criteriaType}
                setView={setView}
                projectData={projectData}
                setProjectData={setProjectData}
                setReportId={setReportId}
                setLoadingBool={setLoadingBool}
              />
            );
          default:
            return (
              <DefaultView
                reports={reports}
                setReports={setReports}
                setOpenDialog={setOpenDialog}
                setReportType={setReportType}
                reportId={reportId}
                setReportId={setReportId}
                setView={setView}
                projectData={projectData}
                setProjectData={setProjectData}
                setCurrentReport={setCurrentReport}
                setReportName={setReportName}
                setLoadingBool={setLoadingBool}
                setOpExpenseData={setOpExpenseData}
                setResultData={setResultData}
                setCriteriaType={setCriteriaType}
              />
            );
        }
      })()}
      <ReportCreationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        reportType={reportType}
        setReportType={setReportType}
        setReports={setReports}
        reports={reports}
        projectData={projectData}
      />

      {loadingBool &&
        <div className={classes.loaderCont} >
          {loadingText ? (
            <p style={{ color: "white", fontSize: "18px" }} >{loadingText}...</p>
          ) : (
            <CircularProgress
              size={60}
              thickness={3}
              style={{ color: 'rgb(92, 144, 242)' }}
            />
          )}
        </div>
      }
    </div>
  );
}
