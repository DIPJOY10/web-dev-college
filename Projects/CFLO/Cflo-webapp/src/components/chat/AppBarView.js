import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  makeStyles,
  useTheme,

} from '@material-ui/core/styles';
import {
  useMediaQuery,
} from '@material-ui/core';
import {
  useParams,
  useHistory,
} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import {IconButton} from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Toolbar from '@material-ui/core/Toolbar';
import {
  Typography,
} from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'white',
    height: '4rem',
  },
  nameBox: {
    color: '#616161',
    marginTop: '0.5rem',
    marginLeft: '0.8rem',
  },
  avatarStyle: {
    marginTop: '0.5rem',
    fontSize: '0.4rem',
  },
  iconButtonStyle: {
    marginTop: '0.5rem',
    marginRight: '1rem',
    marginLeft: '-1rem',
    color: theme.palette.primary.main,
  },
}));

const AppbarView = (props)=>{
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isOnlyMd = useMediaQuery(theme.breakpoints.only('md'));

  const {userId, displayPicture, displayName, goBack} = props;


  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar variant="dense">
        {
                    isMobile?<IconButton className={classes.iconButtonStyle} onClick={()=>{
                      goBack();
                    }}>
                      <KeyboardBackspaceIcon style={{fontSize: 30, color: theme.palette.primary}} />
                    </IconButton>:null
        }
        {<ButtonBase onClick={()=>{
          const path = '/profile/'+userId;
          history.push(path);
        }}>
          <Avatar alt={displayName}
            src={displayPicture?.thumbUrl}
            className={classes.avatarStyle}/>
          <Typography className={classes.nameBox}>
            {displayName}
          </Typography>
        </ButtonBase>}


      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
