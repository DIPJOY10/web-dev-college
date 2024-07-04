/** *
 * This autocomplete takes in -
 *    walletIds - which define the financial context of the user
 *    addNew - callback
 *    onSelect - callback
 * Then it searches based upon
 *  - Users, Organizations in the Network
 *  - Pals in walletIds scope
 * If user clicks on Add New
 *  - Pal create is started and saved with addNew
 * If user selects the profile on the network
 *  - onSelect is called with selected profile
 *
 */

import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Api from '../../../helpers/Api';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import clsx from 'clsx';


const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root: {

  },
  inputPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '16rem',
    borderRadius: 5,
    paddingLeft: 10,
    [theme.breakpoints.down('sm')]: {
      width: '230px',
    }
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  margin: {
    margin: '1rem',
  },

  dialogTitle: {
    fontWeight: '600',
  },
}));

export default function AddAutocomplete(props) {
  const classes = useStyles();

  const {
    value, 
    text, setText, placeholder,
    getListItem, results, getAddObject, getOptionLabel,
    onSelect, onNew, open,
  } = props;
 
  return (

    <Autocomplete
      id="userpalautocomplete"
      value={value} 
      options={results}
      inputValue={text}
      getOptionLabel={getOptionLabel}
      getOptionSelected={(option) => {
        return option?._id==value?._id;
      }}
      // 
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const addObject = getAddObject(params);
        const newFiltered = [addObject, ...filtered];
        return newFiltered;
      }}


      onChange={(event, value) => {
        if (value?._id=='New') {
          onNew();
        }
        else {
          if (onSelect) {
            onSelect(value);
          }
        }
      }}



      onInputChange={(event, newValue) =>{
        if (newValue.slice(0, 4)=='Add ') {
          setText(newValue.slice(4));
        }
        else {
          if (!open) {
            setText(newValue);
          }
        }
      }}
      renderInput={(params) => (
        <Paper component="form" className={classes.inputPaper} ref={params.InputProps.ref}>
          <InputBase
            {...params}
            className={classes.input}
            placeholder={placeholder?placeholder:'Add Members'}
            inputProps={{'aria-label': 'Add Members'}}
            {...params.inputProps}
          />
          {text.length>0?
                      <IconButton className={classes.iconButton} aria-label="clear-search"
                        onClick={()=>{
                          setText('');
                        }}>
                        <CancelIcon />
                      </IconButton>:null}
        </Paper>
      )}

      renderOption={(option, state)=>{
        if (option) {
          if (option?._id=='New') {
            if (text.length>0) {
              return <div className={classes.row}>
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                  <PersonAddIcon />
                </IconButton>
                <Typography>
                          Add <b>{text}</b>
                </Typography>
              </div>;
            }
            else {
              return null;
            }
          }
          else {
            return getListItem(option);
          }
        }
        else {
          return null;
        }
      }}

    />

  );
}
