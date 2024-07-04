import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import FilesViewer from '../file/Viewer/FilesViewer';
import {updateOrg, updateUser} from './profile.utils';
import Api from '../../helpers/Api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

const ChangeDP = (props) => {
  const dispatch = useDispatch();
  const {parent: parentId, parentModelName} = props;
  const {createdFileIds} = useSelector((state) => state.file);
  const auth = useSelector((state) => state.auth);
  const {user, organizationDictionary} = auth;

  let parent = user;

  switch (parentModelName) {
    case 'User':
      parent = user;
      break;

    case 'Organization':
      const organization = organizationDictionary[parentId];
      parent = organization;
      break;

    default:
      break;
  }

  useEffect(() => {
    switch (parentModelName) {
      case 'User':
        Api.post('user/update', {
          _id: parent._id,
          displayPicture: createdFileIds.slice(-1),
        }).then((user) => {
          dispatch({
            type: 'AddAuth',
            payload: {
              user,
            },
          });
          dispatch({type: 'FileUploadReset'});
        });
        break;

      case 'Organization':
        const orgObject = {};

        Api.post('organization/update', {
          _id: parent._id,
          displayPicture: createdFileIds.slice(-1),
        }).then((organization) => {
          orgObject[parentId] = organization;
          dispatch({
            type: 'AddAuth',
            payload: {
              organizationDictionary: {
                ...organizationDictionary,
                ...orgObject,
              },
            },
          });
          dispatch({type: 'FileUploadReset'});
        });
        break;

      default:
        break;
    }
  }, [createdFileIds]);

  const displayPicture = parent?.displayPicture;

  return (
    <div>
      {createdFileIds.length > 0 ? (
        <FilesViewer fileIds={createdFileIds} />
      ) : (
        <Avatar alt="Logo" className={classes.userImage} src={displayPicture?.thumbUrl} />
      )}

      <FileUploadButton parentType={parentModelName} used={true} parentId={parentId} />
    </div>
  );
};

export default ChangeDP;
