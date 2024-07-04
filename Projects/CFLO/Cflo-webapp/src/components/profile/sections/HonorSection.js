import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import AvatarSquare from "@material-ui/core/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward } from "@fortawesome/free-solid-svg-icons";

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

const HonorSection = ({
  isOwnProfile,
  profile,
  setShowHonor,
  setShowHonorEdit,
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
    educationCard,
    educationCard__left,
    educationCard__middle,
    educationCard__right,
    card__heading,
    project__title,
  } = classes;

  return (
    <div>
      {isOwnProfile ? (
        <div>
          {user?.honors && user?.honors?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Honors & Awards</h2>
                <div>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowHonorEdit(true);
                      setDialog("honors");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    className={editBtn}
                    onClick={() => {
                      setShowHonorEdit(true);
                      setDialog("honorEdit");
                    }}
                  >
                    <EditIcon reverse />
                  </IconButton>
                </div>
              </div>
              <div>
                {user?.honors.map((honor, index) => {
                  return (
                    <div className={educationCard} key={index}>
                      <div className={educationCard__left}>
                        <AvatarSquare variant="square">
                          <FontAwesomeIcon icon={faAward} fontSize="2rem" />
                        </AvatarSquare>
                      </div>
                      <div className={educationCard__middle}>
                        <div className={card__heading}>
                          <h4 className={project__title}>{honor.title}</h4>
                        </div>
                        <p>
                          {honor.issuer ? `Issued by: ${honor.issuer}` : null}
                        </p>
                        <p>
                          {honor.associated
                            ? `Associated with: ${honor.associated}`
                            : null}
                        </p>
                        <p>{honor.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Paper>
          ) : null}
        </div>
      ) : (
        <div>
          {profile?.parent?.honors && profile?.parent?.honors?.length !== 0 ? (
            <Paper className={paper__section}>
              <div className={section__header}>
                <h2>Honors & Awards</h2>
              </div>
              <div>
                {profile?.parent?.honors.map((honor, index) => {
                  return (
                    <div className={educationCard} key={index}>
                      <div className={educationCard__left}>
                        <AvatarSquare variant="square">
                          <FontAwesomeIcon icon={faAward} fontSize="2rem" />
                        </AvatarSquare>
                      </div>
                      <div className={educationCard__middle}>
                        <div className={card__heading}>
                          <h4 className={project__title}>{honor.title}</h4>
                        </div>
                        <p>
                          {honor.issuer ? `Issued by: ${honor.issuer}` : null}
                        </p>
                        <p>
                          {honor.associated
                            ? `Associated with: ${honor.associated}`
                            : null}
                        </p>
                        <p>{honor.description}</p>
                      </div>
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

export default HonorSection;
