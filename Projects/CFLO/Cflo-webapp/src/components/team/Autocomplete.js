/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Api from '../../helpers/Api';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
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
    width: '20rem',
    borderRadius: 10,
    paddingLeft: 10,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

export default function MemberAutoComplete(props) {
  const classes = useStyles();
  const team = useSelector((state) => state.team);
  const {selectedMembers, selectedMemberIds} = team;
  const dispatch = useDispatch();
  const {inputPaper, input} = classes;
  const {setParticipants, setAllTimeMembers} = props;
  const [text, setText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [users, setUsers] = useState([]);

  const sendQuery = () => {
    Api.post('searchPeople/', {
      name: text,
    }).then((users) => {
      setUsers(users);
    });
  };

  useEffect(() => {
    sendQuery();
    dispatch({
      type: 'AddTeam',
      payload: {
        selectedMemberIds: [],
        selectedMembers: [],
      },
    });
  }, []);

  const delayedQuery = useCallback(
      _.debounce((q) => sendQuery(), 500),
      [],
  );

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={users}
        onInputChange={(event, value) => {
          setText(value);
          delayedQuery(value);
        }}
        onChange={(event, value) => {
          const ids = value.map((user) => user._id);
          setSelectedUserIds(ids);

          dispatch({
            type: 'AddTeam',
            payload: {
              selectedMemberIds: _.uniq(ids),
              selectedMembers: _.uniqBy(value, '_id'),
            },
          });
          // console.log(value)
        }}
        getOptionSelected={(option, value) => {
          return !(selectedMemberIds.indexOf(option._id) === -1);
        }}
        getOptionLabel={(option) => option.displayName}
        filterSelectedOptions
        renderTags={(value, getTagProps) => {
          // console.log(value,' is the value')
          return value.map((option, index) => (
            <Chip
              avatar={<Avatar src={option.displayPicture.thumbUrl} />}
              variant="outlined"
              label={option.displayName}
              {...getTagProps({index})}
            />
          ));
        }}
        renderInput={(params) => (
          <Paper component="form" className={classes.inputPaper} ref={params.InputProps.ref}>
            <InputBase
              {...params}
              className={classes.input}
              placeholder="Search People"
              inputProps={{'aria-label': 'Search people'}}
              {...params.inputProps}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        )}
        renderOption={(option, state) => {
          return (
            <ListItem>
              <ListItemAvatar>
                <Avatar src={option.displayPicture.thumbUrl} />
              </ListItemAvatar>
              <ListItemText primary={option.displayName} secondary={option.model} />
            </ListItem>
          );
        }}
      />
    </div>
  );
}
