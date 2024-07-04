import React, {useRef, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {AppBar, Divider, Toolbar, IconButton, Typography, useScrollTrigger, useMediaQuery} from '@material-ui/core';


import SearchBar from './SimpleSearchBar';
import {useParams, useHistory} from 'react-router-dom';
import Menubar from './menubar';
import Notification from './notification';
import PipeSvg from '../../Assets/pipe.svg';
import Setting from './settings';
const drawerWidth = '17rem';
const foldedWidth = '6rem';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 0,
    flexDirection: 'column',
  },
  appBarStyle: {
    borderColor: 'grey',

    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth})`,
      marginLeft: drawerWidth,
    },
    [theme.breakpoints.only('sm')]: {
      width: `calc(100% - ${foldedWidth})`,
      marginLeft: foldedWidth,
    },
  },
  searchContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBorder: {
    borderBottomColor: '#d9d9d9',
  },
  menuButton: {
    marginTop: '-2px',
    marginRight: 0,
    [theme.breakpoints.down('sm')]: {
      marginRight: '-0.6rem',
    },
    [theme.breakpoints.down('xs')]: {
      marginRight: '-1.05rem',
    },
  },

  toolbar: {
    backgroundColor: 'white',
    borderColor: 'grey',
    flex: 1,
    flexDirection: 'row-reverse',
    marginTop: '-0.3rem',
  },

  pipeImg: {
    height: '2rem',
    width: '2rem',
  },

  divider: {
    height: '1px',
    width: '100%',
    backgroundColor: 'grey',
  },
}));

export default function MenuAppbar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [isSearchShowingInMobile, setSearchShowing] = useState(false);
  const profileMenuRef = useRef();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const {user} = useSelector((state) => state.auth);
  const displayPicture = user && user.displayPicture ? user.displayPicture.thumbUrl : null;
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <div className={classes.grow}>
      <AppBar elevation={trigger ? 4 : 0} className={classes.appBarStyle}>
        <Toolbar className={classes.toolbar}>
          <Setting />

          <Notification />

          {/* <IconButton
            aria-label="goto pipeline"
            color="inherit"
            className={classes.menuButton}
            onClick={() => {
              history.push('/pipeline/manage');
            }}
          >
            <img src={PipeSvg} className={classes.pipeImg} />
          </IconButton> */}

          <div className={classes.searchContainerStyle}>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearchClose={() => setSearchShowing(false)} />
          </div>
        </Toolbar>
        <div className={classes.divider}></div>
        <Menubar {...props} />
      </AppBar>
    </div>
  );
}
