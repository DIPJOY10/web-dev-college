import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RentalProjection from "./Projections/RentalProjection";
import BRRRRProjection from "./Projections/BRRRRProjection";
import FlipProjection from "./Projections/FlipProjection";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getReport } from "./api.call";


const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "hidden",
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
}));

export default function ProjectionAnalysis({
  reportId,
  currentReport,
  setCurrentReport,
  resultData,
  expenseData,
  setView,
  projectData
}) {
  const classes = useStyles();
  const { root, progress } = classes;
  const [loading, setIsLoading] = useState(false);
  const [yearsArr, setYearsArr] = useState([]);


  useEffect(() => {
    findReport();
  }, []);

  const findReport = async () => {
    await getReport(reportId)
      .then((data) => {
        setCurrentReport(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }

  let projectionView = null

  switch (currentReport.reportType) {
    case "Rental":
      projectionView = <RentalProjection
        currentReport={currentReport}
        resultData={resultData}
        expenseData={expenseData}
        setView={setView}
        yearsArr={yearsArr}
        isViewOnly={false}
        setYearsArr={setYearsArr}
        projectData={projectData}
      />
      break;
    case "BRRRR":
      projectionView = <BRRRRProjection
        currentReport={currentReport}
        resultData={resultData}
        expenseData={expenseData}
        setView={setView}
        isViewOnly={false}
        yearsArr={yearsArr}
        setYearsArr={setYearsArr}
        projectData={projectData}
      />
      break;
    case "Flip":
      projectionView =
        <FlipProjection
          currentReport={currentReport}
          resultData={resultData}
          setView={setView}
          isViewOnly={false}
          yearsArr={yearsArr}
          setYearsArr={setYearsArr}
          projectData={projectData}
        />
      break;
  }

  return (
    <>
      {loading ? (
        <div className={progress}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ backgroundColor: "white" }} >
          {projectionView}
        </div>
      )}
    </>
  );
}
