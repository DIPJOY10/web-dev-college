import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FileUploadCard from "./FileUploadCard";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function FileUploadingView(props) {
  const classes = useStyles();
  const { filePath } = props;
  const fileReducer = useSelector((state) => state.file);
  const { selectedFilePaths } = fileReducer;

  return (
    <div className={classes.root}>
      {selectedFilePaths.map((filePath, index) => {
        const uploadPercentageObject = fileReducer[filePath];
        if (uploadPercentageObject) {
          const percentage = uploadPercentageObject["percentage"];
          if (percentage == 100) {
            return null;
          } else {
            return <FileUploadCard key={index} filePath={filePath} />;
          }
        } else {
          return <FileUploadCard key={index} filePath={filePath} />;
        }
      })}
    </div>
  );
}
