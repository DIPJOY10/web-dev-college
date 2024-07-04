/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
// import Api from '../../helpers/Api';
import Api from '../helpers/Api';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {useHistory} from 'react-router-dom';
import {Box, Snackbar, ClickAwayListener} from '@material-ui/core';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  inputPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '19rem',
    marginLeft: '1rem',
    borderRadius: 10,
    paddingLeft: 10,
    [theme.breakpoints.down('sm')]: {
      width: '14rem',
    },
    [theme.breakpoints.down('xs')]: {
      width: '11rem',
      padding: 0,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    color: 'black',
    padding: 10,
  },
}));

export default function SearchUser(props) {
  const classes = useStyles();
  const profile = useSelector((state) => state.profile);
  const {
    searchTerm, entity,
  } = profile;

  const dispatch = useDispatch();
  const history = useHistory();

  const {inputPaper, input} = classes;

  const [users, setUsers] = useState([]);

  const sendQuery = ()=>{
    Api.post('searchPeople/', {
      name: searchTerm,
    }).then((users)=>{
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
    sendQuery();
  }, []);

  const delayedQuery = useCallback(_.debounce((q) => sendQuery(), 500), []);

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      history.push('/search');
      // onSearchClose();
    }
  };

  return (
  // <ClickAwayListener onClickAway={()=>{

    // }}>
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={users}
        onInputChange={(event, value)=>{
          dispatch({
            type: 'AddProfile',
            payload: {
              searchTerm: value,
            },
          });
          delayedQuery(value);
        }}
        onChange={(event, value) => {
          delayedQuery(value);

          dispatch({
            type: 'AddProfile',
            payload: {
              entity: value[0],
            },
          });
        }}

        getOptionLabel={(option) => option.displayName}
        filterSelectedOptions
        renderInput={(params) => (
          <Paper component="form" className={classes.inputPaper} ref={params.InputProps.ref}>

            <IconButton  className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>

            <InputBase
              {...params}

              className={classes.input}
              // onKeyDown={onKeyDown}
              placeholder="Search People"
              inputProps={{'aria-label': 'Search people', ...params.inputProps}}
              value={searchTerm}

            />
           

           
          </Paper>
        )}
        renderOption={(option, state)=>{
          return <ListItem onClick={()=>{
            switch (option.model) {
              case 'User':

                break;

              case 'Organization':

                break;

              default:
                break;
            }
          }}>
            <ListItemAvatar>
              <Avatar src={option.displayPicture.thumbUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={option.displayName}
              secondary={option.model}
            />
          </ListItem>;
        }}
      />
    </div>
    // </ClickAwayListener>
  );
}
