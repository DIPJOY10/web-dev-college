import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
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

const AboutDialog = ({ open, setOpen, saveData }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);

  const [aboutText, setAboutText] = useState(user?.about || "");

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      {open ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          scroll={"paper"}
          fullWidth
        >
          <DialogTitle id="form-dialog-title" onClose={handleClose}>
            Edit about
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              You can write about your years of experience, industry, or skills.
              People also talk about their achievements or previous job
              experiences.
            </DialogContentText>
            <TextField
              id="about"
              label="About"
              multiline
              rows={8}
              variant="outlined"
              value={aboutText}
              onChange={(e) => {
                setAboutText(e.target.value);
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                saveData({
                  about: aboutText,
                });
              }}
              color="primary"
              variant="outlined"
            >
              SAVE
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </div>
  );
};

export default AboutDialog;
