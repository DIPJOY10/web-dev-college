import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '../profile/avatar';
import Typography from '@material-ui/core/Typography';

import moment from 'moment';
import FilesObjectViewer from '../file/Viewer/FilesObjectViewer';

const useStyles = makeStyles((theme) => ({
    row : {
      display : 'flex',
      flexDirection : 'row',
      alignItems: 'center',
      maxWidth :'40rem'
    },

    boxStyle:{
      margin:'0.5rem',
      display : 'flex',
      maxWidth :'40rem',
    },

    col : {
      display : 'flex',
      flexDirection : 'column',
      flexWrap : 'wrap',
    },
    avatarStyle: {
       height:'35px',
       width:'35px',
       borderRadius: "5px",
       marginRight:'1rem',
       marginTop : "5px"
    },
    nameText: {

    },
    msgText : {
      fontSize : "14px"
    },
    timeText: {
       fontSize:'0.8rem',
       marginLeft:'5px',
       fontWeight:'600',
       color:'#8c9191'
    },
    textStyle:{
      textWrap:''
    }
}));

const ChatMsgSlack = (props) => {
  const classes = useStyles();
  const { 
    profile, message
  } = props;

  const {
    row, col, boxStyle, avatarStyle, nameText, timeText
  } = classes;

  const parent = profile?.parent

  return (
    <div className={cx(col)}>
      <div className={boxStyle} >
        <Avatar variant="square" src={parent} className={avatarStyle} />

        <div className={col}>
          <div className={row}>
            <Typography className={nameText}>
              <b>{parent?.displayName}</b>

            </Typography>
            <Typography className={timeText}>
              {moment(message?.createdAt).format('hh:mm a')}
            </Typography>
          </div>

          <Typography className={classes.msgText} >
            {message?.text}
          </Typography>
        </div>

      </div>

      {message?.files?.length>0?
        <FilesObjectViewer files={message.files} />
      :null}
    </div>
  );
};

export default ChatMsgSlack;


