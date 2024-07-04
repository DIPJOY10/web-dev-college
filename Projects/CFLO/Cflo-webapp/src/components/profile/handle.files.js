import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FilesViewer from '../file/Viewer/FilesViewer';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import Api from '../../helpers/Api';
import {setUserProfiles} from './profile.utils';

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
    profileId,
  } = props;
    // console.log(profileId,' is the profile Id')
  const auth = useSelector((state) => state.auth);

  const {
    profileDictionary,
  } = auth;

  const file = useSelector((state) => state.file);

  const {createdFileIds} = file;

  const profile = profileDictionary[profileId];
  const oldFileIds = profile?.files?profile.files:[];

  useEffect(() => {
    update();
  }, [createdFileIds]);

  const fileSet = new Set([...oldFileIds, ...createdFileIds]);
  const files = Array.from(fileSet);

  const update = ()=>{
    Api.post('profile/update', {
      ...profile,
      files,
    }).then((profile)=>{
      setUserProfiles([profile], auth, dispatch );
    });
  };

  return (
    <div>
      <div className={classes.row}>
        <Typography variant="h6" gutterBottom className={classes.paperText}>
                    Upload Files
        </Typography>
        <FileUploadButton
          parentType='profile'
          used={true}
          parentId={profileId}
        />
      </div>
      <div className={classes.row}>
        <FilesViewer fileIds={files}/>
      </div>
    </div>

  );
};

export default HandleFiles;
