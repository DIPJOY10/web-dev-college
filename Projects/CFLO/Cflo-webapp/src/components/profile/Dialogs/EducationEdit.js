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
import EducationDialog from "./EducationDialog";

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
  },
  educationCard__middle: {
    flex: 0.9,
    marginLeft: "1rem",
    "& $h4": {
      fontWeight: "normal",
      fontSize: "1.1rem",
    },
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

const EducationEdit = ({ open, setOpen, educationArray }) => {
  const classes = useStyles();
  const {
    dialog__content,
    educationCard,
    educationCard__left,
    educationCard__middle,
    educationCard__right,
  } = classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const [openEducationDialog, setOpenEducationDialog] = useState(false);
  const [currentEduObj, setCurrentEduObj] = useState({});
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
          Edit Education
        </DialogTitle>
        <DialogContent dividers className={dialog__content}>
          <div>
            {user?.education &&
              user?.education.map((eduObj, index) => {
                return (
                  <div className={educationCard} key={index}>
                    <div className={educationCard__left}>
                      <AvatarSquare variant="square">
                        <AccountBalanceIcon />
                      </AvatarSquare>
                    </div>
                    <div className={educationCard__middle}>
                      <h4>{eduObj.school}</h4>
                      <p>
                        {eduObj.degree}
                        {eduObj.field ? `, ${eduObj.field}` : null}
                      </p>
                      <p>{eduObj.grade ? `Grade: ${eduObj.grade}` : null}</p>
                      <p>{eduObj.description}</p>
                    </div>
                    <div className={educationCard__right}>
                      <IconButton
                        onClick={() => {
                          console.log(eduObj._id);
                          setOpen(false);
                          console.log(eduObj);
                          setCurrentEduObj(eduObj);
                          setOpenEducationDialog(true);
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
      {openEducationDialog ? (
        <EducationDialog
          open={openEducationDialog}
          setOpen={setOpenEducationDialog}
          enableEdit={1}
          currentEduObj={currentEduObj}
        />
      ) : null}
    </div>
  );
};

export default EducationEdit;
