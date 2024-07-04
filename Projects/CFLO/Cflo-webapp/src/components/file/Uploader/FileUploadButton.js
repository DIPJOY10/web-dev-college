import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { IconButton } from "@material-ui/core";
import UploadDialog from "./UploadDialog";
import Uploader from "./Uploader";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import DpUploadDialog from "./DpUploadDialog";
import CoverUploadDialog from "./CoverUploadDialog";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  attachIcon: {
    fontSize: 26,
  },
}));

const FileUploadButton = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    parentType,
    parentId,
    used,
    acceptImage,
    isDP,
    isCover,
    aditionalText,
    uploadImg,
    setFilesIds,
    cameraIcon = false,
    iconBig = false,
    onlyCameraStyle,
    attachIconStyle,
    iconWithTextStyle,
    isDocuSignFileTypes,
  } = props;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { user, organizationIds } = useSelector((state) => state.auth);
  const fileReducer = useSelector((state) => state.file);
  const { selectedFilePaths } = fileReducer;

  useEffect(() => {
    dispatch({ type: "FileUploadReset" });
  }, []);

  useEffect(() => {
    Uploader({
      state,
      dispatch,
      parentType,
      parentId,
      used,
    });
  }, [selectedFilePaths]);

  return (
    <>
      {iconBig ? (
        <>
          <Button
            style={{borderRadius:'2rem'}}
            className={iconWithTextStyle}
            onClick={() => {
              setOpen(true);
            }}
          >
            <AttachFileIcon  style={{borderRadius:'2rem'}} color="primary" className={attachIconStyle} />
            {aditionalText}
          </Button>
        </>
      ) : (
        <>
          {cameraIcon ? (
            <CameraAltIcon
              color="primary"
              className={onlyCameraStyle}
              onClick={() => {
                setOpen(true);
              }}
            />
          ) : (
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => {
                setOpen(true);
              }}
            >
              {isDP ? (
                <PhotoCameraIcon
                  color="primary"
                  className={classes.attachIcon}
                />
              ) : (
                <AttachFileIcon
                  color="primary"
                  className={classes.attachIcon}
                />
              )}
            </IconButton>
          )}
        </>
      )}

      {isCover ? (
        <CoverUploadDialog
          open={open}
          setOpen={setOpen}
          parentType={parentType}
          parentId={parentId}
          used={used}
          isDP={isDP}
          acceptImage={acceptImage}
          user={user}
          uploadImg={uploadImg}
        />
      ) : isDP ? (
        <DpUploadDialog
          open={open}
          setOpen={setOpen}
          parentType={parentType}
          parentId={parentId}
          used={used}
          isDP={isDP}
          acceptImage={acceptImage}
          user={user}
          uploadImg={uploadImg}
        />
      ) : (
        <UploadDialog
          open={open}
          setOpen={setOpen}
          parentType={parentType}
          parentId={parentId}
          used={used}
          isDP={isDP}
          setFilesIds={setFilesIds}
          acceptImage={acceptImage}
          isDocuSignFileTypes={isDocuSignFileTypes}
        />
      )}
    </>
  );
};

export default FileUploadButton;
