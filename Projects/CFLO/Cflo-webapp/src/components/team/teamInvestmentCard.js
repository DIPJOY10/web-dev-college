import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import moment from 'moment';
import Api from '../../helpers/Api';
import Paper from '@material-ui/core/Paper';
import teamUtils from './team.utils';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setInvestments } from '../Investment/investment.utils';
import CreateBtn from '../styled/actionBtns/create.btn';
const { handleTeams } = teamUtils;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '10rem',
    width: '20rem',
    maxWidth: '40rem',

  },

  backdrop: {
    zIndex: theme.zIndex.drawer,
    color: '#fff',
  },

  title: {
    fontSize: 14,
    marginLeft: 15,
  },

  rowDiv: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '1rem',
  },

  colDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function InvestmentTeamCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { teamId } = props;
  const state = useSelector((state) => state);
  const { appGlobal } = state;
  const { backdropVisible } = appGlobal;
  const { user, selectedProfileId } = useSelector((state) => state.auth);
  const dashboard = useSelector((state) => state.dashboard);
  const { investmentDictionary } = dashboard;
  const teamReducer = useSelector((state) => state.team);
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];

  const history = useHistory();
  const investmentId = team.investment;
  let profileId = user.profile;
  if (selectedProfileId) {
    profileId = selectedProfileId;
  }

  const [profile, setProfile] = useState(profileId);

  useEffect(() => {

  }, []);

  const create = () => {
    setLoading(true);
    dispatch({ type: 'ShowBackdrop' });
    Api.post('investment/create', {
      team: teamId,
      user: user._id,
      profile,
    }).then((investment) => {
      setInvestments([investment], dashboard, dispatch);
      const newTeam = {
        ...team,
        investment: investment._id,
      };

      handleTeams([newTeam], state, dispatch);
      dispatch({ type: 'HideBackdrop' });
      setLoading(false);
    });
  };

  const edit = () => {
    if (investmentId) {
      const path = '/dashboard/edit/investment/' + investmentId;
      history.push(path);
    }
  };


  let CardView = <div>
    <Typography>
      Create Proposal to get Investors
    </Typography>
    <CreateBtn onClick={create}>
      Create
    </CreateBtn>
  </div>;

  if (investmentId) {
    const investment = investmentDictionary[investmentId];

    if (investment) {
      switch (investment.status) {
        case 'Incomplete':
          CardView = <div>
            <Typography>
              Complete your Proposal
            </Typography>
            <CreateBtn onClick={edit}>
              EDIT
            </CreateBtn>
          </div>;
          break;

        case 'Review Pending':
          CardView = <div>
            <Typography>
              Complete your Proposal
            </Typography>

          </div>;
          break;

        case 'Accepted':
          CardView = <div>
            <Typography>
              Proposal is Live
            </Typography>
            <CreateBtn onClick={() => {

            }}>
              View
            </CreateBtn>
          </div>;
          break;

        default:
          break;
      }
    }
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.rowDiv}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <Typography>
          Investment
        </Typography>
        <div className={classes.colDiv}>
          {CardView}
        </div>
        {/* <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop> */}
      </div>

    </Paper>
  );
}

