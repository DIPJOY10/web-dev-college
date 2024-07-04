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
import LanguageDialog from "./LanguageDialog";
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
  languageCard: {
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "0.5px solid grey",
    "&:nth-last-child(1)": {
      border: "none",
    },
  },
  language__left: {
    "& $h4": {
      fontWeight: "400",
      fontSize: "1.1rem",
    },
    "& p": {
      color: "grey",
    },
    padding: "1rem",
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

const LanguageEdit = ({ open, setOpen }) => {
  const classes = useStyles();
  const { dialog__content, languageCard, language__left, language__right } =
    classes;

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false);
  const [currentLangObj, setcurrentLangObj] = useState({});
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
          Edit Language
        </DialogTitle>
        <DialogContent dividers className={dialog__content}>
          <div>
            {user?.languages &&
              user?.languages.map((language, index) => {
                return (
                  <div className={languageCard} key={index}>
                    <div className={language__left}>
                      <h4>{language.name}</h4>
                      {language?.proficiency ? (
                        <p>{language?.proficiency}</p>
                      ) : null}
                    </div>
                    <div className={language__right}>
                      <IconButton
                        onClick={() => {
                          setOpen(false);
                          setcurrentLangObj(language);
                          setOpenLanguageDialog(true);
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
      {openLanguageDialog ? (
        <LanguageDialog
          open={openLanguageDialog}
          setOpen={setOpenLanguageDialog}
          enableEdit={1}
          currentLangObj={currentLangObj}
        />
      ) : null}
    </div>
  );
};

export default LanguageEdit;
