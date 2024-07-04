import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import CreateChartAccountForTax from './CreateChartAccountForTax';
import CreateChartAccountForDiscount from './CreateChartAccountForDiscoun';
import { getIncomeChartAccounts } from '../offering/utils';
import { createDiscountOrTaxAndRelation, createDiscountOrTaxRelation, getDiscountOrTaxByName } from './api';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';


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
    width: '45%',
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
    justifyContent: 'space-between',
  },
  amountCont: {
    display: "flex",
    width: "100%",
    justifyContent: 'space-between',
    marginTop: "20px",
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginBottom: "10px"
    },
  },
  taxDiscountCont: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: "10px"
    },
  },
  rateText: {
    width: "60%",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    },
  },
  titleCont: {

  },
  optionToBar: {
    display: "flex",
    paddingLeft: "10px",
    paddingRight: "10px",
    justifyContent: 'space-between',
  }
}));

export default function CreateDiscountOrTax(props) {
  const {
    text, setOpen, onSelect, setLoading, tx, createType,
  } = props;

  const {
    walletId,
  } = useParams();


  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  // const {
  //   user,
  //   userProfile
  // } = useSelector((state) => state);

  const { auth } = useSelector((state) => state);
  const { user, userProfile } = auth;

  console.log("user")
  console.log(user)
  console.log("userProfile")
  console.log(auth)

  const {
    root, inputCont, taxDiscountCont,
    normalInput, priceRate, rateText,
    btnCont, amountCont,
    titleCont, optionToBar
  } = classes;

  const [menu, setMenu] = useState(false);




  const [openChartAcc, setOpenChartAcc] = useState(false)



  const [doYouOwnIt, setDoYouOwnIt] = useState(true);
  const [price, setPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(0);




  const [name, setName] = useState(text);
  const [description, setDescription] = useState('');
  const [discountOrTaxObj, setDiscountOrTaxObj] = useState(null)
  const [options, setOptions] = useState([])

  const [chartAccounts, setChartAccounts] = useState([]);
  const [selectedChartAccount, setSelectedChartAccount] = useState({});
  const [chartAccountText, setChartAccountText] = useState({});

  const [amountType, setAmountType] = useState("")
  const [amount, setAmount] = useState(0)



  useEffect(() => {

    let type

    if (createType == 'Discount') {
      type = { qbName: "Discounts/Refunds Given", wallet: walletId }
    } else if (createType == 'Tax') {
      type = { classification: "Other Current Liabilities", wallet: walletId }
    }

    getIncomeChartAccounts({ type })
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


  const saveAndClose = async () => {
    setOpen(false);
    setLoading(true);

    let discountOrTaxRelation = {
      chartAccount: selectedChartAccount?._id,
      name: name,
      description: description,
      model: createType,
      type: amountType,
      amount: amount,
      percent: amount,
      vendor: tx?.secondParty?._id,
      wallet: walletId,
      addedBy: user?.profile,
      user: user?.model == 'User' ? user._id : userProfile?._id,
    }

    if (discountOrTaxObj === null) {

      const discountOrTax = {
        name: name,
        description: description,
        model: createType,
        type: amountType,
        amount: amount,
        percent: amount,
        wallet: walletId,
        addedBy: user?.profile,
        user: user?.model == 'User' ? user._id : userProfile?._id
      }

      await createDiscountOrTaxAndRelation({ discountOrTax, discountOrTaxRelation })
        .then((savedData) => {
          console.log(savedData)
          let orgData = savedData?.savedRelation
          orgData.chartAccount = selectedChartAccount
          orgData.discountOrTax = savedData?.savedDiscountOrTax

          setLoading(false)
          if (onSelect) {
            onSelect(orgData, true);
          }
        })
        .catch((err) => {
          console.log(err)
        })

    } else {
      discountOrTaxRelation.discountOrTax = discountOrTaxObj?._id
      await createDiscountOrTaxRelation({ discountOrTaxRelation })
        .then((savedData) => {
          console.log(savedData)
          let orgData = savedData
          orgData.chartAccount = selectedChartAccount
          orgData.discountOrTax = discountOrTaxObj

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

  const onChartAccountSelect = (value) => {
    setSelectedChartAccount(value)
  }

  const onNew = () => {
    setOpenChartAcc(true);
  };

  // after created new chart account

  const chartAccountCreateDialog = (value) => {
    console.log(value);
    setOpenChartAcc(value)
    let type

    if (createType == 'Discount') {
      type = { qbName: "Discounts/Refunds Given", wallet: walletId }
    } else if (createType == 'Tax') {
      type = { classification: "Other Current Liabilities", wallet: walletId }
    }

    getIncomeChartAccounts({ type })
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
    setName(value)

    if (value && value.length > 1) {
      await getDiscountOrTaxByName({
        model: createType,
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
      setAmountType("")
      setAmount(0)
      setDescription("")
    } else {
      setName(value?.name)
      if (value?.type === "%") {
        setAmountType(value?.type)
        setAmount(value?.percent)
      } else if (value?.type === "$") {
        setAmountType(value?.type)
        setAmount(value?.amount)
      }
      setDescription(value?.description)
    }
    setDiscountOrTaxObj(value)
  }

  const getFirst200 = (str) => {
    const newDis = str.substr(0, 150) + '...'
    return newDis
  }



  let CreateChartAccountComponent = null

  switch (createType) {
    case 'Discount':
      CreateChartAccountComponent = <CreateChartAccountForDiscount
        walletId={walletId}
        openDialog={openChartAcc}
        setOpenChart={chartAccountCreateDialog}
      />
      break;
    case 'Tax':
      CreateChartAccountComponent = <CreateChartAccountForTax
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
          value={discountOrTaxObj}
          inputValue={name}
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionSelected={(option) => {
            return option?._id == discountOrTaxObj?._id;
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
                    <div>{option?.name}</div>
                    <div> {option?.type === "%" ? <>{option?.percent}%</> : <>{option?.amount}$</>} </div>
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
          <div style={{ marginTop: "20px", marginLeft: "-18px" }} >
            <MyAutocomplete
              isSmall={false}
              value={selectedChartAccount}
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

          <div className={amountCont} >
            <div className={taxDiscountCont} >
              <Button
                variant={amountType === "%" ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => { setAmountType("%") }}
                style={{ minWidth: "40px", height: "100%" }}
              >
                %
              </Button>
              <Button
                variant={amountType === "$" ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => { setAmountType("$") }}
                style={{ minWidth: "40px", height: "100%" }}
              >
                $
              </Button>
            </div>
            <FormControl className={rateText} variant="outlined" size="small" >
              <InputLabel htmlFor="outlined-adornment-amount">Rate</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={amount}
                onChange={(e) => { setAmount(e.target.value) }}
                endAdornment={
                  <InputAdornment position="start">
                    {amountType === "%" && <>%</>}
                    {amountType === "$" && <>$</>}
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
        </div>
      </div>
      <div className={btnCont}>
        <Button variant="contained" color="primary" onClick={() => { setOpen(false) }}>Close</Button>
        <Button variant="contained" color="primary" onClick={() => { saveAndClose() }}>Save and Close</Button>
      </div>
      {CreateChartAccountComponent}
    </div>
  );
}
