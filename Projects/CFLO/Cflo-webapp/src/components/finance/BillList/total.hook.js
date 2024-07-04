import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import { Divider } from '@material-ui/core';
import totalBilllist from './total.billlist';



export default function useTotalBlocks({ tx, updateApi }) {

  const {
    subTotal, totalTax, totalDiscount, grandTotal
  } = totalBilllist(tx);


  useEffect(() => {
    console.log("useEffect: " + subTotal)
    updateApi({
      _id: tx?._id,
      amount: subTotal,
      finalAmount : Number(grandTotal)?.toFixed(2)
    })
  }, [subTotal, grandTotal]);

  const SubTotalView = (
    <span>
      ${Number(subTotal)?.toFixed(2)}
    </span>
  );

  const TaxView = (
    <span>
      ${Number(totalTax)?.toFixed(2)}
    </span>
  );

  const DiscountView = (
    <span>
      ${Number(totalDiscount)?.toFixed(2)}
    </span>
  );

  const GrandTotalView = (
    <span>
      ${Number(grandTotal)?.toFixed(2)}
    </span>
  );

return {
  SubTotalView, TaxView, DiscountView, GrandTotalView
};
}
