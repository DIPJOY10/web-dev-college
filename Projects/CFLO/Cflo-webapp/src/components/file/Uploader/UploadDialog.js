import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import UploadZone from "./UploadZone";
import FileUploadingView from "../Viewer/FileUploadingView";
import FilesViewer from "../Viewer/FilesViewer";

const useStyles = makeStyles((theme) => ({
  paperScrollPaper: {
    [theme.breakpoints.down("xs")]: {
      height: "calc(100% - 100px)",
    },
  },
}));

const FileUploadDialog = (props) => {
  const classes = useStyles();
  const fileReducer = useSelector((state) => state.file);
  const { createdFileIds } = fileReducer;
  const {
    open,
    setOpen,
    parentType,
    isDP,
    acceptImage,
    setFilesIds,
    isDocuSignFileTypes,
  } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.paperScrollPaper}
      >
        <DialogContent>
          <UploadZone
            parentType={parentType}
            isDP={isDP}
            acceptImage={acceptImage}
            isDocuSignFileTypes={isDocuSignFileTypes}
          />
          <FileUploadingView />
          <FilesViewer fileIds={createdFileIds} />
        </DialogContent>

        <DialogActions onClick={handleClose}>
          <Button onClick={handleClose}  color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileUploadDialog;
