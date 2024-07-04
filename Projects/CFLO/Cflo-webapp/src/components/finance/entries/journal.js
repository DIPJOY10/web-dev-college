import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useParams} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import DescriptionInput from '../../styled/description.input';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Api from '../../../helpers/Api';
import _ from 'lodash';
import clsx from 'clsx';
import DropdownBtn from '../../styled/actionBtns/dropdown.btn';
import arrayToReducer from '../../../helpers/arrayToReducer';
import ChartAccountAutocomplete from '../chartaccount/chart.account.autocomplete';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import CreateEntry from './create.entry';
import EntryTable from './entry.table';
import EditEntry from './edit.entry';
import TopBar from '../newactivity/topbar';
import { getChartAccounts } from '../chartaccount/api';


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

  nameInput: {
    maxWidth: '30rem',
    width: '95%',
    minHeight: '2rem',
    maxHeight: '2rem',
    padding: '1rem',
    borderWidth: '1px',
    backgroundColor: '#fafafa',
    color: '#424242',
    margin: '1rem',
  },

  formControl: {
    maxWidth: '24rem',
    margin: '1rem',
  },

  descriptionBox: {
    padding: '1rem',
    backgroundColor: '#fafafa',
  },

  descriptionInput: {
    maxWidth: '30rem',
    width: '95%',
    minHeight: '5rem',
    padding: '1rem',
    borderWidth: '1px',
    backgroundColor: '#fafafa',
    color: '#424242',
    margin: '1rem',
  },

  rowAlign: {
    alignItems: 'center',
  },

  addNewBtn: {
    height: '2rem',
    width: '8rem',
    marginRight: '4rem',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#00c853',
    color: 'white',
    borderRadius: '1rem',
  },

}));

export default function S(props) {
  const auth = useSelector(state => state.auth)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('Describe journal entry transaction');
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [entries, setEntries] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    user,
  } = auth;

  const {
    root, row, col,
  } = classes;

  const {
    walletId,
  } = useParams();

  const [ accts, setAccts ] = useState([])

  useEffect(() => {
    getChartAccounts(walletId)
      .then(data=>{

        if(data.length>0){
          setAccts(data)
          const {
            newDict
          } = arrayToReducer(data)
          
        }
      })
  }, [walletId])

  const usableAccounts = [];
  let openingBalanceAccount = null;


  accts.map((acct)=>{
    if (acct.accountType=='OpeningBalanceEquity') {
      openingBalanceAccount = acct;
    }
    else {
      usableAccounts.push(acct);
    }
  });


  const addEntry = (newEntry)=>{
    setEntries([...entries, newEntry]);
  };


  const removeEntry = (index)=>{
    setEntries([...entries.slice(0, index), ...entries.slice(index+1)]);
  };


  const checkEntries = ()=>{
    let debitBalance = 0;
    entries.map((entry, index)=>{
      if (entry.debit) {
        debitBalance += Number(entry.amount);
      }
      else {
        debitBalance -= Number(entry.amount);
      }
    });

    const newEntry = {
        account: openingBalanceAccount?._id,
        amount: debitBalance,
        debit: false,
    };

    if (debitBalance==0) {
      return entries;
    }
    else {
      return [...entries, newEntry];
    }
  };

  const apiHelper = ()=>{
    return new Promise(function(resolve, reject) {
      const journalObject = {
        title: name,
        description,
        wallet: walletId,
        entries: checkEntries(),
        user: user?._id,
        profile: user.profile,
      };

      Api.post('wallet/journal/create', journalObject).then((res)=>{
        const {
          journalEntry,
          chartAccounts,
        } = res?.data;


      });
    });
  };

  const saveAndClose = ()=>{
    apiHelper().then((res)=>{
      history.goBack();
    });
  };

  const saveAndNew = ()=>{
    apiHelper().then((res)=>{
      setEntries([]);
      setName('');
      setDescription('');
    });
  };

  const editEntry = (newEntry)=>{
    const selectedEntryIndex = selected[0];
    setEntries([...entries.slice(0, selectedEntryIndex), newEntry, ...entries.slice(selectedEntryIndex+1)]);
    setEditMode(false);
  };


  const remove = ()=>{
    const newArray = [];
    if (selected.length==entries.length) {
      setEntries([]);
      setEditMode(false);
      setSelected([]);
      return;
    }
    entries.map((entry, index)=>{
      if (selected.indexOf(index)==-1) {
        newArray.push(entry);
      }
    });

    setEntries(newArray);
    setEditMode(false);
    setSelected([]);
    return;
  };

  const enabled = entries.length>0;

  return (
    <div className={root}>
      <TopBar
        activity={'Journal Entry'}
        disabled={!enabled}
        textArr={['Save and Close', 'Save and New']}
        funcArr={[saveAndClose, saveAndNew]}
      />

      <InputBase
        multiline={true}
        rowsMax={6}
        value={name}
        placeholder="Title of Journal Entry"
        onChange={(event)=>setName(event.target.value)}
        className={classes.nameInput}
      />

      <InputBase
        multiline={true}
        rowsMax={6}
        description={description}
        placeholder={'Chart Account Description (Optional)'}
        onChange={(event)=>setDescription(event.target.value)}
        className={classes.descriptionInput}
      />

      {editMode? <EditEntry
        walletId={walletId}
        editEntry={editEntry}
        selected={selected}
        entries={entries}
      />: <CreateEntry
        walletId={walletId}
        addEntry={addEntry}
        usableAccounts={usableAccounts}
        accts={accts}

      />}


      <EntryTable
        entries={entries}
        selected={selected}
        setSelected={setSelected}
        setEditMode={setEditMode}
        remove={remove}
      />

    </div>
  );
}
