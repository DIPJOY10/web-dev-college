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
import Api from '../../helpers/Api';
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
import PalForm from './palForm';


const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root: {

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

export default function AddMember(props) {
  const classes = useStyles();

  const {
    row, center, margin, dialogTitle,
  } = classes;
  const {
    participant, onSelect, placeholder, walletIds,
  } = props;

  const {user, userProfile} = useSelector((state) => state.auth);
  const [text, setText] = useState('');
  const [users, setUsers] = useState([]);
  const [pals, setPals] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pal, setPal] = useState({
    isPerson: false,
    displayName: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    parent: user._id,
    parentModelName: user.model,
    user: user.model === 'User'? user._id: userProfile._id,
  });

  const sendQuery = ()=>{
    Api.post('searchPeople/', {
      name: text,
    }).then((users)=>{
      setUsers(users);
    });
  };

  useEffect(() => {
    sendQuery();
    // get user create accounts
    Api.post('pal/getPals', {
      parent: user._id,
      parentModelName: user.model,
    }).then((pals)=>{
      setPals(pals);
      // console.log(pals,' is the pals')
    });
  }, []);

  const delayedQuery = useCallback(_.debounce((q) => sendQuery(), 500), []);

  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  return (
    <>
      <Autocomplete
        id="userpalautocomplete"
        value={participant}
        inputValue={text}
        options={_.concat(users, pals)}
        getOptionLabel={(option) => {
          return option&&option?.parent?option?.parent?.displayName:'';
        }}
        onChange={(event, value) => {
          // if add new option selected, open dialog
          // else call onSelect
          if (value?._id=='New') {
            setPal({
              ...pal,
              displayName: text,
            });
            setOpen(true);
          }
          else {
            if (onSelect) {
              onSelect(value);
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const newFiltered = [{
            _id: 'New',
            parent: {
              displayName: `Add ${params.inputValue}`,
            },
          }, ...filtered];


          return text.length>0?newFiltered:filtered;
        }}
        onInputChange={(event, newValue) =>{
          setText(newValue);
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
                      </IconButton>:<IconButton className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                      </IconButton>}

          </Paper>
        )}

        renderOption={(option, state)=>{
          if (option) {
            if (option?._id=='New') {
              if (text.length>0) {
                return <div className={row}>
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
              return <div className={row}>
                <ListItemAvatar>
                  <Avatar src={
                              option?.parent?.displayPicture?.thumbUrl?
                              option.parent.displayPicture.thumbUrl:option?.parent?.displayPicture?.url} alt={option?.parent?.displayName} />
                </ListItemAvatar>
                <ListItemText
                  primary={option?.parent?.displayName}
                  secondary={option.parent.model=='Pal'?'Connection':option?.parentModelName}
                />
              </div>;
            }
          }
          else {
            return null;
          }
        }}
      />
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title" open={open}
      >

        <DialogContent>
          <Typography className={classes.dialogTitle}>
                           Add New
          </Typography>


          <PalForm
            loading={loading}
            setLoading={setLoading}
            pal={pal}
            setPal={setPal}
            callback={(profile)=>{
              setOpen(false);
              if (onSelect) {
                setPals([...pals, profile]);
                onSelect(profile);
              }
            }}
          />
          {loading?<LinearProgress />:null}
        </DialogContent>

      </Dialog>

    </>
  );
}
