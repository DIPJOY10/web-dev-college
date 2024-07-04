import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import ChartAccountAutocomplete from '../chartaccount/chart.account.autocomplete';
import NumberFormat from 'react-number-format';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import {withStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import IOSSwitch from '../../styled/switch';

const NumberInput = withStyles((theme) => ({
  root: {
    backgroundColor: '#fafafa',
    color: '#424242',
    padding: '0.4rem',
    marginTop: '0.5rem',
  },
}))(({classes, ...props}) => {
  return (
    <InputBase
      classes={{
        root: classes.root,
      }}
      {...props}
    />
  );
});


const useStyles = makeStyles((theme) => ({
  root: {
    margin: '2rem',
  },

  marginBottom: {
    marginBottom: '0.7rem',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  autocomplete: {
    width: '15rem',
    marginRight: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },

  textBtnStyle: {
    marginRight: '1rem',
    fontSize: '0.9rem',
  },

  amount: {
    width: '9rem',
    marginRight: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },

  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',

  },

  createBtnPaper: {
    marginLeft: '1rem',
    alignSelf: 'center',
    marginTop: '1.5rem',
    backgroundColor: '#42a5f5',
    color: 'white',
  },

  btnPaperDisabled: {
    marginLeft: '1rem',
    alignSelf: 'center',
    marginTop: '1.5rem',
    backgroundColor: '#f5f5f5',
    color: '#424242',
  },

  paperBtnText: {
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
  },
}));

export default function S(props) {
  const classes = useStyles();
  const {
    root, row, col,
    createBtnPaper, btnPaperDisabled,
    textBtnStyle, marginBottom,
  } = classes;


  const {
    walletId, selected, entries, editEntry,
  } = props;
  const {
    wallet: walletReducer,
  } = useSelector((state) => state);

  const {
    walletDictionary,
    chartAccountDictionary,
  } = walletReducer;

  const wallet = walletDictionary[walletId];
  const chartOfAccountIds = wallet?.chartOfAccounts || [];
  const chartOfAccounts = chartOfAccountIds.map((id)=>{
    return chartAccountDictionary[id];
  });


  const usableAccounts = [];
  let openingBalanceAccount = null;
  chartOfAccounts.map((acct)=>{
    if (acct.accountType=='OpeningBalanceEquity') {
      openingBalanceAccount = acct;
    }
    else {
      usableAccounts.push(acct);
    }
  });

  const entrySelected = entries[selected[0]];

  const [debit, setDebit] = useState(entrySelected.debit);
  const [amount, setAmount] = useState(entrySelected.amount);

  const accountOldId = entrySelected.account;
  const accountOld = chartAccountDictionary[accountOldId];

  const [account, setAccount] = useState(accountOld);

  const disabled = !account?._id||!(amount>0);

  return (
    <div className={root}>
      <div className={row}>
        <div className={classes.autocomplete}>
          <Typography variant="button" className={clsx(textBtnStyle, marginBottom)}>
            <b>Account</b>
          </Typography>
          <ChartAccountAutocomplete
            chartAccounts={usableAccounts}
            account={account}
            setAccount={setAccount}
          />
        </div>

        <div className={classes.amount}>
          <div className={row}>
            <Typography variant="button" className={classes.textBtnStyle}>
              <b>{debit?'Debit':'Credit'}</b>
            </Typography>

            <IOSSwitch
              checked={debit}
              onChange={(event)=>{
                setDebit(event.target.checked);
              }}
            />
          </div>

          <NumberFormat value={amount} thousandSeparator={true} prefix={'$'} customInput={NumberInput} onValueChange={(values) => {
            const {value} = values;
            setAmount(value);
          }} />
        </div>


        <Paper className={disabled?btnPaperDisabled:createBtnPaper}>
          <ButtonBase className={classes.createBtn} disabled={disabled}
            onClick={()=>{
              editEntry({
                account: account._id,
                amount,
                debit,
              });
              setAccount(null);
              setAmount(0);
            }}>

            <AddIcon />
            <Typography className={classes.paperBtnText}>
                                Edit Entry
            </Typography>


          </ButtonBase>
        </Paper>


      </div>

    </div>
  );
}
