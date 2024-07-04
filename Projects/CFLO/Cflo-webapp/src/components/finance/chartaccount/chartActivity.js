import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
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
import TopBar from '../newactivity/topbar';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {},

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
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {walletId} = props;
  const {wallet: walletReducer} = useSelector((state) => state);

  const {categories, group, subTypes, walletDictionary, chartAccountDictionary} = walletReducer;

  const {root, row, col} = classes;

  const wallet = walletDictionary[walletId];
  const chartOfAccountIds = wallet?.chartOfAccounts || [];
  const chartOfAccounts = chartOfAccountIds.map((id) => {
    return chartAccountDictionary[id];
  });

  const chartOfAccountNames = chartOfAccounts.map((acct) => acct.name);

  const [entries, setEntries] = useState([]);

  const [account, setAccount] = useState({
    name: 'Cash and Cash Equivalent',
    qbType: 'CashOnHand',
    debit: true,
  });

  const [classSelected, setClassSelected] = useState('Bank');

  const [isSubAccount, setIsSubAccount] = useState(false);
  const [amount, setAmount] = useState(0);
  const [parent, setParent] = useState(null);
  const [name, setName] = useState('Cash and Cash Equivalent');
  const [description, setDescription] = useState('');

  const getTopLevelfromGroup = (classfcn) => {
    let cat;
    categories.map((category) => {
      if (group[category].indexOf(classfcn) > -1) {
        cat = category;
      }
    });
    return cat;
  };

  const allPossibleParents = chartOfAccounts.filter((acct) => {
    return acct.classification === classSelected;
  });

  const addEntry = () => {};

  useEffect(() => {
    if (categories && categories.length > 0) {
    }
    else {
      Api.post('wallet/chart/types', {}).then((res) => {
        const {classifications, subTypes} = res;

        const {categories, group} = classifications;

        dispatch({
          type: 'AddWallet',
          payload: {
            categories,
            group,
            subTypes,
          },
        });
      });
    }
  }, []);

  const firstLevel =
    categories && categories.length > 0 ?
      _.flattenDeep(
          categories.map((category) => {
            return group[category];
          }),
      ) :
      [];

  const secondLevel = subTypes[classSelected];

  const apiHelper = () => {
    return new Promise(function(resolve, reject) {
      let ancestors = [];
      let isSubAccountApplied = false;
      let isParentApplied = null;
      if (parent?._id && isSubAccount) {
        isSubAccountApplied = isSubAccount;
        isParentApplied = parent;
        const parentAncestors = parent?.ancestors || [];
        ancestors = [...parentAncestors, parent._id];
      }

      const chartObject = {
        name,
        description,
        topLevel: getTopLevelfromGroup(classSelected),
        classification: classSelected,
        accountType: account.qbType,
        debit: account.debit,
        wallet: walletId,
        parent: parent?._id ? parent._id : null,
        ancestors,
      };

      Api.post('wallet/chart/create', chartObject).then((res) => {
        const {wallet: walletRes, chartAccount} = res;

        const {newDict: newWalletDict} = arrayToReducer([walletRes]);

        const {newDict: newChartAccountDict} = arrayToReducer([chartAccount]);

        dispatch({
          type: 'AddWallet',
          payload: {
            walletDictionary: {
              ...walletDictionary,
              ...newWalletDict,
            },
            chartAccountDictionary: {
              ...chartAccountDictionary,
              ...newChartAccountDict,
            },
          },
        });

        resolve(chartAccount);
      });
    });
  };

  const saveAndClose = () => {
    apiHelper().then((res) => {
      history.goBack();
    });
  };

  const saveAndNew = () => {
    setAccount({
      name: 'Cash and Cash Equivalent',
      qbType: 'CashOnHand',
      debit: true,
    });

    setClassSelected('Bank');

    setIsSubAccount(false);
    setAmount(0);
    setParent(null);
    setName('Cash and Cash Equivalent');
    setDescription('');
  };

  const subAccountOk = isSubAccount ? (parent && parent._id ? true : false) : true;

  const enabled = name && name.length > 0 && chartOfAccountNames.indexOf(name) === -1 && subAccountOk;

  return (
    <div className={root}>
      <TopBar activity={'Chart Account'} disabled={!enabled} textArr={['Save and Close', 'Save and New']} funcArr={[saveAndClose, saveAndNew]} />

      <div className={row}>
        <div className={col}>
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="account-type-select-label">Account Type</InputLabel>
            <Select
              labelId="account-type-select"
              id="account-type-select"
              value={classSelected}
              onChange={(event) => {
                const newClass = event.target.value;
                setClassSelected(newClass);
                const newAccount = subTypes[newClass][0];
                setAccount(newAccount);
                setName(newAccount.name);
                setParent(null);
              }}
            >
              {firstLevel.map((c) => {
                return <MenuItem value={c}>{c}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="detail-type-label">Detail Type</InputLabel>
            <Select
              labelId="detail-type-select"
              id="detail-type-select"
              value={account}
              onChange={(event) => {
                const account = event.target.value;
                setAccount(account);
                setName(account.name);
                setParent(null);
              }}
            >
              {secondLevel.map((c) => {
                return <MenuItem value={c}>{c.name}</MenuItem>;
              })}
            </Select>
          </FormControl>

          <div className={clsx(classes.formControl, classes.descriptionBox)}>
            <Typography>{account.description}</Typography>
          </div>
          {/* <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={age}
                        onChange={handleChange}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl> */}
        </div>
        <div className={col}>
          <InputBase
            multiline={true}
            rowsMax={6}
            value={name}
            placeholder="Chart Account Name"
            onChange={(event) => setName(event.target.value)}
            className={classes.nameInput}
          />

          <InputBase
            multiline={true}
            rowsMax={6}
            description={description}
            placeholder={'Chart Account Description (Optional)'}
            onChange={(event) => setDescription(event.target.value)}
            className={classes.descriptionInput}
          />

          {allPossibleParents.length > 0 ? (
            <div className={clsx(classes.row, classes.rowAlign)}>
              <Checkbox
                color="primary"
                checked={isSubAccount}
                onChange={(event) => {
                  setIsSubAccount(event.target.checked);
                }}
              />
              <Typography>Is Sub Account</Typography>
            </div>
          ) : null}

          {isSubAccount ? (
            <FormControl variant="filled" className={classes.formControl}>
              <InputLabel id="account-type-select-label">Select Parent</InputLabel>
              <Select
                labelId="account-type-select"
                id="account-type-select"
                value={parent}
                onChange={(event) => {
                  const newParent = event.target.value;
                  setParent(newParent);
                }}
              >
                {allPossibleParents.map((c) => {
                  return <MenuItem value={c}>{c.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
          ) : null}

          <DropdownBtn disabled={!enabled} textArr={['Save and Close', 'Save and New']} funcArr={[saveAndClose, saveAndNew]} />
        </div>
      </div>
    </div>
  );
}
