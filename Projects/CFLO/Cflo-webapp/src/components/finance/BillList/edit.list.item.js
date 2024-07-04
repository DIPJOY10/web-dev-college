import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Autocomplete from '../offering/autocomplete';
import { NumInput, NewInputBase, DescriptionInput } from '../styles';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import { InputBase, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDebounce } from 'react-use';
import Api from '../../../helpers/Api';
import arrayToReducer from '../../../helpers/arrayToReducer';
import _ from 'lodash';
import {
  nameSizeMax, taxSizeMax,
  rateSizeMax, qtySizeMax,
  totalSizeMax, fullMax,
  categorySizeMax
} from './listItemConst';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import { getIncomeChartAccounts } from '../offering/utils';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CreateOffering from '../offering/create.offering';
import AutocompleteWithSeveralCreates from '../../styled/CommonComponents/AutocompleteWithSeveralCreates';






const useStyles = makeStyles((theme) => ({
  paperSty: {
    marginTop: "30px",
    display: "flex",
    width: "98%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: "10px",
    paddingTop: "10px",
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: "center",
      width: "98%",
    },
  },
  mainCont: {
    width: "93%",
  },
  topCont: {
    display: "flex",
    margin: "5px",
    justifyContent: "space-around",
    width: "100%",
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  productAndCategory: {
    display: "flex",
    width: "33%",
    justifyContent: "space-around",
    marginBottom: "10px",
    [theme.breakpoints.down('md')]: {
      width: "100%",
      justifyContent: "space-between",
    },
  },
  qtyAndRate: {
    display: "flex",
    width: "33%",
    justifyContent: "space-around",
    marginBottom: "10px",
    [theme.breakpoints.down('md')]: {
      width: "100%",
      justifyContent: "space-between",
    },
  },
  taxAndTotal: {
    display: "flex",
    width: "33%",
    justifyContent: "space-around",
    marginBottom: "10px",
    [theme.breakpoints.down('md')]: {
      width: "100%",
      justifyContent: "space-between",
    },
  },
  txAndQty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "33%",
    [theme.breakpoints.down('md')]: {
      width: "49%",
    },
    [theme.breakpoints.down('sm')]: {
      width: "30%",
    },
  },
  rateAndTotal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "65%",
    [theme.breakpoints.down('md')]: {
      width: "49%",
    },
    [theme.breakpoints.down('sm')]: {
      width: "68%",
    },
  },
  itemCont: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
      display: "block",
    },
  },
  bottomCont: {
    // width: "900px",
    marginLeft: " 10px"

  },
  deleteCont: {
    margin: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  optionBtnCont: {
    position: "absolute",
    top: "-21px",
    left: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionBtn: {
    margin: "0px",
    padding: "1px 6px",
    fontSize: "9px",
    borderRadius: "0px",
    [theme.breakpoints.down('sm')]: {
      fontSize: "7px",
    }
  }

}));

