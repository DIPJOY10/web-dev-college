import firebase from 'firebase';
import Api from '../../../helpers/Api';
import {nanoid} from 'nanoid';
import {onFileUpload} from '../fileUtils';
import FirebaseUploader from './FirebaseUploader';
import S3Uploader from './S3Uploader';

const Uploader = ({
  state,
  dispatch,
  parentType,
  parentId,
  used,
})=>{
  const {file} = state;

  const {
    selectedFilePaths,
    selectedFileDictionary,
  } = file;

  const newPaths = selectedFilePaths.filter((filePath)=>{
    const percentageObject = file[filePath];
    // console.log(percentageObject,' is the percentage object')
    if (percentageObject) {
      return false;
    }
    else {
      return true;
    }
  });

  if (newPaths.length>0) {
    // console.log(newPaths,' is the new path')

    const promises = newPaths.map((filePath)=>{
      const image = selectedFileDictionary[filePath];
      return S3Uploader({
        filePath,
        image,
        state,
        dispatch,
        parentType,
        parentId,
        used,
      });
    });

    Promise.allSettled(promises).
        then((results) =>{
          const successFiles = results.filter((result)=>result.status==='fulfilled');
          const fileAndPaths = successFiles.map((result)=>result.value);
          if (fileAndPaths.length>0) {
            onFileUpload(fileAndPaths, file, dispatch);
          }
        });
  }
};

export default Uploader;
