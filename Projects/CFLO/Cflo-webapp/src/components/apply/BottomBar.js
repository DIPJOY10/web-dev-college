import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';
import Api from '../../helpers/Api';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import {HandleAppComments, setApps} from './apply.utils';
import {
  useHistory,
} from 'react-router-dom';
import FilesViewer from '../file/Viewer/FilesViewer';

const attachBarWidthRem = 2;
const sendBarWidthRem = 3;
const minusTotalWidth = attachBarWidthRem + sendBarWidthRem;


const useStyles = makeStyles((theme) => ({
  bottomBar: {
    flex: 1,
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    minHeight: '4rem',
    maxHeight: '7rem',
    backgroundColor: 'white',
    position: 'fixed',
    zIndex: theme.zIndex.appBar,
    bottom: 0,
    boxShadow: '0 2px 3px 3px #eeeeee',
  },
  attachBar: {
    width: '4rem',
    display: 'flex',
    height: '100%',
    padding: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachIcon: {
    fontSize: 26,
  },
  textAreaBar: {
    width: '35rem',
    paddingLeft: '1rem',
    paddingTop: '0.8rem',
    fontSize: 16,
    color: '#424242',
  },
  sendBar: {
    width: '4rem',
    height: '4rem',
    alignSelf: 'center',
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    right: 0,

  },
  sendIcon: {
    fontSize: 34,
  },
}));

const BottomBar = (props)=>{
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [text, setText] = useState('');
  const state = useSelector((state) => state);
  const {user} = useSelector((state)=>state.auth);
  const {appId} = props;
  const dashboard = useSelector((state)=>state.dashboard);
  const {investmentDictionary, jobDictionary, appDictionary} = dashboard;
  const app = appDictionary[appId];
  const {createdFileIds} = useSelector((state)=>state.file);
  const userId = user._id;
  let parent;
  let profile;

  if (app) {
    const {parent: parentId, parentModelName} = app;
    // console.log(app,' is the app')


    switch (parentModelName) {
      case 'Investment':
        parent = investmentDictionary[parentId];
        break;

      case 'Job':
        parent = jobDictionary[parentId];
        break;

      default:
        break;
    }

    profile = parent?.owner?.profile;
  }


  const sendMessage = ()=>{
    const commentObject = {
      text,
      profile,
      user: userId,
      userModelName: user.model,
      parent: appId,
      parentModelName: 'Application',
      files: createdFileIds,
    };


    Api.post('comment/create', commentObject)
        .then((res)=>{
          const {comment, parent: appUpdated} = res.result;


          const newApp = {
            ...app,
            numComments: appUpdated.numComments,
          };

          setApps([newApp], dashboard, dispatch);
          HandleAppComments(appId, true, [comment], state, dispatch);
          setText('');
        });
  };

  return (
    <div className={classes.bottomBar}>

      <div className={classes.attachBar}>
        <FileUploadButton
          parentType='Comment'
          used={false}
          parentId={null}
        />
        {/* <AttachFileIcon color="primary" className={classes.attachIcon} />                                */}
      </div>


      <div
        className={classes.textBar}>

        <InputBase
          multiline
          rowsMax={5}
          value={text}
          placeholder={'Start your message here'}
          onChange={(event)=>setText(event.target.value)}
          className={classes.textAreaBar}
        />
        <FilesViewer fileIds={createdFileIds} />
      </div>


      <ButtonBase className={classes.sendBar} onClick={()=>{
        if (appId) {
          sendMessage();
        }
      }}>
        <div>
          <SendIcon color="primary" className={classes.sendIcon} />
        </div>
      </ButtonBase>


    </div>

  );
};

export default BottomBar;
