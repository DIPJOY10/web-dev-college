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
import LicenseDialog from "./LicenseDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

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

const LicenseEdit = ({ open, setOpen }) => {
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
  const [openLicenseDialog, setOpenLicenseDialog] = useState(false);
  const [currentLicenseObj, setcurrentLicenseObj] = useState({});
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
          Edit License
        </DialogTitle>
        <DialogContent dividers className={dialog__content}>
          <div>
            {user?.licenses &&
              user?.licenses.map((license, index) => {
                return (
                  <div className={educationCard} key={index}>
                    <div className={educationCard__left}>
                      <AvatarSquare variant="square">
                        <VerifiedUserIcon />
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
                    <div className={educationCard__right}>
                      <IconButton
                        onClick={() => {
                          setOpen(false);
                          setcurrentLicenseObj(license);
                          setOpenLicenseDialog(true);
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
      {openLicenseDialog ? (
        <LicenseDialog
          open={openLicenseDialog}
          setOpen={setOpenLicenseDialog}
          enableEdit={1}
          currentLicenseObj={currentLicenseObj}
        />
      ) : null}
    </div>
  );
};

export default LicenseEdit;
