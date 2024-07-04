import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({

});

const FilesViewer = (props) => {
    
  const classes = useStyles();
  const fileReducer = useSelector((state) => state.file);
  const dispatch = useDispatch();
  const { row, col } = classes;
  const { fileIds, isGallery, deletable, handler } = props;
  const { fileDictionary } = fileReducer;

  useEffect(() => {
    console.log(fileIds);
    const newFileIds = fileIds.filter((fileId) => {
      return fileDictionary[fileId] ? false : true;
    });

    Api.post("file/get", { files: newFileIds }).then((res) => {
      const { result: files } = res;
      setFiles(files, fileReducer, dispatch);
    });
  }, []);

  const ImageFileIds = [];
  const DocFileIds = [];

  (fileIds || []).map((fileId) => {
    const file = fileDictionary[fileId];
    if (file && file?._id) {
      if (file.type.startsWith("image/")) {
        ImageFileIds.push(fileId);
      } else {
        DocFileIds.push(fileId);
      }
    }
  });
  // console.log("file  dict = ", fileDictionary);

  return (
    <div className={col}>
      {DocFileIds.length > 0 ? (
        <div className={col}>
          {DocFileIds.map((fileId) => {
            return (
              <FileView
                key={fileId}
                fileId={fileId}
                styleBody={props.styleBody}
              />
            );
          })}
        </div>
      ) : null}

      {ImageFileIds.length > 0 ? (
        <div className={row}>
          {!isGallery ? (
            ImageFileIds.map((fileId) => {
              return (
                <FileView
                  key={fileId}
                  fileId={fileId}
                  styleBody={props.styleBody}
                  deletable={deletable}
                  handler={handler}
                />
              );
            })
          ) : (
            <GalleryViewer images={ImageFileIds} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FilesViewer;
