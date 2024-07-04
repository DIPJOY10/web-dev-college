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
import { updateUserInfoArray, deleteArrayItem, editUserArray } from "../api";

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

const ExperienceDialog = ({ open, setOpen, enableEdit, currentExpObj,setProgress }) => {
  const classes = useStyles();
  const { date__section, date__select, dialog__content } = classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);

  const [title, setTitle] = useState(currentExpObj?.title || "");
  const [orgTitle,setOrgTitle] = useState(currentExpObj?.title ||"");
  const [employmentType, setEmploymentType] = useState({
    emp_type: currentExpObj?.employmentType || "",
    name: "",
  });
  const [companyName, setCompanyName] = useState(
    currentExpObj?.companyName || ""
  );
  const [location, setLocation] = useState(currentExpObj?.location || "");
  const [description, setDescription] = useState(
    currentExpObj?.description || ""
  );
  const [position, setPosition] = useState(currentExpObj?.position ||"");
  const [associated, setAssociated] = useState(currentExpObj?.associated || "");
  const [orgDescription, setOrgDescription] = useState(
    currentExpObj?.orgDescription || ""
  );
  const [orgAssociationArray, setOrgAssociationArray] = useState([]);
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
  const [monthStateOrg, setMonthStateOrg] = useState({
    start_month_org: "",
    end_month_org: "",
    name: "",
  });
  const [yearStateOrg, setYearStateOrg] = useState({
    start_year_org: "",
    end_year_org: "",
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

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Self-Employed",
    "Freelance",
    "Internship",
    "Trainee",
  ];

  const handleEmpTypeSelect = (event) => {
    const name = event.target.name;
    setEmploymentType({
      ...employmentType,
      [name]: event.target.value,
    });
    console.log(name + " " + event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveData = async (userData) => {
    if (enableEdit) {
      const updatedUser = await editUserArray({
        arrayId: currentExpObj._id,
        arrayObj: userData,
        arrayName: "experience",
      });
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            experience: updatedUser?.experience,
          },
        },
      });
    } else {
      const updatedUser = await updateUserInfoArray({
        userId: user?._id,
        userInfo: userData,
        arrayName: "experience",
      });
      dispatch({
        type: "AddAuth",
        payload: {
          user: {
            ...user,
            experience: updatedUser?.experience,
          },
        },
      });
    }

    // const newUserState = { ...user };
    // delete newUserState.experience;
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

  const deleteData = async (expObjId) => {
    const updatedUser = await deleteArrayItem({
      userId: user._id,
      arrayObjId: expObjId,
      arrayName: "experience",
    });
    dispatch({
      type: "AddAuth",
      payload: {
        user: {
          ...user,
          experience: updatedUser?.experience,
          org: updatedUser?.org,
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
    setOrgAssociationArray(associationArray);
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
        {enableEdit ? "Edit" : "Add"} Experience
      </DialogTitle>
      <DialogContent dividers className={dialog__content}>
        <DialogContentText>Title</DialogContentText>
        <TextField
          required
          id="title"
          label="Ex: Software Engineer"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Employment type</DialogContentText>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-age-native-simple">
            Please select
          </InputLabel>
          <Select
            native
            value={employmentType.emp_type}
            onChange={handleEmpTypeSelect}
            label="Please select"
            inputProps={{
              name: "emp_type",
              id: "outlined-age-native-simple",
            }}
          >
            <option aria-label="None" value="" />
            {employmentTypes.map((type, index) => {
              return (
                <option key={index} value={type}>
                  {type}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <DialogContentText>Company name</DialogContentText>
        <TextField
          required
          id="companyName"
          label="Ex: Google"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Location</DialogContentText>
        <TextField
          id="location"
          label="Ex: India, United States"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
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
        <DialogContentText>Organization Name</DialogContentText>
        <TextField
          required
          id="orgName"
          value={orgTitle}
          onChange={(e) => {
            setOrgTitle(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <DialogContentText>Position Held</DialogContentText>
        <TextField
          id="position"
          required
          value={position}
          onChange={(e) => {
            setPosition(e.target.value);
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
            value={associated}
            onChange={(e) => {
              setAssociated(e.target.value);
            }}
            label="Please select"
          >
            <option aria-label="None" value="" />
            {orgAssociationArray.map((association, index) => {
              return (
                <option key={index} value={association}>
                  {association}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <DialogContentText>Start date</DialogContentText>
        <div className={date__section}>
          <FormControl variant="outlined" className={date__select}>
            <InputLabel htmlFor="outlined-age-native-simple">Month</InputLabel>
            <Select
              native
              value={state.start_month_org}
              onChange={handleMonthSelect}
              label="Month"
              inputProps={{
                name: "start_month_org",
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
              value={state.start_year_org}
              onChange={handleYearSelect}
              label="Year"
              inputProps={{
                name: "start_year_org",
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
              value={state.end_month_org}
              onChange={handleMonthSelect}
              label="Month"
              inputProps={{
                name: "end_month_org",
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
              value={state.end_year_org}
              onChange={handleYearSelect}
              label="Year"
              inputProps={{
                name: "end_year_org",
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
          value={orgDescription}
          onChange={(e) => {
            setOrgDescription(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {enableEdit ? (
          <Button
            onClick={() => {
              deleteData(currentExpObj._id);
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
              employmentType: employmentType.emp_type,
              companyName,
              location,
              start_date: `${monthState.start_month}-${yearState.start_year}`,
              end_date: `${monthState.end_month}-${yearState.end_year}`,
              description,
              orgTitle,
              position,
              associated,
              start_date_org:`${monthStateOrg.start_month_org}-${yearStateOrg.start_year_org}`,
              end_date_org:`${monthStateOrg.end_month_org}-${yearStateOrg.end_year_org}`,
              description_org:orgDescription

            });
            setProgress((prev)=> prev+30)
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

export default ExperienceDialog;
