import React, { useState, useEffect, useRef } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

import EditIcon from "@material-ui/icons/Edit";
import { Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import AvatarSquare from "@material-ui/core/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/fontawesome-svg-core";
import DescriptionIcon from "@material-ui/icons/Description";
import LinkIcon from "@material-ui/icons/Link";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

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
  editIcon: {
    marginTop: "0.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "auto",
  },
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
  languageCard: {
    "& $h4": {
      fontWeight: "400",
    },
    borderBottom: "0.5px solid grey",
    "&:nth-last-child(1)": {
      border: "none",
    },
    padding: "1rem",
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

const LanguageSection = ({
  isOwnProfile,
  profile,
  setShowLang,
  setShowLangEdit,
  setDialog,
}) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { user, organizationIds } = useSelector((state) => state.auth);

  const classes = useStyles();

  const { editBtn, paper__section, section__header, languageCard } = classes;

  return (
    <div>
      {isOwnProfile ? (
        <div>
          {user?.languages && user?.languages?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Languages</h2>
                <div>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowLang(true);
                      setDialog("languages");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowLangEdit(true);
                      setDialog("languageEdit");
                    }}
                  >
                    <EditIcon reverse />
                  </IconButton>
                </div>
              </div>
              <div>
                {user?.languages.map((language, index) => {
                  return (
                    <div className={languageCard} key={index}>
                      <h4>{language.name}</h4>
                      {language?.proficiency ? (
                        <p>{language?.proficiency}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Paper>
          ) : null}
        </div>
      ) : (
        <div>
          {profile?.parent?.languages &&
          profile?.parent?.languages?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Languages</h2>
              </div>
              <div>
                {profile?.parent?.languages.map((language, index) => {
                  return (
                    <div className={languageCard} key={index}>
                      <h4>{language.name}</h4>
                      {language?.proficiency ? (
                        <p>{language?.proficiency}</p>
                      ) : null}
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

export default LanguageSection;
