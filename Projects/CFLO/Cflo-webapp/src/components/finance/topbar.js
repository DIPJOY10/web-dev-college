import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
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
  const {
    walletId,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { 

  } = useSelector((state) => state);

  const {
    root, row, col, addNewBtn,
  } = classes;

  return (
    <div className={root}>

      <div className={row}>

        <div className={row}>

        </div>
        <ButtonBase
          className={addNewBtn}
          onClick={()=>{
            setOpen(!open);
          }}
        >
                    Add New
        </ButtonBase>
      </div>




    </div>
  );
}
