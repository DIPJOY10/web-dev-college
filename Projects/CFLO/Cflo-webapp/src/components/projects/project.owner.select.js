import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import _ from 'lodash';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '30rem',
    margin: '2rem',
    justifyContent: 'center',
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
}));

const ProfileSelect = (props) => {
  const {
    owner,
    setOwner,
  } = props;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const {user, organizationIds, selectedProfileId, organizationDictionary, profileIds} = auth;
  const organizations = organizationIds.map((organizationId)=>organizationDictionary[organizationId]);
  const Entities = _.concat([user], organizations);
  const [entities, setEntities] = useState(Entities);
  const [entity, setEntity] = useState(owner);


  return (
    <div className={classes.root}>
      <Autocomplete
        id="userpalautocomplete"
        value={entity}
        options={entities}
        getOptionLabel={(option) => option.displayName}
        onChange={(event, value) => {
          dispatch({
            type: 'AddProject',
            payload: {
              projectOwner: value,
            },
          });

          if (setOwner) {
            setOwner(value);
          }
        }}
        renderInput={(params) => (
          <Paper component="form" className={classes.inputPaper} ref={params.InputProps.ref}>
            <InputBase
              {...params}
              className={classes.input}
              placeholder={'Add Members'}
              inputProps={{'aria-label': 'Add Members'}}
              {...params.inputProps}
            />
          </Paper>
        )}

        renderOption={(option, state)=>{
          return <ListItem>
            <ListItemAvatar>
              <Avatar src={option?.displayPicture?.thumbUrl} alt={option.displayName} />
            </ListItemAvatar>
            <ListItemText
              primary={option.displayName}
              secondary={option.model}
            />
          </ListItem>;
        }}
      />
    </div>
  );
};

export default ProfileSelect;
