import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Search as SearchIcon, CloseOutlined as CloseOutlinedIcon} from '@material-ui/icons';
import {Box, InputBase, IconButton, Snackbar, ClickAwayListener} from '@material-ui/core';
import {useTheme} from '@material-ui/styles';
import Api from '../../helpers/Api';
import _ from 'lodash';
import {useHistory, useLocation} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  search: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '300px',
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.shortest,
    }),
    [theme.breakpoints.up('sm')]: {},
    marginLeft: theme.spacing(1),
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#616161',
  },

  iconStyle: {
    color: '#616161',
  },

  inputRoot: {
    flex: 1,
    alignItems: 'center',
  },
  inputInput: {
    width: '100%',
  },
}));

const SearchBar = ({onSearchClose, searchPlaceholder}) => {
  const classes = useStyles();
  const theme = useTheme();
  const profile = useSelector((state) => state.profile);
  const {searchTerm, entity, lastSearchedAt} = profile;

  const [isFocussed, setFocussed] = useState(false);
  const [isShowingToast, showToast] = useState(false);
  const SearchPlaceholder = searchPlaceholder || 'Search';
  const dispatch = useDispatch();
  const history = useHistory();
  const [users, setUsers] = useState([]);

  const location = useLocation();

  const sendQuery = () => {
    Api.post('searchPeople/', {
      name: searchTerm,
    }).then((users) => {
      setUsers(users);
      dispatch({
        type: 'AddProfile',
        payload: {
          entities: users,
        },
      });
    });
  };

  useEffect(() => {
    sendQuery(searchTerm);
  }, []);

  useEffect(() => {
    if (searchTerm && searchTerm.length > 1) {
      const now = new Date();
      if(lastSearchedAt){
        const diff = now - lastSearchedAt
        if(diff>300){}else{
          history.push('/search');
        }
      }else{
        history.push('/search');

      }

    }
  }, [searchTerm]);

  const delayedQuery = useCallback(
      _.debounce((q) => sendQuery(), 300),
      [searchTerm],
  );

  const onSearchCancel = () => {
    dispatch({
      type: 'AddProfile',
      payload: {
        searchTerm: '',
      },
    });

    const pathname = location['pathname'];
    const isSearch = pathname.slice(1) === 'search';

    if (isSearch) {
      history.goBack();
    }
  };

  const onChange = (e) => {
    dispatch({
      type: 'AddProfile',
      payload: {
        searchTerm: e.target.value,
        lastSearchedAt: new Date()
      },
    });

    delayedQuery(e.target.value);
  };

  const onSearch = (event) => {
    setFocussed(true);
    if (event.key === 'Enter') {
      //   showToast(true);
      setFocussed(false);
      history.push('/search');
      // onSearchClose();
    }
  };
  const onFocusLoss = () => {
    // onSearchClose();
    setFocussed(false);
  };
  const handleToastClose = () => {
    showToast(false);
  };

  return (
    <ClickAwayListener onClickAway={onFocusLoss}>
      <Box
        className={classes.search}
        borderRadius={16}
        bgcolor={isFocussed ? theme.palette.background.default : theme.palette.background.highlight}
        boxShadow={isFocussed ? 2 : 0}
        height={'3rem'}
      >
        <div className={classes.searchIcon}>
          <SearchIcon className={classes.iconStyle} />
        </div>
        <InputBase
          placeholder={SearchPlaceholder}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          value={searchTerm}
          onChange={onChange}
          onClick={() => setFocussed(true)}
          inputProps={{'aria-label': 'search'}}
          onKeyDown={onSearch}
        />
        {isFocussed ? (
          <IconButton hidden={!isFocussed} onClick={onSearchCancel}>
            <CloseOutlinedIcon htmlColor={theme.palette.main} />
          </IconButton>
        ) : null}
        <Snackbar open={isShowingToast} message={'Search not implemented ;)'} autoHideDuration={2000} onClose={handleToastClose} />
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
