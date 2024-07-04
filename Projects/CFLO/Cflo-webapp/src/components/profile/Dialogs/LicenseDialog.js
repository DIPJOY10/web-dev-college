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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { updateUserInfoArray, editUserArray, deleteArrayItem } from "../api";
import UploadZone from "../../file/Uploader/UploadZone";
import FileUploadingView from "../../file/Viewer/FileUploadingView";
import FilesViewer from "../../file/Viewer/FilesViewer";

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
  date__section: {
    display: "flex",
  },
  date__select: {
    flex: "0.5",
    marginRight: "0.5rem",
  },
  dialog__content: {
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

const LicenseDialog = ({ open, setOpen, enableEdit, currentLicenseObj }) => {
  const classes = useStyles();
  const { date__section, date__select, dialog__content } = classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);

  const [title, setTitle] = useState(currentLicenseObj?.title || "");
  const [association, setAssociation] = useState(
    currentLicenseObj?.association || ""
  );
  const [credentialId, setCredentialId] = useState(
    currentLicenseObj?.credentialId || ""
  );
  const [licenseUrl, setLicenseUrl] = useState(
    currentLicenseObj?.license_url || ""
  );
  const [monthState, setMonthState] = useState({
    start_month: "",
    end_month: "",
    name: "",
  });
  const [yearState, setYearState] = useState({
    start_year: "",
    end_year: "",
    name: "",
  });
  const [honorTitle, setHonorTitle] = useState(currentLicenseObj?.honorTitle || "");
  const [associatedHonor, setAssociatedHonor] = useState(
    currentLicenseObj?.associatedHonor || ""
  );
  const [issuerHonor, setIssuerHonor] = useState(currentLicenseObj?.issuerHonor || "");

  const [description, setDescription] = useState(
    currentLicenseObj?.description || ""
  );

  const [HonorAssociationArray, setHonorAssociationArray] = useState([]);

  const [monthStateHonor, setMonthStateHonor] = useState({
    start_month_honor: "",
    name: "",
  });
  const [yearStateHonor, setYearStateHonor] = useState({
    start_year_honor: "",
    name: "",
  });
  const handleMonthSelect = (event) => {
    const name = event.target.name;
    setMonthState({
      ...monthState,
      [name]: event.target.value,
    });
    console.log(name + " " + event.target.value);
  };
  const handleYearSelect = (event) => {
    const name = event.target.name;
    setYearState({
      ...yearState,
      [name]: event.target.value,
    });
    console.log(name + " " + event.target.value);
  };

  const calendarMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [calendarYear, setCalendarYear] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const saveData = async (LicenseObj) => {
    if (enableEdit) {
      const updatedUser = await editUserArray({
        arrayId: currentLicenseObj._id,
        arrayObj: LicenseObj,
        arrayName: "licenses",
      });
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            licenses: updatedUser?.licenses,
          },
        },
      });
    } else {
      const updatedUser = await updateUserInfoArray({
        userId: user?._id,
        userInfo: LicenseObj,
        arrayName: "licenses",
      });
      console.log(updatedUser);
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            licenses: updatedUser?.licenses,
          },
        },
      });
    }
  };

  const deleteData = async (LicenseObjId) => {
    const updatedUser = await deleteArrayItem({
      userId: user._id,
      arrayObjId: LicenseObjId,
      arrayName: "licenses",
    });
    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          licenses: updatedUser?.licenses,
        },
      },
    });
  };

  useEffect(() => {
    const years = [];
    const date = new Date();
    const endYear = date.getFullYear();
    for (let i = 1951; i <= endYear; i++) {
      years.push(i);
    }
    setCalendarYear(years);
    let associationArray = [];
    const eduArray = user?.education,
      expArray = user?.experience;
    eduArray.forEach((eduObj) => {
      associationArray.push(eduObj.school);
    });
    expArray.forEach((expObj) => {
      associationArray.push(expObj.companyName);
    });
    setHonorAssociationArray(associationArray);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      scroll={"paper"}
      fullWidth
    >
      <DialogTitle id="form-dialog-title" onClose={handleClose}>
        {enableEdit ? "Edit" : "Add"} License
      </DialogTitle>
      <DialogContent dividers className={dialog__content}>
        <DialogContentText>License</DialogContentText>
        <TextField
          required
          id="LicenseName"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Issuing organization</DialogContentText>
        <TextField
          required
          id="issuingOrg"
          value={association}
          onChange={(e) => {
            setAssociation(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Start date</DialogContentText>
        <div className={date__section}>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Month</InputLabel>
            <Select
              native
              value={state.start_month}
              onChange={handleMonthSelect}
              label="Month"
              inputProps={{
                name: "start_month",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarMonth.map((month, index) => {
                return (
                  <option key={index} value={month}>
                    {month}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Year</InputLabel>
            <Select
              native
              value={state.start_year}
              onChange={handleYearSelect}
              label="Year"
              inputProps={{
                name: "start_year",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarYear.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <DialogContentText>End date</DialogContentText>
        <div className={date__section}>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Month</InputLabel>
            <Select
              native
              value={state.end_month}
              onChange={handleMonthSelect}
              label="Month"
              inputProps={{
                name: "end_month",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarMonth.map((month, index) => {
                return (
                  <option key={index} value={month}>
                    {month}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Year</InputLabel>
            <Select
              native
              value={state.end_year}
              onChange={handleYearSelect}
              label="Year"
              inputProps={{
                name: "end_year",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarYear.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <DialogContentText>Credential ID</DialogContentText>
        <TextField
          id="credentialId"
          value={credentialId}
          onChange={(e) => {
            setCredentialId(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Credential URL</DialogContentText>
        <TextField
          id="credentialUrl"
          value={licenseUrl}
          onChange={(e) => {
            setLicenseUrl(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Title</DialogContentText>
        <TextField
          required
          id="titleName"
          value={honorTitle}
          onChange={(e) => {
            setHonorTitle(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Associated with</DialogContentText>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-age-native-simple">
            Please select
          </InputLabel>
          <Select
            native
            value={associatedHonor}
            onChange={(e) => {
              setAssociatedHonor(e.target.value);
            }}
            label="Please select"
          >
            <option aria-label="None" value="" />
            {HonorAssociationArray.map((association, index) => {
              return (
                <option key={index} value={association}>
                  {association}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <DialogContentText>Issuer</DialogContentText>
        <TextField
          id="issuer"
          value={issuerHonor}
          onChange={(e) => {
            setIssuerHonor(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Issue Date</DialogContentText>
        <div className={date__section}>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Month</InputLabel>
            <Select
              native
              value={state.start_month_honor}
              onChange={handleMonthSelect}
              label="Month"
              inputProps={{
                name: "start_month_honor",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarMonth.map((month, index) => {
                return (
                  <option key={index} value={month}>
                    {month}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Year</InputLabel>
            <Select
              native
              value={state.start_year_honor}
              onChange={handleYearSelect}
              label="Year"
              inputProps={{
                name: "start_year_honor",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {calendarYear.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <DialogContentText>Description</DialogContentText>
        <TextField
          id="description"
          label="Write anything notable..."
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {enableEdit ? (
          <Button
            onClick={() => {
              deleteData(currentLicenseObj._id);
              handleClose();
            }}
            color="secondary"
            variant="outlined"
          >
            DELETE
          </Button>
        ) : null}
        <Button
          onClick={() => {
            saveData({
              title,
              association,
              start_date: `${monthState.start_month}-${yearState.start_year}`,
              end_date: `${monthState.end_month}-${yearState.end_year}`,
              credentialId,
              license_url: licenseUrl,
              title_honor:honorTitle,
              associated_honor:associatedHonor,
              start_date_honor:`${monthStateHonor.start_month_honor}-${yearStateHonor.start_year_honor}`,
              issuer:issuerHonor,
              description
            });
            handleClose();
          }}
          color="primary"
          variant="outlined"
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LicenseDialog;
