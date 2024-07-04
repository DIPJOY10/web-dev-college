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
import AvatarSquare from "@material-ui/core/Avatar";
import WorkIcon from "@material-ui/icons/Work";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

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
  paper_section_org:{
     background:'transparent'
  },
  section__header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  educationCard: {
    display: "flex",
    "& $h4": {
      fontWeight: "normal",
    },
    borderBottom: "0.5px solid grey",
    "&:nth-last-child(1)": {
      border: "none",
    },
    padding: "1rem",
    "&:hover": {
      backgroundColor: "#F9F9F9",
    },
    cursor: "pointer",
  },
  educationCard__right: {
    flex: 0.8,
    marginLeft: "1rem",
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

const ExperienceSection = ({
  isOwnProfile,
  profile,
  setDialog,
  setShowExperience,
  setShowExperienceEdit,
  setShowOrganization,
  setShowOrganizationEdit
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
    educationCard,
    educationCard__left,
    educationCard__right,
    paper_section_org
  } = classes;

  return (
    <div>
      {isOwnProfile ? (
        <div>
          {user?.experience && user?.experience?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Experience</h2>
                <div>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowExperience(true);
                      setDialog("experience");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowExperienceEdit(true);
                      setDialog("experienceEdit");
                    }}
                  >
                    <EditIcon reverse />
                  </IconButton>
                </div>
              </div>
              <div>
                {user?.experience.map((expObj, index) => {
                  return (
                    <div className={educationCard} key={index}>
                      <div className={educationCard__left}>
                        {/* make it square using variant="square" */}
                        <AvatarSquare>
                          <WorkIcon />
                        </AvatarSquare>
                      </div>
                      <div className={educationCard__right}>
                        <h4>{expObj.title}</h4>
                        <p>
                          {expObj.companyName}
                          {expObj?.employmentType
                            ? `- ${expObj.employmentType}`
                            : null}
                        </p>

                        <p>{expObj.location}</p>
                        <p>{expObj.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={paper_section_org}>
              <div className={section__header}>
                {/* <h2>Organizations</h2> */}
              </div>
              <div>
                {user?.experience.map((orgObj, index) => {
                  return (
                    <div className={educationCard} key={index}>
                      <div className={educationCard__left}>
                        <AvatarSquare>
                          <SupervisedUserCircleIcon fontSize="large" />
                        </AvatarSquare>
                      </div>
                      <div className={educationCard__right}>
                        <h4>{orgObj.orgTitle}</h4>
                        <p>{orgObj.position}</p>
                        <p>
                          {orgObj.associated
                            ? `Associated with: ${orgObj.associated}`
                            : null}
                        </p>
                        <p>{orgObj.description_org}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </Paper>
            
          ) : null}
        </div>
      ) : (
        <div>
          {profile?.parent?.experience &&
          profile?.parent?.experience?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Experience</h2>
              </div>
              <div>
                {profile?.parent?.experience.map((expObj, index) => {
                  return (
                    <div className={educationCard} key={index}>
                      <div className={educationCard__left}>
                        <AvatarSquare>
                          <WorkIcon />
                        </AvatarSquare>
                      </div>
                      <div className={educationCard__right}>
                        <h4>{expObj.title}</h4>
                        <p>
                          {expObj.companyName}
                          {expObj?.employmentType
                            ? `- ${expObj.employmentType}`
                            : null}
                        </p>

                        <p>{expObj.location}</p>
                        <p>{expObj.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Organizations</h2>
              </div>
              <div>
                {profile?.parent?.org.map((orgObj, index) => {
                  return (
                    <div className={educationCard} key={index}>
                      <div className={educationCard__left}>
                        <AvatarSquare>
                          <SupervisedUserCircleIcon fontSize="large" />
                        </AvatarSquare>
                      </div>
                      <div className={educationCard__right}>
                        <h4>{orgObj.OrgTitle}</h4>
                        <p>{orgObj.position}</p>
                        <p>
                          {orgObj.associated
                            ? `Associated with: ${orgObj.associated}`
                            : null}
                        </p>
                        <p>{orgObj.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Paper>
            </Paper>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
