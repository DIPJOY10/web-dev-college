import React, { useState, useEffect } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { createAnalysisReport } from "./api.call";
import {
  rentalValues, brrrrValues, flipValues,
  getPropertyTaxByState, getPropertyInsuranceByState
} from "./default.value.js"
import NormalDialog from "../styled/CommonComponents/NormalDialog";

const useStyles = makeStyles((theme) => ({
  btnCont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  labelStyle: {
    fontSize: "17px",
    fontWeight: "510",
    margin: "10px 5px"
  },
  dialogCont: {
    width: "450px",
    [theme.breakpoints.down('xs')]: {
      width: "250px",
    }
  },
  input: {
    backgroundColor: "#FCFCFC"
  },
}));

const ReportCreationDialog = ({
  open, setOpen, reportType,
  setReportType, reports,
  setReports, projectData
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { teamId } = useParams();
  const [reportTitle, setReportTitle] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const createReport = async () => {
    let defaultObj;
    if (reportType === "Rental") {
      defaultObj = rentalValues
    } else if (reportType === "BRRRR") {
      defaultObj = brrrrValues
    } else if (reportType === "Flip") {
      defaultObj = flipValues
    }
    const report = await createAnalysisReport(
      {
        reportTitle,
        reportType,
        propertyTax: getPropertyTaxByState(projectData?.address?.region),
        propertyInsurance: getPropertyInsuranceByState(projectData?.address?.city, projectData?.address?.region),
        ...defaultObj
      },
      teamId
    );
    if (report) {
      setReports([...reports, report]);
    }
    setReportTitle("");
    handleClose();
    dispatch({
      type: "AddApiAlert",
      payload: {
        success: true,
        message: "Report created successfully",
      },
    });
  }

  return (
    <NormalDialog
      openDialog={open}
      handleCloseShare={handleClose}
      pageTitle={"New Report"}
      content={<div className={classes.dialogCont} >
        <p className={classes.labelStyle} >Report Title</p>
        <TextField
          fullWidth
          autoComplete="off"
          InputProps={{ className: classes.input }}
          value={reportTitle}
          id="outlined-basic"
          placeholder="Enter Report Title"
          variant="outlined"
          size="small"
          onChange={(e) => setReportTitle(e.target.value)}
        />
        <p className={classes.labelStyle} >Investment Type</p>
        <FormControl variant="outlined" size="small" fullWidth>
          <Select
            labelId="propertyType-label"
            id="pTypeId"
            style={{ backgroundColor: "#FCFCFC" }}
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
            }}
          >
            <MenuItem value="Rental">Rental</MenuItem>
            <MenuItem value="BRRRR">BRRRR</MenuItem>
            <MenuItem value="Flip">Flip</MenuItem>
          </Select>
        </FormControl>
        <div className={classes.btnCont} >
          <div></div>
          <Button
            onClick={() => { createReport() }}
            color="primary"
            variant="contained"
          >
            CREATE
          </Button>
        </div>
      </div>}
    />);
};

export default ReportCreationDialog;
