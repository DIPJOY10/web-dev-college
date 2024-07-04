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
import UploadZone from "../../file/Uploader/UploadZone";
import FileUploadingView from "../../file/Viewer/FileUploadingView";
import FilesViewer from "../../file/Viewer/FilesViewer";
import {
  editOrgInfoArray,
  deleteOrgArrayItem,
  deleteOrgProjectPic,
  updateFileFlag,
} from "../../organization/organization.utils";
import teamUtils from "../team.utils";

const { handleTeamParentData } = teamUtils;

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
  upload__section: {
    border: "1px solid #2296f3",
    borderRadius: "5px",
    height: "50px",
    textAlign: "center",
    padding: "10px",
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

const ProjectDialog = ({
  open,
  setOpen,
  currentProjectObj,
  uploadedFileIds,
  setUploadedFileIds,
}) => {
  const classes = useStyles();
  const { date__section, date__select, dialog__content, upload__section } =
    classes;

  const { teamId } = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const fileReducer = useSelector((state) => state.file);
  const { createdFileIds } = fileReducer;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;

  const [title, setTitle] = useState(currentProjectObj?.title || "");
  const [projectUrl, setProjectUrl] = useState(
    currentProjectObj?.project_url || ""
  );

  const [description, setDescription] = useState(
    currentProjectObj?.description || ""
  );
  const [ProjectAssociationArray, setProjectAssociationArray] = useState([]);
  const [pictureArray, setPictureArray] = useState([]);

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

  const saveData = async (ProjectObj) => {
    const updatedOrg = await editOrgInfoArray(
      {
        arrayId: currentProjectObj._id,
        arrayObj: ProjectObj,
        arrayName: "projects",
      },
      dispatch
    );
    handleTeamParentData(
      teamId,
      {
        projects: updatedOrg?.projects,
      },
      state,
      dispatch
    );
    dispatch({ type: "FileUploadReset" });
  };

  const deleteData = async (ProjectObjId) => {
    const updatedOrg = await deleteOrgArrayItem(
      {
        orgId: parent?._id,
        arrayObjId: ProjectObjId,
        arrayName: "projects",
      },
      dispatch
    );
    handleTeamParentData(
      teamId,
      {
        projects: updatedOrg?.projects,
      },
      state,
      dispatch
    );
  };
  //while creation
  const updateFileIds = (fileId, flag) => {
    //flag is to check it is to be deleted from uploadedFileIds or createdFileIds
    let newFileIds = [];
    if (flag === 1) {
      //createdFileIds
      newFileIds = [...(createdFileIds || [])] || [];
    } else {
      newFileIds = [...(uploadedFileIds || [])] || [];
    }
    for (var i = 0; i < newFileIds.length; i++) {
      if (newFileIds[i] === fileId) {
        newFileIds.splice(i, 1);
        break;
      }
    }
    if (flag === 1) {
      console.log(newFileIds);
      dispatch({
        type: "AddFile",
        payload: {
          createdFileIds: [...newFileIds],
        },
      });
    } else {
      setUploadedFileIds(newFileIds);
    }
  };

  const saved = (fileId) => {
    if (!uploadedFileIds || uploadedFileIds?.length === 0) {
      return false;
    }
    for (var i = 0; i < uploadedFileIds.length; i++) {
      if (uploadedFileIds[i] === fileId) {
        return true;
      }
    }
    return false;
  };

  const deletePicture = async (fileId) => {
    if (saved(fileId) === true) {
      console.log("it is saved!");
      const updatedOrg = await deleteOrgProjectPic({
        orgId: parent?._id,
        projectId: currentProjectObj._id,
        fileId,
      });
      handleTeamParentData(
        teamId,
        {
          projects: updatedOrg?.projects,
        },
        state,
        dispatch
      );
      updateFileIds(fileId, 0); //delete from uploadedFileIds
    } else {
      console.log("it is not saved!");
      updateFileFlag({
        fileId,
      });
      updateFileIds(fileId, 1); //delete from createdFileIds
    }
  };

  useEffect(() => {
    if (uploadedFileIds && uploadedFileIds?.length !== 0) {
      setPictureArray([...uploadedFileIds]);
    }
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
    setProjectAssociationArray(associationArray);
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
        Edit Project
      </DialogTitle>
      <DialogContent dividers className={dialog__content}>
        <DialogContentText>Project Name</DialogContentText>
        <TextField
          required
          id="projectName"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
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
        <DialogContentText>Project URL</DialogContentText>
        <TextField
          id="projectUrl"
          value={projectUrl}
          onChange={(e) => {
            setProjectUrl(e.target.value);
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
        <div>
          <DialogContentText>Edit Snapshots</DialogContentText>
          <UploadZone parentType="User" isDP={false} acceptImage={true} />
          <FileUploadingView />
          <FilesViewer
            fileIds={[...(uploadedFileIds || []), ...(createdFileIds || [])]}
            deletable={true}
            styleBody={{ border: "5px solid black" }}
            handler={deletePicture}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            deleteData(currentProjectObj._id);
            handleClose();
          }}
          color="secondary"
          variant="outlined"
        >
          DELETE
        </Button>
        <Button
          onClick={() => {
            saveData({
              title,
              start_date: `${monthState.start_month}-${yearState.start_year}`,
              end_date: `${monthState.end_month}-${yearState.end_year}`,
              project_url: projectUrl,
              pictures: [...(uploadedFileIds || []), ...(createdFileIds || [])],
              description,
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

export default ProjectDialog;
