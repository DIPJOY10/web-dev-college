import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import DropdownBtn from '../../styled/actionBtns/dropdown.btn';
import CloseBtn from '../../styled/actionBtns/close.btn';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import EditBtn from '../../styled/actionBtns/edit.btn';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    right: 0,
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

  activityName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '1.5rem',
  },

  margin: {
    margin: '1rem',
  },


}));
export default function S(props) {
  const {
    activity, disabled, textArr, funcArr, onExit,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const {

  } = useSelector((state) => state);

  const {
    root, row, col, margin, activityName,
  } = classes;

  return (
    <div className={root}>

      <div className={row}>
        <div className={clsx(row, activityName)}>
          {activity}

        </div>


        <DropdownBtn
          disabled={disabled}
          textArr={textArr}
          funcArr={funcArr}
        />

        <span className={margin}>
          <CloseBtn
            onClick={()=>{
              if (onExit) {
                onExit();
              }
              else {
                history.goBack();
              }
            }}
          />
        </span>
      </div>


      <Divider />


    </div>
  );
}
