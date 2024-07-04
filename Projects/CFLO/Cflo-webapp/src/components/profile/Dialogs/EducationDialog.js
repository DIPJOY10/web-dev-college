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
// import { parseWithOptions } from "date-fns/fp";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { updateUserInfoArray, editUserArray, deleteArrayItem } from "../api";

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

const EducationDialog = ({ open, setOpen, enableEdit, currentEduObj,setIsEducation,setProgress }) => {
  const classes = useStyles();
  const { date__section, date__select, dialog__content } = classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);

  const [school, setSchool] = useState(currentEduObj?.school || "");
  const [degree, setDegree] = useState(currentEduObj?.degree || "");
  const [field, setField] = useState(currentEduObj?.field || "");
  const [grade, setGrade] = useState(currentEduObj?.grade || "");
  const [description, setDescription] = useState(
    currentEduObj?.description || ""
  );
  // const [start_month, start_year] =
  //   currentEduObj?.education?.start_date.split("-");
  // const [end_month, end_year] = currentEduObj?.education?.end_date.split("-");

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
  const saveData = async (userData) => {
    if (enableEdit) {
      const updatedUser = await editUserArray({
        arrayId: currentEduObj._id,
        arrayObj: userData,
        arrayName: "education",
      });
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            education: updatedUser?.education,
          },
        },
      });
    } else {
      const updatedUser = await updateUserInfoArray({
        userId: user?._id,
        userInfo: userData,
        arrayName: "education",
      });
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            education: updatedUser?.education,
          },
        },
      });
    }
    // const newUserState = { ...user };
    // delete newUserState.education;
    // console.log(newUserState);
    // dispatch({
    //   type: "AddAuth",
    //   payload: {
    //     user: {
    //       ...newUserState,
    //     },
    //   },
    // });
  };

  const deleteData = async (eduObjId) => {
    const updatedUser = await deleteArrayItem({
      userId: user._id,
      arrayObjId: eduObjId,
      arrayName: "education",
    });
    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          education: updatedUser?.education,
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
        {enableEdit ? "Edit" : "Add"} Education
      </DialogTitle>
      <DialogContent dividers className={dialog__content}>
        <DialogContentText>School</DialogContentText>
        <TextField
          required
          id="school"
          label="Ex: Stanford University"
          value={school}
          onChange={(e) => {
            setSchool(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Degree</DialogContentText>
        <TextField
          id="degree"
          label="Ex: Bachelor's"
          value={degree}
          onChange={(e) => {
            setDegree(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Field of Study</DialogContentText>
        <TextField
          id="field"
          label="Ex: Business"
          value={field}
          onChange={(e) => {
            setField(e.target.value);
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
        <DialogContentText>Grade</DialogContentText>
        <TextField
          id="grade"
          label="Ex: CGPA/Percentage"
          value={grade}
          onChange={(e) => {
            setGrade(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
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
              deleteData(currentEduObj._id);
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
              school,
              degree,
              field,
              start_date: `${monthState.start_month}-${yearState.start_year}`,
              end_date: `${monthState.end_month}-${yearState.end_year}`,
              grade,
              description,
            })
            setProgress((prev)=> prev+30);
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

export default EducationDialog;
