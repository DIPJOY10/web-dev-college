import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import PaperOption from '../../styled/paper.option.card';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { createOfferingAndRelation, createOfferingRelation, getIncomeChartAccounts, getOfferingByName } from './utils';
import TitleInput from '../../styled/title.input';
import DescriptionInput from '../../styled/description.input';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import ChartAccountCreate from '../chartaccount/ChartAccount.Create';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CreateChartAccountForBill from './createChartAccountForBill'
import CreateChartAccountForInvoice from './createChartAccountForInvoice'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';


const typeArr = ["Product", "Service", "Package"]


const useStyles = makeStyles((theme) => ({
  root: {
    borderTop: "1px solid gray",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  inputCont: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: "30px",
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  normalInput: {
    width: '47%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  priceRate: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnCont: {
    paddingTop: "20px",
    paddingBottom: "10px",
    display: "flex",
    justifyContent: 'space-between'
  },
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  optionToBar: {
    display: "flex",
    paddingLeft: "10px",
    paddingRight: "10px",
    justifyContent: 'space-between',
  }
}));

export default function CreateOffering(props) {
  const {
    text, setOpen, onSelect, setLoading, tx
  } = props;

  const {
    walletId,
  } = useParams();


  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state);
  const { user, userProfile } = auth;

  console.log("user")
  console.log(user)
  console.log("userProfile")
  console.log(auth)

  const {
    root, row, col,
    inputCont, normalInput,
    priceRate, btnCont,
    optionToBar,
    titleCont
  } = classes;

  const [chartAccounts, setChartAccounts] = useState([]);
  const [selectedChartAccount, setSelectedChartAccount] = useState({});
  const [chartAccountText, setChartAccountText] = useState("");
  const [openChartAcc, setOpenChartAcc] = useState(false)

  const [taxRate, setTaxRate] = useState(0);

  const [options, setOptions] = useState([]);
  const [name, setName] = useState(text);
  const [price, setPrice] = useState(0);

  const [type, setType] = useState(typeArr[0]);
  const [typeText, setTypeText] = useState(typeArr[0]);

  const [description, setDescription] = useState('');
  const [offeringObj, setOfferingObj] = useState(null);


  useEffect(() => {

    let ChartAcctype

    if (tx?.type == 'Invoice') {
      ChartAcctype = { classification: "Income", wallet: walletId }
    } else if (tx?.type == 'Bill') {
      ChartAcctype = { topLevel: 'Expense', wallet: walletId }
    }

    getIncomeChartAccounts({ type: ChartAcctype })
      .then((accounts) => {
        const addObject = {
          _id: 'New',
          name: "+ Add New",
          numDays: "0"
        };
        const newFiltered = [addObject, ...accounts]
        setChartAccounts(newFiltered)
        setSelectedChartAccount(accounts[0])
      })
      .catch((err) => {
        console.log(err);
      })

  }, [])

  console.log(tx);

  // need to modify create function

  const saveAndClose = async () => {

    setOpen(false);
    setLoading(true);

    let offeringRelation = {
      chartAccount: selectedChartAccount?._id,
      doYouOwnIt: tx?.type == 'Invoice' ? true : false,
      name: name,
      description: description,
      model: type,
      taxRate: taxRate,
      price: price,
      vendor: tx?.type == 'Bill' ? tx?.secondParty?._id : null,
      wallet: walletId,
      addedBy: user?.profile,
      user: user?.model == 'User' ? user._id : userProfile?._id,
    }

    if (offeringObj === null) {

      const newOffering = {
        name: name,
        description: description,
        model: type,
        price: price,
        wallet: walletId,
        addedBy: user?.profile,
        user: user?.model == 'User' ? user._id : userProfile?._id,
      }

      await createOfferingAndRelation({ newOffering, offeringRelation })
        .then((savedData) => {
          console.log(savedData)

          let orgData = savedData?.savedRelation
          orgData.chartAccount = selectedChartAccount
          orgData.offering = savedData?.savedOffering

          setLoading(false)
          if (onSelect) {
            onSelect(orgData, true);
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {

      offeringRelation.offering = offeringObj?._id
      await createOfferingRelation({ offeringRelation })
        .then((savedData) => {
          console.log(savedData)

          let orgData = savedData
          orgData.chartAccount = selectedChartAccount
          orgData.offering = offeringObj

          setLoading(false)
          if (onSelect) {
            onSelect(orgData, true);
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  };

  const getOptionLabel = (option) => {
    return option?.name || " ";
  };

  const getOptionLabelSimple = (option) => {
    return option || " ";
  };

  const onTypeSelect = (value) => {
    setType(value)
  }

  const onChartAccountSelect = (value) => {
    setSelectedChartAccount(value)
  }

  const onNew = () => {
    setOpenChartAcc(true);
  };

  const chartAccountCreateDialog = (value) => {
    console.log(value);
    setOpenChartAcc(value)

    let ChartAcctype

    if (tx?.type == 'Invoice') {
      ChartAcctype = { classification: "Income", wallet: walletId }
    } else if (tx?.type == 'Bill') {
      ChartAcctype = { topLevel: 'Expense', wallet: walletId }
    }

    getIncomeChartAccounts({ type: ChartAcctype })
      .then((accounts) => {
        const addObject = {
          _id: 'New',
          name: "+ Add New",
          numDays: "0"
        };
        const newFiltered = [addObject, ...accounts]
        const len = accounts?.length
        setChartAccounts(newFiltered)
        setSelectedChartAccount(accounts[len - 1])
      })
  }


  const onChangeName = async (value) => {
    console.log(value)

    if (value && value.length > 1) {
      await getOfferingByName({
        name: value
      })
        .then((discountsOrTaxs) => {
          console.log(discountsOrTaxs)
          setOptions(discountsOrTaxs)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const onNameSelected = async (value) => {
    console.log(value)
    if (value === null) {
      setName("")
      setOptions([])
      setType("")
      setPrice(0)
      setDescription("")
    } else {
      setName(value?.name)
      setType(value?.model)
      setPrice(value?.price)
      setDescription(value?.description)
    }
    setOfferingObj(value)
  }

  const getFirst200 = (str) => {
    let newDis = ""
    if (str.length > 150) {
      newDis = str.substr(0, 150) + '...'
    } else {
      newDis = str
    }
    return newDis
  }


  let CreateChartAccountComponent = null

  switch (tx?.type) {
    case 'Bill':
      CreateChartAccountComponent = <CreateChartAccountForBill
        walletId={walletId}
        openDialog={openChartAcc}
        setOpenChart={chartAccountCreateDialog}
      />
      break;
    case 'Invoice':
      CreateChartAccountComponent = <CreateChartAccountForInvoice
        walletId={walletId}
        openDialog={openChartAcc}
        setOpenChart={chartAccountCreateDialog}
      />
      break;
    default:
      break;
  }


  return (
    <div className={root}>
      <div className={titleCont} >
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          value={offeringObj}
          inputValue={name}
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionSelected={(option) => {
            return option?._id == offeringObj?._id;
          }}
          onChange={(event, value) => {
            onNameSelected(value)
          }}
          renderInput={(params) => (
            <TextField {...params} label="Title" margin="normal" variant="outlined" />
          )}
          onInputChange={(event, newValue) => {
            setName(newValue);
            onChangeName(newValue)
          }}
          renderOption={(option, state) => {
            if (option) {
              return (
                <div style={{ width: "100%" }} >
                  <div className={optionToBar} >
                    <div>
                      {option?.name}
                      <span style={{ marginLeft: "7px", marginRight: "7px" }} >|</span>
                      <span style={{ fontSize: "14px", opacity: "0.6" }} >{option?.model}</span>
                    </div>
                    <div>{option?.price}$</div>
                  </div>
                  <div style={{
                    width: "100%",
                    fontSize: '13px',
                    opacity: '0.6',
                    textAlign: 'center',
                  }} >{getFirst200(option?.description)}</div>
                </div>
              )
            }
            else {
              return null;
            }
          }}
          style={{ width: "100%" }}
          size="small"
        />

      </div>
      <div className={inputCont} >
        <div className={normalInput} >
          <TextField
            id="outlined-multiline-static"
            label="Product Description"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => { setDescription(e.target.value) }}
            style={{ marginTop: "20px", width: "100%" }}
          />
        </div>


        <div className={normalInput} >
          <div style={{ marginTop: "20px", marginLeft: "-21px" }} >
            <MyAutocomplete
              value={type}
              isSmall={false}
              text={typeText}
              setText={setTypeText}
              placeholder={"Type"}
              results={typeArr}
              getOptionLabel={getOptionLabelSimple}
              onSelect={onTypeSelect}
              label={"Type"}
              setWidth={"94%"}
            />
          </div>


          <div style={{ marginTop: "20px", marginLeft: "-21px" }} >
            <MyAutocomplete
              value={selectedChartAccount}
              isSmall={false}
              text={chartAccountText}
              setText={setChartAccountText}
              placeholder={"Category"}
              results={chartAccounts}
              getOptionLabel={getOptionLabel}
              onSelect={onChartAccountSelect}
              onNew={onNew}
              label={"Category"}
              setWidth={"94%"}
            />
          </div>
        </div>
      </div>

      <div className={priceRate} >
        <FormControl style={{ width: "48%" }} variant="outlined" size="small" >
          <InputLabel htmlFor="outlined-adornment-amount" >Price</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={price}
            onChange={(e) => { setPrice(e.target.value) }}
            endAdornment={
              <InputAdornment position="start">
                $
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl style={{ width: "48%" }} variant="outlined" size="small" >
          <InputLabel htmlFor="outlined-adornment-amount" >Tax Rate</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={taxRate}
            onChange={(e) => { setTaxRate(e.target.value) }}
            endAdornment={
              <InputAdornment position="start">
                %
              </InputAdornment>
            }
          />
        </FormControl>
      </div>

      <div className={btnCont}>
        <Button variant="contained" color="primary" onClick={() => { setOpen(false) }}>Close</Button>
        <Button variant="contained" color="primary" onClick={() => { saveAndClose() }}>Save and Close</Button>
      </div>

      {CreateChartAccountComponent}

    </div>
  );
}
