import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useParams} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import FilesViewer from '../file/Viewer/FilesViewer';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  firstPartyText: {
    color: '#757575',
  },

  secondPartyText: {
    color: '#757575',
  },

  timeText: {
    fontSize: '0.7rem',
    color: 'grey',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: '800',
  },

}));
export default function S(props) {
  const {
    transactionId,
  } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const walletReducer = useSelector((state)=>state.wallet);
  const {transactionDictionary} = walletReducer;

  const transaction = transactionDictionary[transactionId];
  const firstParty = transaction?.firstParty;
  const secondParty = transaction?.secondParty;
  const files = transaction.files||[];
  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  return (
    <div className={root}>
      <div className={row}>

        <div className={col}>
          <Typography className={classes.title}>
            {transaction?.title}
          </Typography>
          <Typography className={classes.timeText}>
            {moment(transaction.createdAt).format('MMM Do YYYY')}
          </Typography>
        </div>
        <Typography variant="subtitle2" gutterBottom>
          <span className={classes.currencySign}>
            <b>&#36; {transaction.amount}</b>
          </span>

        </Typography>

      </div>

      <div className={row}>
        <div className={row}>
          <Avatar className={classes.avatarStyle} src={firstParty?.displayPicture?.thumbUrl} alt={firstParty?.displayName} />
          <div className={col}>
            <Typography variant="subtitle2" gutterBottom>
              {firstParty?.displayName}
            </Typography>
            <Typography className={classes.firstPartyText} variant="caption" display="block" gutterBottom>
              {transaction.sent?'Sender':'Receiver'}
            </Typography>
          </div>

        </div>
        <div className={row}>
          <Avatar className={classes.avatarStyle} src={secondParty?.displayPicture?.thumbUrl} alt={secondParty?.displayName} />
          <div className={col}>
            <Typography variant="subtitle2" gutterBottom>
              {secondParty?.displayName}
            </Typography>
            <Typography className={classes.secondPartyText} variant="caption" display="block" gutterBottom>
              {transaction.sent?'Receiver':'Sender'}
            </Typography>
          </div>

        </div>

      </div>

    </div>
  );
}
