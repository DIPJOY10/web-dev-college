import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {makeStyles} from '@material-ui/core/styles';
import Api from '../../../helpers/Api';
import {setFiles} from '../fileUtils';

const useStyles = makeStyles({
  imgStyle: (props)=>({
    height: props.height,
    width: props.width,
  }),

});


const DPImage = (props)=>{
  const classes = useStyles(props);
  const fileReducer = useSelector((state) => state.file);
  const dispatch = useDispatch();
  const {row, col} = classes;
  const {fileId} = props;
  const {
    fileDictionary,
  } = fileReducer;


  const file = fileDictionary[fileId];

  useEffect(() => {
    if (file?._id&&fileId) {
      Api.post('file/get', {files: [fileId]})
          .then((res)=>{
            const {result: files} = res;
            setFiles(files, fileReducer, dispatch);
          });
    }
  }, []);


  // console.log(' in the filesviewew ',fileIds, ImageFileIds, DocFileIds);
  return (
    <img
      className={classes.imgStyle}
      src={file?.url}
    />
  );
};

export default DPImage;
