import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import AvatarSquare from "@material-ui/core/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/fontawesome-svg-core";
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
  educationCard: {
    display: "flex",
    flexWrap: "wrap",
    "& $h4": {
      fontWeight: "normal",
    },
    borderBottom: "0.5px solid grey",
    "&:nth-last-child(1)": {
      border: "none",
    },
    padding: "1rem",
  },
  educationCard__middle: {
    flex: 0.6,
    marginLeft: "1rem",
  },
  educationCard__right: {
    display: "flex",
    alignItems: "center",
    flex: 0.3,
  },
  link__button: {
    margin: "0.5rem 0",
    borderRadius: "20px",
    color: "grey",
  },
  card__heading: {
    display: "flex",
    alignItems: "center",
    width: "50%",
    "& $p": {
      width: "auto",
    },
  },
  project__title: {
    fontSize: "1.1rem",
    marginRight: "1rem",
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

const LicenseSection = ({ profile }) => {
  const classes = useStyles();

  const {
    paper__section,
    section__header,
    educationCard,
    educationCard__left,
    educationCard__middle,
    educationCard__right,
    card__heading,
    project__title,
  } = classes;

  return (
    <div>
      <div>
        {profile?.parent?.licenses &&
        profile?.parent?.licenses?.length !== 0 ? (
          <Paper className={paper__section}>
            <div className={section__header}>
              <h2>Licenses & Certifications</h2>
            </div>
            <div>
              {profile?.parent?.licenses.map((license, index) => {
                return (
                  <div className={educationCard} key={index}>
                    <div className={educationCard__left}>
                      <AvatarSquare variant="square">
                        <VerifiedUserIcon fontSize="large" />
                      </AvatarSquare>
                    </div>
                    <div className={educationCard__middle}>
                      <div className={card__heading}>
                        <h4 className={project__title}>{license.title}</h4>
                        <p>
                          {license?.license_url ? (
                            <IconButton
                              href={license.license_url}
                              target="_blank"
                            >
                              <FontAwesomeIcon
                                icon={faUpRightFromSquare}
                                size="sm"
                              />
                            </IconButton>
                          ) : null}
                        </p>
                      </div>
                      <p>
                        {license.association ? `${license.association}` : null}
                      </p>
                      <p>
                        {license.credentialId
                          ? `Credential ID: ${license.credentialId}`
                          : null}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Paper>
        ) : null}
      </div>
    </div>
  );
};

export default LicenseSection;
