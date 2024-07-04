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
import AddIcon from "@material-ui/icons/Add";

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
  rounded_input: {
    border: "1px solid #90caf9",
    borderRadius: "5px",
    fontSize: ".8rem",
    backgroundColor: "#f9fafb",
    opacity: 0.95,
    color: '#34a2fa',
    fontWeight: "600",
    margin: "0.5rem",
    padding: "7px",
    "&:hover": {
      border: "1px solid #90caf9",
      opacity: 1,
      boxShadow: "0 0 1.2px 1.2px #90caf9",
    },
  },
  suggestion__content: {
    display: "flex",
    flexWrap: "wrap",
    width: "90%",
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

const SkillSection = ({
  isOwnProfile,
  profile,
  setShowSkill,
  setShowSkillEdit,
  setDialog,
}) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { user, organizationIds } = useSelector((state) => state.auth);

  const classes = useStyles();

  const {
    editBtn,
    paper__section,
    section__header,
    rounded_input,
    suggestion__content,
  } = classes;

  console.log(user)

  return (
    <div>
      {isOwnProfile ? (
        <div>
          {user?.skills && user?.skills?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h3>Skills</h3>
                <div>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowSkill(true);
                      setDialog("skills");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowSkillEdit(true);
                      setDialog("skillEdit");
                    }}
                  >
                    <EditIcon reverse />
                  </IconButton>
                </div>
              </div>
              <div className={suggestion__content}>
                {user?.skills.map((skill, index) => {
                  return (
                    <div
                      key={index}
                      className={rounded_input}
                      onClick={() => { }}
                    >
                      {skill}
                    </div>
                  );
                })}
              </div>
            </Paper>
          ) : null}
        </div>
      ) : (
        <div>
          {profile?.parent?.skills && profile?.parent?.skills?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Skills</h2>
              </div>
              <div className={suggestion__content}>
                {profile?.parent?.skills.map((skill, index) => {
                  return (
                    <div
                      key={index}
                      className={rounded_input}
                      onClick={() => { }}
                    >
                      {skill}
                    </div>
                  );
                })}
              </div>
            </Paper>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SkillSection;
