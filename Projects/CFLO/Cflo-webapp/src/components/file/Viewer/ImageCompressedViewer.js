import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FileView from "./FileView";
import GalleryViewer from "./GalleryViewer";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../../helpers/Api";
import { setFiles } from "../fileUtils";

const useStyles = makeStyles({
  row: {
    width:'60rem',
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "left",
    paddingTop:'1rem'
  },
  col: {
    display: "flex",
    flexDirection: "column",
  },
  blackBox: {
    width: "4rem",
    height: "4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    "& $p": {
      fontSize: "1.3rem",
    },
    textAlign: "center",
    cursor: "pointer",
    borderRadius: "5px",
  },
});

const ImageCompressedViewer = (props) => {
  const classes = useStyles();
  const fileReducer = useSelector((state) => state.file);
  const dispatch = useDispatch();
  const { row, col, blackBox } = classes;
  const { fileIds, handler } = props;
  const { fileDictionary } = fileReducer;

  useEffect(() => {
    const newFileIds = fileIds.filter((fileId) => {
      return fileDictionary[fileId] ? false : true;
    });

    Api.post("file/get", { files: newFileIds }).then((res) => {
      const { result: files } = res;
      setFiles(files, fileReducer, dispatch);
    });
  }, []);

  const ImageFileIds = [];

  (fileIds || []).map((fileId) => {
    const file = fileDictionary[fileId];
    if (file && file?._id) {
      ImageFileIds.push(fileId);
    }
  });
  // console.log("file  dict = ", fileDictionary);

  return (<>
    <div className={col}>
    <div style={{ color: "black",
    fontWeight: "normal",paddingTop:'2rem',marginLeft:'-1rem'}}><h2 style={{ color: "black",
    fontWeight: "normal",}}>SnapShots</h2></div>
      {ImageFileIds.length > 0 ? (
        <div>
          {ImageFileIds.length <= 3 ? (
            <div className={row}>
              {ImageFileIds.map((fileId) => {
                return (
                  <FileView
                    key={fileId}
                    fileId={fileId}
                    styleBody={{
                      height: "15rem",
                      width: "18rem",
                      cursor: "pointer",
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className={row}>
              {ImageFileIds.slice(0, 3).map((fileId) => {
                return (
                  <FileView
                    key={fileId}
                    fileId={fileId}
                    styleBody={{
                      height: "20rem",
                      width: "20rem",
                      cursor: "pointer",
                    }}
                  />
                );
              })}
              <div className={blackBox} onClick={handler}>
                <p>+{ImageFileIds.length - 3}</p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
    </> );
};

export default ImageCompressedViewer;
