import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import cx from "clsx";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { NumInput, NewInputBase, DescriptionInput } from "../styles";
import Checkbox from "@material-ui/core/Checkbox";
import NumberFormat from "react-number-format";
import { InputBase, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import TopLine from "./top.line";
import EditListItem from "./edit.list.item";
import AddItemBtn from "./add.item.btn";
import MoneyPopOver from "./popper";
import Api from "../../../helpers/Api";
import useTotalBlocks from "./total.hook";
import { getOfferingWithRelation } from "../offering/utils";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getDiscountOrTaxes } from "../transaction/api";
import TxSecondParty from "../transaction/secondParty";


const useStyles = makeStyles((theme) => ({
  root: {},

  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    marginTop: "1rem",
    flexWrap: "wrap",
  },

  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: "600",
    minWidth: "6rem",
  },

  bottomRow: {
    maxWidth: "48rem",
    width: "90%",
  },
  alignTable: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
    [theme.breakpoints.down('md')]: {
      marginTop: "20px"
    },
  },
  taxDiscountAndTotal: {
    width: "99%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
      flexDirection: "column",
      justifyContent: "space-around",
    },
  },
  grandTotalCont: {
    width: "24rem",
    [theme.breakpoints.down('md')]: {
      marginTop: "30px",
      width: "96%",
    },
  },
  cellStyle: {
    padding: "10px 8px",
    opacity: "0.6",
    [theme.breakpoints.down('sm')]: {
      padding: "7px 4px",
    },
  }
}));

