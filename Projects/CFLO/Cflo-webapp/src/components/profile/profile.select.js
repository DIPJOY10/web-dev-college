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
import Api from '../../helpers/Api';
import {setUserProfiles} from './profile.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    maxWidth: '32rem',
    margin: '2rem',
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
  const {profileId, onProfileSelect} = props;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const {user, organizationIds, selectedProfileId, organizationDictionary, profileIds} = auth;
  const organizations = organizationIds.map((organizationId) => organizationDictionary[organizationId]);
  const Entities = _.concat([user], organizations);
  const [entities, setEntities] = useState(Entities);
  const [entity, setEntity] = useState(null);
  // console.log(profileId,' is the profileId')

  useEffect(() => {
    /**
     * If profileId is defined just use that
     * If profileId not available use selectedProfileId
     * If selectedProfileId not not available use user's profile (the default)
     */

    if (profileId) {
      /**
       * Check if profileId is in profileIds in auth
       * if not fetch it using Api
       */
      if (profileIds.indexOf(profileId) === -1) {
        Api.post('profile/getProfileParent', {
          profileId,
        }).then((profile) => {
          // console.log(profile,' are the profile')
          const entityNew = profile.parent;
          setEntity(entityNew);
          setUserProfiles([profile], auth, dispatch);
          setEntities(_.concat([entityNew], entities));
        });
      }
      else {
        const entityNew = entities.filter((entity) => entity.profile == profileId)[0];
        setEntity(entityNew);
      }
    }
    else {
      if (selectedProfileId) {
        const entityNew = entities.filter((entity) => entity.profile == selectedProfileId)[0];
        setEntity(entityNew);
      }
      else {
        setEntity(user);
      }
    }
  }, [profileId, selectedProfileId]);

  return (
    <div className={classes.root}>
      <Autocomplete
        id="userpalautocomplete"
        value={entity}
        options={entities}
        getOptionLabel={(option) => option.displayName}
        onChange={(event, value) => {
          if (onProfileSelect) {
            onProfileSelect(value.profile);
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
        renderOption={(option, state) => {
          return (
            <ListItem>
              <ListItemAvatar>
                <Avatar src={option?.displayPicture?.thumbUrl} alt={option.displayName} />
              </ListItemAvatar>
              <ListItemText primary={option.displayName} secondary={'Secondary text'} />
            </ListItem>
          );
        }}
      />
    </div>
  );
};

export default ProfileSelect;
