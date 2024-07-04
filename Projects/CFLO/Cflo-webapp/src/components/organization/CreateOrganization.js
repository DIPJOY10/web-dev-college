import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';

import {ButtonBase} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TitleInput from '../styled/title.input';
import DescriptionInput from '../styled/description.input';
import PaperOptionCard from '../styled/paper.option.card';
import {useParams, useHistory} from 'react-router-dom';
import Api from '../../helpers/Api';
import {createOrg} from './organization.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    width: `calc(100%)`,
    marginTop: '7rem',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },

  orgTypePaper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem',

    margin: '1rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  createDivStyle: {
    marginRight: '-2rem',
  },

  createButtonText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },

  selectBranchText: {
    marginLeft: '0.5rem',
    color: theme.palette.primary.main,
  },

  titleInput: {
    maxWidth: '30rem',
    height: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    backgroundColor: '#eceff1',
    margin: '1rem',
  },

  descriptionInput: {
    maxWidth: '30rem',
    height: '6rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    borderWidth: '1px',
    backgroundColor: '#eceff1',
    margin: '1rem',
  },

  selectDivStyle: {
    width: '40%',
    display: 'flex',
    flex: 1,
  },
}));

function CreateOrganization(props) {
  const classes = useStyles();

  const [publicOrg, setPublicOrg] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const {branchId} = useParams();
  const state = useSelector((state) => state);
  const {user, userProfile} = useSelector((state) => state.auth);
  const userId = user._id;

  const callback = () => {
    history.goBack();
  };

  const createOrganizationApi = () => {
    createOrg(
        {
          user: userId,
          creator: user.model === 'User' ? userId : userProfile._id,
          participants: [userId],
          allTimeMembers: [
            {
              modelId: userId,
              modelName: user.model,
            },
          ],
          displayName: title,
          description,
          public: publicOrg,
        },
        state,
        dispatch,
        callback,
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <PaperOptionCard
          title={'Private'}
          text={`Choose private for internal teams. Outside users can't message internal teams.`}
          selected={!publicOrg}
          onClick={() => {
            setPublicOrg(false);
          }}
        />

        <PaperOptionCard
          title={'Public'}
          text={`People can look up and message public organizations. Complete organization's profile to post jobs, investments`}
          selected={publicOrg}
          onClick={() => {
            setPublicOrg(true);
          }}
        />
      </div>

      <TitleInput title={title} placeholder={publicOrg ? 'Organization Name' : 'Team Name'} setTitle={setTitle} />

      <DescriptionInput
        description={description}
        placeholder={publicOrg ? 'Organization Description (optional)' : 'Team Description (optional)'}
        setDescription={setDescription}
      />

      <div className={classes.createDivStyle}>
        <ButtonBase className={classes.tabButton} onClick={() => createOrganizationApi()}>
          <Typography className={classes.createButtonText}>Create Organization</Typography>
        </ButtonBase>
      </div>
    </div>
  );
}

export default CreateOrganization;
