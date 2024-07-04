import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import {withStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CreateBtn from '../styled/actionBtns/create.btn';
import Paper from '@material-ui/core/Paper';
import Api from '../../helpers/Api';
import {setUserProfiles} from './profile.utils';
import ListItem from '@material-ui/core/ListItem';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import EmailForm from '../styled/email.form';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    maxWidth: '30rem',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  primaryTextStyle: {
    marginRight: '1rem',
  },
  ListItemStyle: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const EmailHandler = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {profileDictionary} = auth;
  const {
    profileId,
  } = props;

  const profile = profileDictionary[profileId];
  const Emails = profile?.emails?profile.emails:[];
  const VerifiedEmails = profile?.verifiedEmails?profile.verifiedEmails:[];
  const Primary = profile?.primaryEmail?profile?.primaryEmail:null;

  const [primary, setPrimary] = useState(Primary);
  const [verifiedEmails, setVerifiedEmails] = useState(VerifiedEmails);
  const [emails, setEmails] = useState(Emails);

  const profileUpdates = (profileObject)=>{
    Api.post('profile/update', profileObject)
        .then((profile)=>{
          setUserProfiles([profile], auth, dispatch);
        });
  };

  const addEmail = (email)=>{
    const set = new Set(emails);
    const newSet = set.add(email);
    const newEmails = Array.from(newSet);
    setEmails(newEmails);

    if (primary) {

    }
    else {
      setPrimary(email);
    }

    const profileObject = {
      ...profile,
      emails: newEmails,
      primaryEmail: primary?primary:email,
    };

    profileUpdates(profileObject);
  };

  const EmailView = (email)=>{
    if (email==primary) {
      return null;
    }
    return (
      <ListItem className={classes.row}>
        <Typography>{email}</Typography>
        {email==primary?null:<CreateBtn type="submit" color="primary">
                    Primary
        </CreateBtn>}

      </ListItem>
    );
  };

  return (
    <Paper className={classes.root}>
      <ListItem>
        <Typography variant="h6" gutterBottom>Manage Emails</Typography>
      </ListItem>

      <ListItem>
        <EmailForm addEmail={addEmail} label={'Add Business Email'} />
      </ListItem>

      <ListItem>
        <Typography className={classes.primaryTextStyle}>
          {primary}
        </Typography>
        <DoneAllIcon color={'green'}/>
      </ListItem>

      {emails.map((email)=>{
        return EmailView(email);
      })}

    </Paper>
  );
};

export default EmailHandler;

