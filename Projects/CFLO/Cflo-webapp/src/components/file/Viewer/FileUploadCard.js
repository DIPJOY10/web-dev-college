import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ProgressPie from '../../styled/progress.pie';
import DocSvg from '../../../Assets/FileIcon/doc.svg';
import ImgSvg from '../../../Assets/FileIcon/picture.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    padding: '1rem',
    marginBottom: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textRow: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    textWrap: 'wrap',
    fontWeight: '700',
    marginLeft: '1rem',
    marginRight: '1rem',
  },

  imgStyle: {
    height: '4rem',
    width: '4rem',
  },
}));

export default function FileUploadCard(props) {
  const classes = useStyles();
  const {filePath} = props;
  const fileReducer = useSelector((state) => state.file);
  const {selectedFileDictionary} = fileReducer;

  const file = selectedFileDictionary[filePath];
  const uploadPercentageObject = fileReducer[filePath];
  let percentage = uploadPercentageObject?.percentage;
  percentage = percentage ? percentage : 0;

  const fileUploading = uploadPercentageObject?.file;
  let FileImg = DocSvg;

  if (fileUploading) {
    const imgDataUrl = URL.createObjectURL(fileUploading);

    // console.log(fileUploading.type,fileUploading.type.startsWith('image/'))
    if (fileUploading?.type.startsWith('image/')) {
      FileImg = URL.createObjectURL(fileUploading);
    }
  }

  return (
    <Paper variant="outlined" className={classes.root}>
      <img src={FileImg} className={classes.imgStyle} />

      <Typography variant="body1" className={classes.textRow}>
        {file.name}
      </Typography>

      <ProgressPie progress={percentage} />
    </Paper>
  );
}