export default function BillListEdit(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { walletId } = useParams();
  const {
    billList,
    setBillList,
    billItemDictionary,
    setBillItemDictionary,
    tx,
    setTx,
    showGL,
    updateApi,
    setLoadingBool
  } = props;


  console.log(billList)
  console.log(tx)

  const billListProps = props?.billList;

  const oldOrder = billList.orderReverse;
  const [order, setOrder] = useState(oldOrder);

  const itemIds = billList?.items || [];
  const [offerings, setOfferings] = useState([]);
  const {
    root, row, col, bottomRow,
    center, alignTable, taxDiscountAndTotal,
    grandTotalCont, cellStyle
  } = classes;

  const [discounts, setDiscounts] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [discountValue, setDiscountValue] = useState(null);
  const [taxValue, setTaxValue] = useState(null);

  const oldDiscountListObj = billList?.discount
  const [discountListObj, setDiscountListObj] = useState(oldDiscountListObj)

  const oldTaxListObj = billList?.tax
  const [taxListObj, setTaxListObj] = useState(oldTaxListObj)


  const { SubTotalView, TaxView, DiscountView, GrandTotalView } =
    useTotalBlocks({
      tx,
      updateApi
    });



  const update = async (obj) => {
    setLoadingBool(true)

    if (billList?._id) {
      await Api.post("wallet/billList/update", {
        _id: billList._id,
        ...obj,
      }).then((res) => {
        const data = res.data;
        console.log(data);
        setBillList(data);
        setDiscountListObj(data?.discount)
        setTaxListObj(data?.tax)
      });
    }

    setLoadingBool(false)
  };

  useEffect(() => {

    let onwValue = null

    if (tx?.type === "Invoice") {
      onwValue = true
    } else if (tx?.type === "Bill") {
      onwValue = false
    }

    getOfferingWithRelation({
      walletId,
      own: onwValue
    })
      .then((offeringRelations) => {
        const addObject = {
          _id: 'New',
          name: "+ Add New",
          numDays: "0"
        };

        let newOfferingsArr = []
        newOfferingsArr = [addObject, ...offeringRelations]
        setOfferings(newOfferingsArr);
      })
      .catch((err) => {
        console.log(err);
      })



    getDiscountOrTaxes({ walletId })
      .then((discountOrTaxs) => {

        let discounts = []
        let taxes = []

        discountOrTaxs.length > 0 && discountOrTaxs.map((discountOrTax) => {
          if (discountOrTax.model === "Discount") {
            discounts.push(discountOrTax)
          } else if (discountOrTax.model === "Tax") {
            taxes.push(discountOrTax)
          }
        })

        const addObject = {
          _id: 'New',
          name: "+ Add New",
          numDays: "0"
        };
        const modifiedDiscounts = [addObject, ...discounts];
        setDiscounts(modifiedDiscounts)

        if (billList?.discountRelationModel) {
          setDiscountValue(billList?.discountRelationModel)
        } else {
          setDiscountValue(modifiedDiscounts[1])
        }

        const modifiedtaxes = [addObject, ...taxes];
        setTaxes(modifiedtaxes)

        if (billList?.taxRelationModel) {
          setTaxValue(billList?.taxRelationModel)
        } else {
          setTaxValue(modifiedtaxes[1])
        }

      })
      .catch((err) => {
        console.log(err);
      })

  }, [billList]);


  const selectDiscount = async (selected, newlyCreated = false) => {
    console.log(selected)

    if (selected && selected._id) {
      setDiscountValue(selected);

      let newBillDiscountObj = {
        enabled: billList?.discount?.enabled,
        type: selected?.type,
      };

      if (selected.type === "%") {
        newBillDiscountObj.percent = selected?.percent
      } else if (selected.type === "$") {
        newBillDiscountObj.amount = selected?.amount
      }

      const newBillListUpdate = {
        discountRelationModel: selected?._id,
        discount: newBillDiscountObj
      };

      setDiscountValue(selected);

      if (newlyCreated) {
        const discountArr = [...discounts, selected]
        setDiscounts(discountArr)
      }

      update(newBillListUpdate);
    }
  }


  const selectTax = async (selected, newlyCreated = false) => {
    console.log(selected)

    if (selected && selected._id) {
      setTaxValue(selected);

      let newBillTaxObj = {
        enabled: billList?.tax?.enabled,
        type: selected?.type,
      };

      if (selected.type === "%") {
        newBillTaxObj.percent = selected?.percent
      } else if (selected.type === "$") {
        newBillTaxObj.amount = selected?.amount
      }

      const newBillListUpdate = {
        taxRelationModel: selected?._id,
        tax: newBillTaxObj
      };

      setTaxValue(selected);

      if (newlyCreated) {
        const taxesArr = [...taxes, selected]
        setTaxes(taxesArr)
      }

      update(newBillListUpdate);

    }
  }

  const selectDefaultTax = async () => {

    console.log(" get Call Tax")

    if (taxValue && taxValue._id) {

      const newBillListUpdate = {
        taxRelationModel: taxValue?._id
      };

      update(newBillListUpdate);
    }
  }


  const selectDefaultDiscount = async () => {

    console.log(" get Call dis")

    if (discountValue && discountValue._id) {

      const newBillListUpdate = {
        discountRelationModel: discountValue?._id
      };

      update(newBillListUpdate);
    }
  }




  const Discount = (
    <div className={row}>
      <MoneyPopOver
        key="discount"
        placeholder={"Discount"}
        valObjGiven={discountListObj}
        taxesOrDiscounts={discounts}
        taxOrDiscountValue={discountValue}
        onSelect={selectDiscount}
        callDefaultAdd={selectDefaultDiscount}
        tx={tx}
        setValObj={(valObj) => {
          update({
            discount: valObj,
          });
        }}
      />
      {billList?.discount?.enabled ? (
        <IconButton
          onClick={() => {
            update({
              discount: {
                enabled: false,
                amount: 0,
                percent: 0,
                type: "$",
              },
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
      ) : null}
    </div>
  );

  const Tax = (
    <div className={row}>
      <MoneyPopOver
        key="tax"
        placeholder={"Tax"}
        valObjGiven={taxListObj}
        taxesOrDiscounts={taxes}
        taxOrDiscountValue={taxValue}
        onSelect={selectTax}
        callDefaultAdd={selectDefaultTax}
        tx={tx}
        setValObj={(valObj) => {
          update({
            tax: valObj,
          });
        }}
      />
      {billList?.tax?.enabled ? (
        <IconButton
          onClick={() => {
            update({
              tax: {
                enabled: false,
                amount: 0,
                percent: 0,
                type: "%",
              },
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
      ) : null}
    </div>
  );

  return (
    <div className={col}>
      {itemIds.map((itemId) => {
        const item = billItemDictionary[itemId];

        return item?._id ? (
          <EditListItem
            billItemDict={billItemDictionary}
            setBillItemDict={setBillItemDictionary}
            billList={billList}
            setBillList={setBillList}
            key={itemId}
            itemId={itemId}
            offeringRelations={offerings}
            tx={tx}
            setOfferingRelations={setOfferings}
            setLoadingBool={setLoadingBool}
          />
        ) : null;
      })}
      <div className={row}>
        <AddItemBtn
          billList={billList}
          setBillList={setBillList}
          billItemDictionary={billItemDictionary}
          setBillItemDictionary={setBillItemDictionary}
          setLoadingBool={setLoadingBool}
        />
      </div>


      <div className={taxDiscountAndTotal} >


        {tx?.type === "Bill" ? <div></div> :
          <Paper className={cx(alignTable)}>
            <div className={cx(row, center)}>
              <IconButton
                onClick={() => {
                  update({
                    orderReverse: !order,
                  });
                  setOrder(!order);
                }}
              >
                <SwapVertIcon />
              </IconButton>
              <div className={col}>
                {order ? (
                  <>
                    {Tax}
                    {Discount}
                  </>
                ) : (
                  <>
                    {Discount}
                    {Tax}
                  </>
                )}
              </div>
            </div>
          </Paper>
        }
        <div className={grandTotalCont} >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Sub Total</TableCell>
                  <TableCell align="right">{SubTotalView}</TableCell>
                </TableRow>
                {tx?.type === "Bill" ? <></> : <>
                  <TableRow>
                    <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Tax</TableCell>
                    <TableCell align="right">{TaxView}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Discount</TableCell>
                    <TableCell align="right">{DiscountView}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Grand Total</TableCell>
                    <TableCell align="right">{GrandTotalView}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={cellStyle} style={{ paddingLeft: "8px" }} align="left" >Late Fees</TableCell>
                    <TableCell className={cellStyle} align="right">${tx?.lateFeeAmount}</TableCell>
                  </TableRow>
                </>}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
