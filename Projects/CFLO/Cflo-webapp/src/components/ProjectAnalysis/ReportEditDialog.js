import React, { useState, useEffect } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { updateAnalysisReport, getReport } from "./api.call";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const useStyles = makeStyles((theme) => ({
    dialog__content: {
        "& .MuiFormControl-root": {
            width: "90%",
            margin: theme.spacing(1),
        },
        display: "flex",
        flexDirection: "column",
        "& $p": {
            // borderBottom: "1px solid grey",
            fontSize: "1rem",
            // padding: "1rem",
            fontWeight: "400",
            marginTop: "0.5rem",
        },
    },
}));

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const ReportEditDialog = ({
    open,
    setOpen,
    reportType,
    setReportType,
    reportId,
    reports,
    reportTitle,
    setReportTitle,
    setReports,
}) => {
    const classes = useStyles();
    const { dialog__content } = classes;

    const dispatch = useDispatch();
    const { teamId } = useParams();
    // let report = {};
    // const [reportDetails, setReportDetails] = useState([]);
    // const getReportDetails = async (reportId) => {
    //     await getReport(reportId).then((res) => {
    //         // setReportDetails(res);
    //         console.log(reportId, "rep")
    //     })
    // }
    // useEffect(() => {
    //     getReportDetails(reportId);
    // }, [reportId, reportDetails])
    // const [reportTitle, setReportTitle] = useState(reportDetails?.reportTitle || "");

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            scroll={"paper"}
            fullWidth
        >
            <DialogTitle id="form-dialog-title" onClose={handleClose}>
                Edit Report
            </DialogTitle>
            <DialogContent dividers className={dialog__content}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    value={reportTitle}
                    id="outlined-basic"
                    label="Report Title"
                    variant="outlined"
                    onChange={(e) => setReportTitle(e.target.value)}
                />
                {/* <FormControl variant="outlined" fullWidth>
          <InputLabel id="demo-simple-select-outlined-label">
            Project Type
          </InputLabel>
          <Select
            labelId="propertyType-label"
            id="pTypeId"
            label="Project Type"
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
            }}
          >
            <MenuItem value="Rental">Rental</MenuItem>
            <MenuItem value="BRRRR">BRRRR</MenuItem>
            <MenuItem value="Flip">Flip</MenuItem>
          </Select>
        </FormControl> */}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={async () => {
                        console.log(reportTitle, 'rep')
                        const report = await updateAnalysisReport({
                            reportData: { reportTitle: reportTitle },
                            reportId,
                            teamId,
                        });
                        console.log(report, 'report')
                        // if (report) {
                        //     setReports([...reports, report]);
                        // }
                        setReportTitle(reportTitle);
                        handleClose();
                        window.location.reload();
                        // dispatch({
                        //   type: "AddApiAlert",
                        //   payload: {
                        //     success: true,
                        //     message: "Report created successfully",
                        //   },
                        // });
                    }}
                    color="primary"
                    variant="outlined"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportEditDialog;
