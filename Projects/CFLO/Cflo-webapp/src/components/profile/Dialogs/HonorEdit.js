import React, { useState } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import AvatarSquare from "@material-ui/core/Avatar";
import HonorDialog from "./HonorDialog";
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
  dialog__content: {
    "& $p": {
      fontSize: "1rem",
      fontWeight: "400",
    },
  },
  educationCard: {
    display: "flex",
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

const HonorEdit = ({ open, setOpen }) => {
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
  const [openHonorDialog, setOpenHonorDialog] = useState(false);
  const [currentHonorObj, setcurrentHonorObj] = useState({});
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
          Edit Honors & Awards
        </DialogTitle>
        <DialogContent dividers className={dialog__content}>
          <div>
            {user?.honors &&
              user?.honors.map((honor, index) => {
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
                    <div className={educationCard__right}>
                      <IconButton
                        onClick={() => {
                          setOpen(false);
                          setcurrentHonorObj(honor);
                          setOpenHonorDialog(true);
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
      {openHonorDialog ? (
        <HonorDialog
          open={openHonorDialog}
          setOpen={setOpenHonorDialog}
          enableEdit={1}
          currentHonorObj={currentHonorObj}
        />
      ) : null}
    </div>
  );
};

export default HonorEdit;
