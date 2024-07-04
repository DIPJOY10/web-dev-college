import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FilesViewer from '../../file/Viewer/FilesViewer';
import FileUploadButton from '../../file/Uploader/FileUploadButton';
import Api from '../../../helpers/Api';
import {setInvestments} from './investment.utils';

const useStyles = makeStyles((theme) => ({
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
    flexWrap: 'wrap',
  },
}));

const HandleFiles = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    investmentId,
  } = props;
    // console.log(investmentId,' is the investment Id')
  const dashboard = useSelector((state) => state.dashboard);

  const {
    investmentDictionary,
  } = dashboard;

  const file = useSelector((state) => state.file);

  const {createdFileIds} = file;

  const investment = investmentDictionary[investmentId];
  const oldFileIds = investment?.files?investment.files:[];

  useEffect(() => {
    update();
  }, [createdFileIds]);

  const fileSet = new Set([...oldFileIds, ...createdFileIds]);
  const files = Array.from(fileSet);

  const update = ()=>{
    Api.post('investment/update', {
      ...investment,
      files,
    }).then((investment)=>{
      setInvestments([investment], dashboard, dispatch );
    });
  };

  return (
    <div>
      <div className={classes.row}>
        <Typography variant="h6" gutterBottom className={classes.paperText}>
                    Upload Files
        </Typography>
        <FileUploadButton
          parentType='investment'
          used={true}
          parentId={investmentId}
        />
      </div>
      <div className={classes.row}>
        <FilesViewer fileIds={files}/>
      </div>
    </div>

  );
};

export default HandleFiles;
