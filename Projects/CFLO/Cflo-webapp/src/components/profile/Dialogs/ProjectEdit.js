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
import { updateUserInfoArray } from "../api";
import AvatarSquare from "@material-ui/core/Avatar";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ProjectDialog from "./ProjectDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  dialog__content: {
    "& $p": {
      // borderBottom: "1px solid grey",
      fontSize: "1rem",
      // padding: "1rem",
      fontWeight: "400",
    },
  },
  educationCard: {
    display: "flex",
    // justifyContent: "space-around",
    borderBottom: "0.5px solid grey",
    padding: "1rem",
    "& p": {
      color: "grey",
      width: "90%",
    },
  },
  educationCard__middle: {
    flex: 0.9,
    marginLeft: "1rem",
    "& $h4": {
      fontWeight: "normal",
      fontSize: "1.1rem",
    },
  },
  card__heading: {
    display: "flex",
    alignItems: "center",
    "& $p": {
      width: "auto",
    },
  },
  project__title: {
    fontSize: "1.2rem",
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

const ProjectEdit = ({ open, setOpen }) => {
  const classes = useStyles();
  const {
    dialog__content,
    educationCard,
    educationCard__left,
    educationCard__middle,
    educationCard__right,
    card__heading,
    project__title,
  } = classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [currentProjectObj, setcurrentProjectObj] = useState({});
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
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
          <div>
            {user?.projects &&
              user?.projects.map((project, index) => {
                return (
                  <div className={educationCard} key={index}>
                    <div className={educationCard__left}>
                      <AvatarSquare variant="square">
                        <AccountBalanceIcon />
                      </AvatarSquare>
                    </div>
                    <div className={educationCard__middle}>
                      <div className={card__heading}>
                        <h4 className={project__title}>{project.title}</h4>
                        <p>
                          {project?.project_url ? (
                            <IconButton
                              href={project.project_url}
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
                        {project.associated
                          ? `Associated with: ${project.associated}`
                          : null}
                      </p>
                      <p>{project.description}</p>
                    </div>
                    <div className={educationCard__right}>
                      <IconButton
                        onClick={() => {
                          setUploadedFileIds([]);
                          let projectPicIds = [];
                          let pictureArray = project?.pictures;
                          pictureArray.forEach((id) => {
                            projectPicIds.push(id);
                          });
                          setUploadedFileIds(projectPicIds);
                          setOpen(false);
                          setcurrentProjectObj(project);
                          setOpenProjectDialog(true);
                        }}
                      >
                        <EditIcon reverse />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
      {openProjectDialog ? (
        <ProjectDialog
          open={openProjectDialog}
          setOpen={setOpenProjectDialog}
          enableEdit={1}
          currentProjectObj={currentProjectObj}
          uploadedFileIds={uploadedFileIds}
          setUploadedFileIds={setUploadedFileIds}
        />
      ) : null}
    </div>
  );
};

export default ProjectEdit;
