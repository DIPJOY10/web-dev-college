import React, { useState, useEffect, useRef } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IncompleteProfile from "./IncompleteProfile";

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
  paper__section: {
    display: "flex",
    flexDirection: "column",
    fontSize: "1.05rem",
    marginTop: "1rem",
    border: "1px solid white",
    borderRadius: "10px",
    padding: "1.5rem",
    "& $h2": {
      fontWeight: "400",
      fontSize: "1.5rem",
      display: "inline",
    },
    "& p": {
      color: "grey",
      width: "90%",
    },
  },
  section__header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

const AboutSection = ({ isOwnProfile, profile, setDialog, setShowAbout,
  setShowExperience,setShowEducation,setShowSkill,isEducation,progress,setProgress,dialog }) => {
  const componentRef = useRef();
  const history = useHistory();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { user, organizationIds } = useSelector((state) => state.auth);

  const classes = useStyles();

  const { editBtn, paper__section, section__header } = classes;

  return (
    <div>
      {isOwnProfile ? (
        <div>
          {user?.about ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>About</h2>
                <IconButton
                  className={editBtn}
                  onClick={() => {
                    setShowAbout(true);
                    setDialog("about");
                  }}
                >
                  <EditIcon reverse />
                </IconButton>
              </div>
              <p>{user?.about}</p>
            </Paper>
          ) : <div>
            <IncompleteProfile setDialog={setDialog} dialog={dialog} setShowExperience={setShowExperience}
             setShowEducation={setShowEducation} setShowSkill={setShowSkill}
              isEducation={isEducation}
              progress={progress}
              setProgress={setProgress}
             />
          </div>}
        </div>

      ) : (
        <div>
          {profile?.parent?.about ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>About</h2>
              </div>
              <p>{profile?.parent?.about}</p>
            </Paper>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AboutSection;
