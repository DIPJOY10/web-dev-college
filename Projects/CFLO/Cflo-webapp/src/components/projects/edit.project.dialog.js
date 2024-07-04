import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import teamUtils from "../team/team.utils";
import LoadingButton from "../styled/actionBtns/loading.btn";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { IconButton } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { green } from "@material-ui/core/colors";
import UploadZone from "../file/Uploader/UploadZone";
import FileUploadingView from "../file/Viewer/FileUploadingView";
import FilesViewer from "../file/Viewer/FilesViewer";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import Api from "../../helpers/Api";
import Paper from "@material-ui/core/Paper";
import ProfileSelect from "../styled/profile.select";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import { updateDeleteFlagForSingleFiles } from "../propertyManagement/apiCall";
// const { useSortedTeamHook } = teamUtils;

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

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
    margin: "1rem auto",
    "& $p": {
      // borderBottom: "1px solid grey",
      fontSize: "1rem",
      // padding: "1rem",
      fontWeight: "400",
      marginTop: "0.5rem",
    },
  },
  action__content: {
    padding: "0.5rem",
  },
  section: {
    padding: "1rem",
    "& *": {
      marginBottom: "0.5rem",
    },
    marginBottom: "1rem",
  },
  createButton: {
    textAlign: "right",
  },
  select_input: {
    width: "100%",
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

export default function EditProjectDialog(props) {
  const classes = useStyles();

  const history = useHistory();
  const { handleTeams } = teamUtils;

  const dispatch = useDispatch();
  const { setOpen, open, onCreate, addCreatedOne, team } = props;
  const state = useSelector((state) => state);
  const { user, userProfile } = useSelector((state) => state.auth);
  const fileReducer = useSelector((state) => state.file);
  const { createdFileIds } = fileReducer;

  const [checkedAgreement, setChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const oldTitle = team?.parent?.displayName || ''
  const [title, setTitle] = useState(oldTitle);

  const oldDescription = team?.parent?.description || ''
  const [description, setDescription] = useState(oldDescription);

  const [text, setText] = useState("");
  const [owner, setOwner] = useState(user);
  const userId = user._id;


  const { adminProfiles } = useGetAdminProfiles();

  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  const {
    dialog__content,
    section,
    createButton,
    select_input,
    action__content,
  } = classes;

  const callbackLocal = () => {
    setOpen(false);
  };

  const callback = onCreate ? onCreate : callbackLocal;


  const removeSingleImgFromReducerAndDelete = async (selectedId) => {
    const filteredFileIds = createdFileIds.filter(id => id != selectedId);
    dispatch({
      type: "AddFile",
      payload: {
        createdFileIds: [...filteredFileIds],
      },
    });

    await updateDeleteFlagForSingleFiles({ fileId: selectedId })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const updateProjectApi = async () => {
    setLoading(true);
    const projectObject = {
        //   owner: owner._id,
        //   ownerModelName: owner.model,
        //   user: userId,
        //   creator: user.model === "User" ? userId : userProfile._id,
        //   participants: [user.profile],
          _id: team.parent._id,
          displayName: title,
          description,
        //   displayPicture: createdFileIds[0]
    }

    console.log(projectObject,' is the project object');
    await Api.post("project/newUpdate", projectObject).then((res) => {
        const team = res.data
        setLoading(false);
        handleTeams([team], state, dispatch);
        if (onCreate) {
            onCreate(team);
        }
        setOpen(false);
 
    });

    // dispatch({ type: "FileUploadReset" });

    // setTitle("")
    // setDescription("")
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
        Edit Project
      </DialogTitle>
      <DialogContent dividers className={dialog__content}>
        {loading ? <LinearProgress /> : null}
        {/* <ProfileSelect
          owner={owner}
          adminProfiles={adminProfiles}
          displayOwner={true}
          title={"Project Owner"}
          onChange={(value) => {
            setOwner(value);
          }}
        /> */}
        <Paper elevation={3} className={section}>
          <h3>Project Info</h3>
          <TextField
            required
            id="title"
            label="Project Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            variant="outlined"
            fullWidth
          />
          <TextField
            id="Description"
            label="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            variant="outlined"
            fullWidth
          />
        </Paper>
        {/* <Paper elevation={3} className={section}>
          <h3>Profile details</h3>
          <div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p style={{ marginTop: "-15px", fontSize: "16px", fontWeight: "550" }} >Logo</p>
              <FileUploadButton
                parentType="Doc"
                used={false}
                parentId={null}
                IconColor="white"
                iconBig={true}
                aditionalText={"Add Logo"}
                attachIconStyle={classes.attachIconFont}
                iconWithTextStyle={classes.iconWithTextStyle}
              />
            </div>
            <FilesViewer
              fileIds={createdFileIds}
              deletable={true}
              handler={removeSingleImgFromReducerAndDelete}
            />
          </div>
        </Paper> */}
      </DialogContent>
      <DialogActions>
        <div className={action__content}>

          <div className={createButton}>
            <LoadingButton
              variant="outlined"
              color="primary"
              text="Save Details"
              onClick={() => {
                updateProjectApi();
              }}
              style={{
                textTransform: "none",
                fontSize: "1rem",
              }}
            />
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
}