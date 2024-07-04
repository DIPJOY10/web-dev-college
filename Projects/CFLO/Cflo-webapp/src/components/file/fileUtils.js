import Api from "../../helpers/Api";
import arrayToReducer from "../../helpers/arrayToReducer";

const _ = require("lodash");

export const updateFiles = (fileIds, updateObject, fileReducer, dispatch) => {
  if (fileIds.length > 0) {
    const fileObjects = fileIds.map((fileId) => {
      return {
        _id: fileId,
        ...updateObject,
      };
    });

    Api.post("file/updateFiles", {
      files: fileObjects,
    }).then((res) => {
      const files = res.result;
      setFiles(files, fileReducer, dispatch);
    });
  }
};

export const setFiles = (files, fileReducer, dispatch) => {
  const { fileDictionary } = fileReducer;
  const { newDict } = arrayToReducer(files);
  dispatch({
    type: "AddFile",
    payload: {
      fileDictionary: {
        ...fileDictionary,
        ...newDict,
      },
    },
  });
};

export const onSelectFiles = (files, fileReducer, dispatch) => {
  const { selectedFilePaths, selectedFileDictionary } = fileReducer;

  const newFileIds = [];
  const newFileDictionary = {};

  files.map((file) => {
    const filePath = file.name + file.size;
    const percentageObject = fileReducer[filePath];
    if (percentageObject) {
    } else {
      newFileIds.push(filePath);
      newFileDictionary[filePath] = file;
    }
  });

  const newSet = new Set(_.concat(selectedFilePaths, newFileIds));

  dispatch({
    type: "AddFile",
    payload: {
      selectedFilePaths: Array.from(newSet),
      selectedFileDictionary: {
        ...selectedFileDictionary,
        ...newFileDictionary,
      },
    },
  });
};

export const onFileUpload = (fileAndPaths, fileReducer, dispatch) => {
  const { selectedFilePaths, fileDictionary, createdFileIds } = fileReducer;
  const filePaths = fileAndPaths.map((f) => f.filePath);
  const files = fileAndPaths.map((f) => f.file);
  const fileIds = files.map((f) => f._id);
  const newSelectedFilePaths = _.difference(selectedFilePaths, filePaths);
  const newCreatedFileIds = _.concat(createdFileIds, fileIds);
  const newFileDictionary = {};
  files.map((file) => {
    const fileId = file._id;
    newFileDictionary[fileId] = file;
  });

  dispatch({
    type: "AddFile",
    payload: {
      selectedFilePaths: newSelectedFilePaths,
      createdFileIds: newCreatedFileIds,
      fileDictionary: {
        ...fileDictionary,
        ...newFileDictionary,
      },
    },
  });
};
