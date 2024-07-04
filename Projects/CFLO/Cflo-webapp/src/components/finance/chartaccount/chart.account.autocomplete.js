/* eslint-disable no-use-before-define */
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
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
    height: '2.5rem',
    padding: '2px 1rem',
    display: 'flex',
    alignItems: 'center',
    width: '14rem',
    borderRadius: 5,
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


const filter = createFilterOptions();

export default function FreeSoloCreateOption(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);

  const {
    chartAccounts,
    account,
    setAccount,
  } = props;


  return (
    <Autocomplete
      value={account}
      onChange={(event, newValue) => {
        setAccount(newValue);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={chartAccounts}
      getOptionLabel={(option) => {
        return option.name;
      }}
      renderOption={(option) => option.name}
      style={{width: 300}}
      freeSolo
      renderInput={(params) => (
        <Paper component="form" className={classes.inputPaper} ref={params.InputProps.ref}>
          <InputBase
            {...params}
            className={classes.input}
            placeholder={'Select Chart Account'}
            inputProps={{'aria-label': 'Select Chart Account'}}
            {...params.inputProps}
          />
        </Paper>
      )}
    />
  );
}
