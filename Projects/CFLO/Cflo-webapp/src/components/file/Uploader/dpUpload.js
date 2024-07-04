import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useDropzone} from 'react-dropzone';
import Paper from '@material-ui/core/Paper';
import {onSelectFiles} from '../fileUtils';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({

  dragNdrop: {
    height: '2.6rem',
    width: '2.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    opacity: '0.7',
    borderRadius: '1.3rem',
  },

}));

const UploadZone = ({
  setImage,
  isUploading,
}) => {
  const classes = useStyles();
  const {dragNdrop} = classes;

  const onDrop = useCallback(
      async (acceptedFiles, rejectedFiles) => {
        const lastFile = acceptedFiles.slice(-1);
        setImage(lastFile[0]);
        isUploading(true);
      },
      [],
  );

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()} className="uploader">
      <div className={dragNdrop}>
        <input {...getInputProps()} />
        <AddAPhotoIcon />
      </div>
    </div>
  );
};

export default UploadZone;
