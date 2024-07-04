import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import Paper from "@material-ui/core/Paper";
import { onSelectFiles } from "../fileUtils";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CloudUpload } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  dragNdrop: (props) => ({
    height: "25rem",
    padding: "6rem",
    border: "4px dashed #82C3EC",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "&:hover": {
      backgroundColor: '#BFEAF5',
      border: "4px dashed #2296f3",
    }
  }),
  icon:{
    fontSize:'10rem',
    color: theme.palette.primary.main,
  }
}));

const UploadZone = ({
  parentType,
  acceptImage,
  isDP,
  styleBody,
  isDocuSignFileTypes,
}) => {
  const classes = useStyles({ styleBody });
  const { dragNdrop,icon } = classes;
  const dispatch = useDispatch();
  const file = useSelector((state) => state.file);

  const { selectedFilePaths } = file;

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      if (isDP) {
        const lastFile = acceptedFiles.slice(-1);
        dispatch({ type: "FileUploadReset" });
        onSelectFiles(lastFile, file, dispatch);
      } else {
        onSelectFiles(acceptedFiles, file, dispatch);
      }
    },
    [selectedFilePaths]
  );
  const docuSignFileOptions = {
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "text/html": [".html", ".htm"],
      "application/msword": [".doc", ".docm"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/pdf": [".pdf"],
      "application/rtf": [".rtf"],
      "text/plain": ["txt"],
      "application/xhtml+xml": [".xhtml"],
      "image/bmp": [".bmp"],
      "image/bmp": [".gif"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/tiff": [".tiff"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls", ".xlsm"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  };
  let options = acceptImage
    ? {
        onDrop,
        accept: "image/*",
      }
    : {
        onDrop,
      };
  options = isDocuSignFileTypes ? docuSignFileOptions : options;
  const { getRootProps, getInputProps } = useDropzone(options);

  return (
    <div {...getRootProps()} className="uploader">
      <div className={dragNdrop}>
        <input {...getInputProps()} multiple={!isDP} />
        <CloudUpload className={icon}/>
        {acceptImage ? (
          <p>Drag 'n' drop some images here, or click to select</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
