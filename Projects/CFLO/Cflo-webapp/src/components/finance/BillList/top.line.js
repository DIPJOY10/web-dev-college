import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Autocomplete from '../offering/index';
import {
  nameSizeMax, taxSizeMax, totalSizeMax,
  rateSizeMax, qtySizeMax, categorySizeMax
} from './listItemConst';

const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    marginTop: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  nameStyle: {
    width: '90%',
    maxWidth: nameSizeMax,
    height: '2.5rem',
  },


  categoryStyle: {
    width: '60%',
    maxWidth: categorySizeMax,
    height: '2.5rem',
  },

  qtyStyle: {
    width: '30%',
    maxWidth: qtySizeMax,
    height: '2.5rem',
  },

  rateStyle: {
    width: '30%',
    maxWidth: rateSizeMax,
    height: '2.5rem',
  },

  tax: {
    width: '30%',
    maxWidth: taxSizeMax,
    height: '2.5rem',
  },

  total: {
    width: '30%',
    maxWidth: totalSizeMax,
    height: '2.5rem',
  },

  bottomLine: {
    maxWidth: '48rem',
    width: '90%',
    height: '0.2rem',
    backgroundColor: '#e0e0e0',
  },


}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [offering, setOffering] = useState(null);
  const [listObject, setListObject] = useState({
    offering: null,
    type: null,
    name: '',
    description: '',
    qTy: 1,
    price: 0,
    taxPercent: 0,
  });

  const {

  } = useSelector((state) => state);

  const {
    root, row, col, nameStyle, categoryStyle,
    qtyStyle, rateStyle, tax, total, center, bottomLine,
  } = classes;

  const onSelect = (selected)=>{
    setOffering(selected);
  };

  return (
    <div className={col}>
      <div className={row}>

        <div className={cx(nameStyle, center)}>
          <Typography variant="button" className={center}>ITEMS</Typography>
        </div>

        <div className={cx(categoryStyle, center)}>
          <Typography variant="button" className={center}>CATEGORY</Typography>
        </div>

        <div className={cx(qtyStyle, center)}>
          <Typography variant="button" className={center}>Qty</Typography>
        </div>
        <div className={cx(rateStyle, center)}>
          <Typography variant="button" className={center}>Rate</Typography>
        </div>
        <div className={cx(tax, center)}>
          <Typography variant="button" className={center}>Tax</Typography>
        </div>
        <div className={cx(total, center)}>
          <Typography variant="button" className={center}>Total</Typography>
        </div>

      </div>
      <div className={bottomLine}>

      </div>
    </div>

  );
}
