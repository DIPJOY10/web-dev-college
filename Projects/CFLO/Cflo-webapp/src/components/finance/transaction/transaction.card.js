import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import moment from 'moment';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PaymentSvg from '../../Assets/payment.svg';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PaymentIcon from '@material-ui/icons/Payment';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    width: '100%',
    maxWidth: '32rem',
    maxHeight: '9rem',
    padding: '1rem',
    margin: '0.5rem',
  },

  currencySign: {
    fontSize: '1.7rem',
    marginLeft: '0.4rem',
    marginRight: '0.4rem',
    color: theme.palette.primary.main,
  },

  svgSize: {

    display: 'flex',
    height: '35px',
    width: '35px',

  },


  avatarStyle: {
    height: '1.5rem',
    width: '1.5rem',
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  colDiv: {
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

export default function TransactionCard(props) {
  const {transactionId} = props;

  const walletReducer = useSelector((state)=>state.wallet);
  const {transactionDictionary} = walletReducer;

  const transaction = transactionDictionary[transactionId];
  // console.log(transaction,' is the transaction',transactionId)
  const history = useHistory();
  const classes = useStyles();
  const firstParty = transaction?.firstParty;
  const secondParty = transaction?.secondParty;

  const textLen = (text, lengthMax)=>{
    if (text&&text?.length>0) {
      const textLength = text.length;
      if (textLength>lengthMax) {
        return text.slice(0, lengthMax)+ '..';
      }
      else {
        return text;
      }
    }
    else {
      return '';
    }
  };

  return (
    <Paper className={classes.root} variant="outlined">

      <div className={classes.rowDiv}>

        <div className={classes.colDiv}>
          <Typography className={classes.title}>
            {textLen(transaction?.title, 25)}
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


      <div className={classes.rowDiv}>
        <div className={classes.rowDiv}>
          <Avatar className={classes.avatarStyle} src={firstParty?.displayPicture?.thumbUrl} alt={firstParty?.displayName} />
          <div className={classes.colDiv}>
            <Typography variant="subtitle2" gutterBottom>
              {textLen(firstParty?.displayName, 16)}
            </Typography>
            <Typography className={classes.firstPartyText} variant="caption" display="block" gutterBottom>
              {transaction.sent?'Sender':'Receiver'}
            </Typography>
          </div>

        </div>
        <div className={classes.rowDiv}>
          <Avatar className={classes.avatarStyle} src={secondParty?.displayPicture?.thumbUrl} alt={secondParty?.displayName} />
          <div className={classes.colDiv}>
            <Typography variant="subtitle2" gutterBottom>
              {textLen(secondParty?.displayName, 16)}
            </Typography>
            <Typography className={classes.secondPartyText} variant="caption" display="block" gutterBottom>
              {transaction.sent?'Receiver':'Sender'}
            </Typography>
          </div>

        </div>

      </div>


    </Paper>
  );
}

