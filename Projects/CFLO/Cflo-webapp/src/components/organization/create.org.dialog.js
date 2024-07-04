import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useParams, useHistory } from "react-router-dom";
import CloseBtn from "../styled/actionBtns/close.btn";
import _ from "lodash";
import TitleInput from "../styled/title.input";
import DescriptionInput from "../styled/description.input";
import clsx from "clsx";
import LinearProgress from "@material-ui/core/LinearProgress";
import teamUtils from "../team/team.utils";
import { createOrg } from "./organization.utils";
import LoadingButton from "../styled/actionBtns/loading.btn";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import TeamSetting from "../team/TeamSettings/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { green } from "@material-ui/core/colors";
import { Paper } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import UploadZone from "../file/Uploader/UploadZone";
import FileUploadingView from "../file/Viewer/FileUploadingView";
import FilesViewer from "../file/Viewer/FilesViewer";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import { updateDeleteFlagForSingleFiles } from "../propertyManagement/apiCall";

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
    "& .MuiFormControl-root": {
      width: "90%",
      margin: theme.spacing(1),
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

export default function CreateOrgDialog(props) {
  const classes = useStyles();

  const history = useHistory();
  const { handleTeams } = teamUtils;

  const dispatch = useDispatch();
  const { setOpen, open, onCreate, addCreatedOne } = props;
  const state = useSelector((state) => state);
  const { user, userProfile } = useSelector((state) => state.auth);
  const userId = user._id;
  const fileReducer = useSelector((state) => state.file);
  const { createdFileIds } = fileReducer;

  const [owner, setOwner] = useState(user);

  const [displayName, setDisplayName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [checkedAgreement, setChecked] = useState(false);
  const [tagline, setTagline] = useState("");

  const [loading, setLoading] = useState(false);

  const agreementSentence =
    "I verify that I am an authorized representative of this organization and have the right to act on its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.";

  const compSizeArray = [
    "0-1 employees",
    "2-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1,000 employees",
    "1,001-5,000 employees",
    "5,001-10,000 employees",
    "10,000+ employees",
  ];
  const compTypeArray = [
    "Public company",
    "Self-employed",
    "Government agency",
    "Nonprofit",
    "Sole proprietorship",
    "Privately held",
    "Partnership",
  ];

  const {
    dialog__content,
    section,
    createButton,
    select_input,
    action__content,
  } = classes;

  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  const callbackLocal = () => {
    setOpen(false);
  };

  const callback = onCreate ? onCreate : callbackLocal;

  const removeSingleImgFromReducerAndDelete = async (selectedId) => {
    const filteredFileIds = createdFileIds.filter((id) => id != selectedId);
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
      });
  };

  const createOrgApi = () => {
    createOrg(
      {
        user: userId,
        creator: user.model === "User" ? userId : userProfile._id,
        participants: [user.profile],
        displayName,
        website,
        industry,
        companySize,
        companyType,
        tagline,
        displayPicture: createdFileIds[0],
      },
      state,
      dispatch,
      callback,
      setLoading,
      addCreatedOne
    );

    dispatch({ type: "FileUploadReset" });
    setDisplayName("");
    setWebsite("");
    setIndustry("");
    setCompanySize("");
    setCompanyType("");
    setChecked(false);
    setTagline("");
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
        Create Organization Page
      </DialogTitle>
      <DialogContent dividers className={dialog__content}>
        {loading ? <LinearProgress /> : null}
        {/* <Paper elevation={3} className={section}> */}
        <h3>Organization Identity</h3>
        <TextField
          required
          id="displayName"
          label="Name"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <TextField
          id="website"
          label="Website"
          value={website}
          onChange={(e) => {
            setWebsite(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        {/* </Paper>
        <Paper elevation={3} className={section}> */}
        <h3>Organization Details</h3>
        <TextField
          required
          id="industry"
          label="Industry"
          value={industry}
          onChange={(e) => {
            setIndustry(e.target.value);
          }}
          variant="outlined"
          fullWidth
        />
        <FormControl variant="outlined" className={select_input}>
          <InputLabel htmlFor="outlined-age-native-simple">
            Select company size
          </InputLabel>
          <Select
            native
            value={companySize}
            onChange={(e) => {
              setCompanySize(e.target.value);
            }}
            label="Select company size"
          >
            <option aria-label="None" value="" />
            {compSizeArray.map((entry, index) => {
              return (
                <option key={index} value={entry}>
                  {entry}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={select_input}>
          <InputLabel htmlFor="outlined-age-native-simple">
            Select company type
          </InputLabel>
          <Select
            native
            value={companyType}
            onChange={(e) => {
              setCompanyType(e.target.value);
            }}
            label="Select company type"
          >
            <option aria-label="None" value="" />
            {compTypeArray.map((entry, index) => {
              return (
                <option key={index} value={entry}>
                  {entry}
                </option>
              );
            })}
          </Select>
        </FormControl>
        {/* </Paper>
        <Paper elevation={3} className={section}> */}
        <h3>Profile details</h3>
        <div style={{ marginLeft: "1rem" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                fontWeight: "550",
              }}
            >
              Logo
            </p>
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
        <div style={{ marginLeft: "1rem" }}>
          <p style={{ fontSize: "16px", fontWeight: "550" }}>Tagline</p>
          <TextField
            id="tagline"
            // label="add tagline"
            multiline
            rows={2}
            variant="outlined"
            value={tagline}
            onChange={(e) => {
              setTagline(e.target.value);
            }}
            fullWidth
          />
        </div>
        {/* </Paper> */}
      </DialogContent>
      <DialogActions>
        <div className={action__content}>
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={checkedAgreement}
                onChange={() => {
                  setChecked(!checkedAgreement);
                }}
              />
            }
            label={agreementSentence}
          />
          <div className={createButton}>
            <LoadingButton
              loading={loading}
              variant="outlined"
              color="primary"
              disabled={!checkedAgreement}
              text="Save Details"
              onClick={() => {
                createOrgApi();
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