export default function EditBillListItem(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    paperSty,
    topCont,
    productAndCategory,
    qtyAndRate,
    taxAndTotal,
    bottomCont,
    deleteCont,
    itemCont,
    mainCont,
    txAndQty,
    rateAndTotal
  } = classes;


  const {
    itemId,
    offeringRelations,
    billItemDict,
    setBillItemDict,
    billList,
    setBillList,
    tx,
    setOfferingRelations
  } = props;


  const {
    walletId,
  } = useParams();

  const billItemOld = billItemDict[itemId];

  console.log("billItemOld", billItemOld)

  const oldOffering = billItemOld?.offeringRelation || null;
  const oldDesc = billItemOld?.description || " ";
  const oldQty = billItemOld?.qTy || 1;
  const oldRate = billItemOld?.rate || 0;
  const oldCategory = billItemOld?.chartAccount || null;
  const oldOfferingName = billItemOld?.name || ""

  const [offeringRelationValue, setOfferingRelationValue] = useState(oldOffering);
  const [itemObject, setItemObject] = useState(billItemOld);
  const [desc, setDesc] = useState(oldDesc);
  const [qty, setQty] = useState(oldQty);
  const [rate, setRate] = useState(oldRate);

  const [chartAccounts, setChartAccounts] = useState([]);
  const [selectedChartAccount, setSelectedChartAccount] = useState(oldCategory);
  const [categoryText, setCategoryText] = useState("")
  const [isOfferingObjBool, setIsOfferingObjBool] = useState(true);
  const [offeringNameText, setOfferingNameText] = useState(oldOfferingName)

  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  console.log(tx)

  useEffect(() => {
    const oldIsOfferingObj = itemObject?.isOfferingObj;
    setIsOfferingObjBool(oldIsOfferingObj)
  }, [itemObject])

  useEffect(() => {
    let type
    let defaultAccName
    if (tx?.type == 'Invoice') {
      type = { wallet: walletId }
      defaultAccName = "Default Income Acc"
    } else if (tx?.type == 'Bill') {
      type = { wallet: walletId }
      defaultAccName = "Default Expense Acc"
    }

    getIncomeChartAccounts({ type })
      .then((accounts) => {
        setChartAccounts(accounts)
        let selectedAcc

        accounts.length > 0 && accounts.map((acc) => {
          if (acc?.name === defaultAccName) {
            selectedAcc = acc
          }
        })


        if (!selectedChartAccount && !offeringRelationValue && offeringRelations.length > 1) {
          setOfferingRelationValue(offeringRelations[1])
          setSelectedChartAccount(selectedAcc)
          if (offeringRelations[1] && offeringRelations[1]._id) {

            let selected = offeringRelations[1];

            const newOfferingForUpdate = {
              ...itemObject,
              offeringRelation: selected._id,
              chartAccount: selectedAcc?._id,
              type: selected.model,
              name: selected.name,
              description: selected.description,
              qTy: 1,
              rate: selected.price,
              tax: false,
            };

            console.log(newOfferingForUpdate)

            const newOfferingForFE = {
              ...itemObject,
              offeringRelation: selected,
              chartAccount: selectedAcc,
              type: selected.model,
              name: selected.name,
              description: selected.description,
              qTy: 1,
              rate: selected.price,
              tax: false,
            };

            setDesc(selected.description);
            setQty(1);
            setRate(selected.price);
            setItemObject(newOfferingForFE);

            updateApi(newOfferingForUpdate);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }, [offeringRelations, offeringRelationValue, tx])


  const updateApi = (obj) => {
    Api.post('wallet/billList/update/item', obj)
      .then((res) => {
        const item = res?.data;
        const {
          newDict,
        } = arrayToReducer([item]);

        setBillItemDict({
          ...billItemDict,
          ...newDict,
        });
      });
  };

  useDebounce(() => {
    const isEqual = _.isEqual(itemObject, billItemOld);
    console.log(isEqual, billItemOld);
    if (!isEqual) {
      updateApi(itemObject);
    }
  }, 1000, [itemObject]);


  const onSelect = (selected, newlyCreated = false) => {

    console.log(selected)

    if (selected && selected._id) {
      setOfferingRelationValue(selected);

      const newOfferingForUpdate = {
        ...itemObject,
        offeringRelation: selected._id,
        chartAccount: selected?.chartAccount?._id,
        type: selected.model,
        name: selected.name,
        description: selected.description,
        qTy: 1,
        rate: selected.price,
        tax: false,
      };

      console.log(newOfferingForUpdate)

      const newOfferingForFE = {
        ...itemObject,
        offeringRelation: selected,
        chartAccount: selected?.chartAccount,
        type: selected.model,
        name: selected.name,
        description: selected.description,
        qTy: 1,
        rate: selected.price,
        tax: false,
      };

      setDesc(selected.description);
      setQty(1);
      setRate(selected.price);
      setSelectedChartAccount(selected?.chartAccount)

      setItemObject(newOfferingForFE);

      if (newlyCreated) {
        const productArr = [...offeringRelations, selected]
        setOfferingRelations(productArr)
      }

      updateApi(newOfferingForUpdate);
    }
  };


  const [loading, setLoading] = useState(false);

  const deleteItem = () => {
    if (billList?._id) {
      setLoading(true);

      const itemOld = billList.items;
      const newItems = _.difference(itemOld, [itemId]);

      setBillList({
        ...billList,
        items: newItems,
      });


      Api.post('wallet/billList/delete/item', {
        billId: billList._id,
        itemId,
      }).then((res) => {
        setLoading(false);
      });
    }
  };

  const getOptionLabel = (option) => {
    return option?.name || " ";
  };

  const categorySelected = (category) => {

    const newOfferingForUpdate = {
      ...itemObject,
      chartAccount: category?._id,
    };

    const newOfferingForFE = {
      ...itemObject,
      chartAccount: category,
    };

    setSelectedChartAccount(category)
    setItemObject(newOfferingForFE);
    updateApi(newOfferingForUpdate);
  }

  const matches = useMediaQuery("(max-width:1000px)");

  return (
    <Paper className={paperSty} square variant={"outlined"} >
      <div className={mainCont} >
        <div className={topCont} >
          <div className={productAndCategory} >
            <div className={itemCont} style={{ position: "relative", marginTop: "-5px", marginLeft: "-18px", width: "49%" }} >

              {/* <div className={classes.optionBtnCont} >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.optionBtn}
                  onClick={() => {
                    setIsOfferingObjBool(false)
                    updateApi({ ...itemObject, isOfferingObj: false });

                    const newObj = { ...itemObject, isOfferingObj: false };
                    setItemObject(newObj)
                  }}
                >Enter Name</Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.optionBtn}
                  style={{ marginLeft: "5px" }}
                  onClick={() => {
                    setIsOfferingObjBool(true)
                    updateApi({ ...itemObject, isOfferingObj: true });

                    const newObj = { ...itemObject, isOfferingObj: true };
                    setItemObject(newObj)
                  }}
                >Select Name</Button>
              </div> */}

              {isOfferingObjBool ? (
                <AutocompleteWithSeveralCreates
                  value={offeringRelationValue}
                  offerings={offeringRelations}
                  onSelect={onSelect}
                  placeholder={'Product & Services'}
                  tx={tx}
                  text={text}
                  setText={setText}
                  open={open}
                  setOpen={setOpen}
                  loading={createLoading}
                  setLoading={setCreateLoading}
                  getOptionLabel={getOptionLabel}
                  lable={"Product/Services"}
                  CreateDialogBox={
                    <CreateOffering
                      text={text}
                      setOpen={setOpen}
                      setLoading={setCreateLoading}
                      onSelect={onSelect}
                      tx={tx}
                    />
                  }
                />
              ) : (
                <TextField
                  id="outlined-basic"
                  label="Product & Services"
                  variant="outlined"
                  placeholder="Product & Services"
                  value={offeringNameText}
                  onChange={async (e) => {
                    setOfferingNameText(e.target.value)
                    await updateApi({ ...itemObject, name: e.target.value });
                  }}
                  size="small"
                  style={{ width: "100%", marginLeft: "23px", marginTop: "5px" }}
                />
              )}



            </div>
            <div className={itemCont} style={{ marginTop: "-5px", marginRight: "18px", width: "49%" }} >
              <MyAutocomplete
                isSmall={false}
                value={selectedChartAccount}
                text={categoryText}
                setText={setCategoryText}
                placeholder={"Category"}
                results={chartAccounts}
                getOptionLabel={getOptionLabel}
                onSelect={categorySelected}
                label={"Category"}
                setWidth={"100%"}
              />
            </div>
          </div>
          <div className={qtyAndRate} >
            <div className={txAndQty} >
              <TextField
                id="outlined-basic"
                label="qTy"
                variant="outlined"
                value={qty}
                onChange={(e) => {
                  setQty(e.target.value)
                  setItemObject({
                    ...itemObject,
                    qTy: e.target.value,
                  });
                }}
                size="small"
                style={{ width: "100%" }}
              />
            </div>
            <div className={rateAndTotal} >
              <FormControl fullWidth className={classes.margin} variant="outlined" size="small" >
                <InputLabel htmlFor="outlined-adornment-amount">Rate</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  value={rate}
                  onChange={(e) => {
                    setRate(e.target.value)
                    setItemObject({
                      ...itemObject,
                      rate: e.target.value,
                    });
                  }}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={60}
                />
              </FormControl>
            </div>
          </div>
          <div className={taxAndTotal} >
            <div className={txAndQty}  >
              <Checkbox
                color="primary"
                checked={itemObject?.tax}
                onChange={(event) => {
                  setItemObject({
                    ...itemObject,
                    tax: event.target.checked,
                  });
                }}
              />
            </div>
            <div className={rateAndTotal} >
              <FormControl fullWidth className={classes.margin} variant="outlined" size="small" >
                <InputLabel htmlFor="outlined-adornment-amount">Total</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  value={itemObject?.qTy * itemObject?.rate}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={60}
                />
              </FormControl>
            </div>
          </div>
        </div>
        <div className={bottomCont} >
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={matches ? 2 : 1}
            variant="outlined"
            value={desc}
            onChange={(e) => { setDesc(e.target.value) }}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className={deleteCont} >
        <IconButton onClick={() => {
          deleteItem();
        }}><DeleteIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
