import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment';
import {
  Typography,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';
import CreateBtn from '../../styled/actionBtns/create.btn';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import NetworkSvg from '../../../Assets/network.svg';
import BankIcon from '../../../Assets/bank.svg';
import ContractorIcon from '../../../Assets/contractor.svg';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Api from '../../../helpers/Api';
import { setInvestments } from '../../Investment/investment.utils';
import { setJobs } from '../../job/job.utils';
import { handleGoogleLogin } from '../../auth/auth.utils';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginLeft: '1rem',
    width: '16rem',
    maxWidth: '16rem',
    display: 'flex',
    padding: '1rem',
    flexDirection: 'column',
    minHeight: '8rem',
    marginTop: '1rem',
    textAlign: 'center',
  },

  cardRoot: {
    flex: 1,
    maxWidth: '16rem',
    display: 'flex',
    padding: '0.5rem',
    flexDirection: 'column',
    marginTop: '1rem',
    textAlign: 'center',
  },

  svgSize: {
    display: 'flex',
    height: '40px',
    width: '40px',
  },

  header: {
    textAlign: 'center',
  },

  textNetwork: {
    textAlign: 'center',
    paddingLeft: '1.5rem',
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
  },

  topRow: {
    marginBottom: '1rem',
  },

  listStyle: {
    padding: '1rem',
    paddingBottom: '2rem',
    paddingTop: 0,
  },

  title: {
    marginLeft: '1rem',
  },

  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',

  },

  createBtnPaper: {
    marginLeft: '2rem',
    alignSelf: 'flex-end',

  },

}));

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function TaskCard(props) {
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);
  const dashboard = useSelector((state) => state.dashboard);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    teamId,
  } = props;
  const teamReducer = useSelector((state) => state.team);
  const {
    teamDictionary,
  } = teamReducer;
  const team = teamDictionary[teamId];

  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const DialogListItem = <div className={classes.column}>

    <Paper onClick={() => {
      if (team && team?._id) {
        Api.post('investment/create', {
          team: teamId,
          user: user._id,
        }).then((investment) => {
          const investmentId = investment._id;
          setInvestments([investment], dashboard, dispatch);
          const path = '/dashboard/edit/investment/' + investmentId;
          history.push(path);
        });
      }
    }} className={classes.cardRoot} square >

      <div className={clsx(classes.row, classes.topRow)}>

        <img key={'finance'} className={classes.svgSize} src={BankIcon} />
        <ButtonBase onClick={() => {

        }}>
          <Typography variant="body2" component="p" className={classes.textNetwork}>
            Share your project / organization with investors and make deals.
          </Typography>
        </ButtonBase>


      </div>
    </Paper>

    <Paper onClick={() => {
      Api.post('job/create', {
        team: teamId,
        user: user._id,
        participants: [user._id],
        type: 'Project',
      })
        .then((res) => {
          const job = res?.data;
          if (job?._id) {
            setJobs([job], dashboard, dispatch);
            const path = '/dashboard/edit/job/' + job._id;
            history.push(path);
          }

        });
    }} className={classes.cardRoot} square >

      <div className={clsx(classes.row, classes.topRow)}>

        <img key={'contractor'} className={classes.svgSize} src={ContractorIcon} />
        <ButtonBase onClick={() => {

        }}>
          <Typography variant="body2" component="p" className={classes.textNetwork}>
            Hire professionals like contractors, architects, interior designers etc.
          </Typography>
        </ButtonBase>


      </div>
    </Paper>
  </div>;

  return (
    <Paper onClick={() => {

    }} className={classes.root} square >
      <div className={clsx(classes.row, classes.topRow)}>
        <img key={'timeline'} className={classes.svgSize} src={NetworkSvg} />


        <Typography className={classes.title} color="textSecondary" >
          Network
        </Typography>

        <Paper className={classes.createBtnPaper}>
          <ButtonBase className={classes.createBtn} onClick={() => {
            if (team && team?._id) {
              setOpen(true);
            }
            else {
              handleGoogleLogin(dispatch);
            }
          }}>
            <Typography>
              Add
            </Typography>

            <AddIcon />

          </ButtonBase>
        </Paper>

      </div>
      <ButtonBase className={classes.row}>


        <Typography variant="body2" component="p">
          Use network to find <b>investors / lenders, hire</b> people for this project and more.
        </Typography>

      </ButtonBase>

      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">{'Use Network'}</DialogTitle>
        <List className={classes.listStyle}>
          {DialogListItem}
        </List>
      </Dialog>
    </Paper>
  );
}
