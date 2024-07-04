import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Api from '../../../helpers/Api';
import arrayToReducer from '../../../helpers/arrayToReducer';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  textStyle: {
    fontSize: '1rem',
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  paper: {

    maxHeight: '2rem',
  },
  btnStyle: {
    padding: '0.25rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    maxHeight: '2rem',
  },
}));

export default function AddItemBtn(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();


  const {
    textStyle, btnStyle, paper,
  } = classes;

  const {
    billList,
    setBillList,
    billItemDictionary,
    setBillItemDictionary,
    setLoadingBool
  } = props;

  const [loading, setLoading] = useState(false);

  const addItem = async () => {
    setLoadingBool(true)

    if (billList?._id) {
      setLoading(true);
      await Api.post('wallet/billList/add/item', {
        billListId: billList._id,
      }).then((res) => {
        setLoading(false);
        const data = res?.data;
        const billListRes = data?.billList;
        const billItem = data?.billItem;

        const {
          newDict,
        } = arrayToReducer([billItem]);

        setBillList({
          ...billList,
          items: [...billList.items, billItem?._id],
        });

        setBillItemDictionary({
          ...billItemDictionary,
          ...newDict,
        });
      });
    }

    setLoadingBool(false)
  };

  return (
    <Paper
      className={paper}
    >
      <ButtonBase
        onClick={() => {
          addItem();
        }}
        className={btnStyle}
        disabled={loading}
      >
        <AddIcon color="primary" />
        <Typography className={textStyle}>
          Add Bill Item
        </Typography>

      </ButtonBase>
    </Paper>

  );
}
