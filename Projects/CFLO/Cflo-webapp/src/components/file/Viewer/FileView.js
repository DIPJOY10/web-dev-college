import React from "react";
import { useSelector, useDispatch } from "react-redux";
import DocCard from "./DocCard";
import ImageCard from "./ImageCard";

const FileView = (props) => {
  const fileReducer = useSelector((state) => state.file);
  const { fileDictionary } = fileReducer;
  const {
    fileId: fileIdProp,
    fileObject = false,
    file: fileProp = {},
    styleBody,
    deletable,
    handler,
  } = props;
  const fileId = fileObject ? fileProp?._id : fileIdProp;

  const file = fileObject ? fileProp : fileDictionary[fileId];
  // console.log("here = ", file?.type);
  const type = file?.type;
  let fileType = "doc";
  let fileView = <DocCard fileId={fileId} />;

  if (type && type.slice(0, 5) == "image") {
    fileType = "image";
  }

  switch (fileType) {
    case "image":
      fileView = (
        <ImageCard
          fileId={fileId}
          styleBody={styleBody}
          fileObject={fileObject}
          file={file}
          deletable={deletable}
          handler={handler}
        />
      );
      break;

    case "doc":
      fileView = (
        <DocCard
          fileId={fileId}
          fileObject={fileObject}
          file={file}
          deletable={deletable}
          handler={handler}
        />
      );
      break;
  }
  //     return <Microlink
  //     url={file.url}

  return <>{fileView}</>;
};

export default FileView;
