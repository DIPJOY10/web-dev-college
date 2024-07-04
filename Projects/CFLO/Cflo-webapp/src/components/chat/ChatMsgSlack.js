import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import defaultChatMsgStyles from './DefaultMsgStyle';
import moment from 'moment';
import FilesViewer from '../file/Viewer/FilesViewer';

const ChatMsgSlack = withStyles(defaultChatMsgStyles, {name: 'ChatMsgSlack'})((props) => {
  const {
    classes,
    user,
    messages,
    fullTime,
    showUserName,
    GridContainerProps,
    GridItemProps,
    AvatarProps,
    getTypographyProps,
  } = props;

  const attachClass = (index) => {
    if (index === 0) {
      return classes[`leftFirst`];
    }
    if (index === messages.length - 1) {
      return classes[`leftLast`];
    }
    return '';
  };
  return (
    <Grid
      container
      spacing={2}
      justify={'flex-start'}
      {...GridContainerProps}
      className={classes[`block`]}
    >
      {(
        <Grid item {...GridItemProps}>
          <Avatar
            src={user?.displayPicture?.thumbUrl}
            {...AvatarProps}
            className={cx(classes.avatar, AvatarProps.className)}
          />
        </Grid>
      )}
      {(<Grid item xs={9} sm={9} md={7} lg={9}>
        {messages.map((msg, i) => {
          // const TypographyProps = getTypographyProps(msg.text, i, props);

          const msgId = msg?._id?msg._id:i;

          return (

            <div key={msgId} >

              {/* <Typography
                align={'left'}
                {...TypographyProps}
                component={'span'}
                className={cx(
                  classes.msg,
                  classes["left"],
                  attachClass(i),
                  TypographyProps.className
                )}
              > */}

              {/* {user?.displayName} */}
              {/* {true?<Typography variant="overline" display="block">
                                {user?.displayName}
                </Typography> :null} */}

              {msg.text.split(/\n/).map((para, index)=>{
                return <Typography>{para}</Typography>;
              })}
              <Typography className={classes[`leftTimeText`]}>
                {fullTime?moment(msg.createdAt).format('MMM Do YYYY, hh:mm a'):moment(msg.createdAt).format('hh:mm a')}
              </Typography>
              {/* </Typography> */}
              {/* {msg?.files?.length>0?<FilesViewer fileIds={msg.files} />:null} */}
            </div>
          );
        })}
      </Grid>
      )}
    </Grid>
  );
});


ChatMsgSlack.propTypes = {
  avatar: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(['left', 'right']),
  GridContainerProps: PropTypes.shape({}),
  GridItemProps: PropTypes.shape({}),
  AvatarProps: PropTypes.shape({}),
  getTypographyProps: PropTypes.func,
};
ChatMsgSlack.defaultProps = {
  avatar: '',
  messages: [],
  side: 'left',
  GridContainerProps: {},
  GridItemProps: {},
  AvatarProps: {},
  getTypographyProps: () => ({}),
};


export default ChatMsgSlack;
