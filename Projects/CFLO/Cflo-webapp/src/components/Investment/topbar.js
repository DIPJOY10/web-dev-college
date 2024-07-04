import React, { useEffect, useRef, useState } from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  Toolbar,
} from '@material-ui/core';
import CreateBtn from '../styled/actionBtns/create.btn';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import {
  useHistory, useParams,
} from 'react-router-dom';
import Api from '../../helpers/Api';
import { setInvestments } from './investment.utils';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingRight: '3rem',
    height: '5.5rem',
    position: 'fixed',
    top: 0,
    right: 0,
    left: '17rem',
    [theme.breakpoints.down('sm')]: {
      left: '5rem',
    },
    [theme.breakpoints.down('xs')]: {
      left: '1rem',
    },
  },

  link: {
    display: 'flex',
  },

  createBtn: {
    position: 'fixed',
    top: '1rem',
    right: '2rem',
  },

}));

function CreateTopBar(props) {
  const { investmentId } = useParams();

  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);
  const { investmentDictionary } = dashboard;
  const investment = investmentDictionary[investmentId];
  const status = investment?.status ? investment?.status : 'Incomplete';

  const title = investment?.title ? investment.title : '';
  const description = investment?.description ? investment.description : '';

  const roles = investment?.roles ? investment.roles : [];
  const [isFilled, setIsFilled] = useState(false);

  const history = useHistory();

  const classes = useStyles();
  const {
    showCreate,
  } = props;

  let Btn = null;


  useEffect(() => {
    if (title?.length > 3 && description?.length > 3 && roles.length > 0) {
      setIsFilled(true);
    }
    else {
      setIsFilled(false);
    }
  }, [investment]);

  const updateApi = () => {
    Api.post('investment/update', {
      _id: investmentId,
      status: 'Review Pending',
    }).then((investmentNew) => {
      console.log(investmentNew, ' is the investment');

      setInvestments([{
        ...investment,
        status: 'Review Pending',
      }], dashboard, dispatch);
    });
  };

  switch (status) {
    case 'Incomplete':
      Btn = <div className={classes.createBtn}>
        {isFilled ? <CreateBtn endIcon={<DoneIcon />} onClick={() => {
          updateApi();
        }}
        >
          Submit For Review
        </CreateBtn> : <Button disabled={true}>Submit for Review</Button>}
      </div>;
      break;

    case 'Review Pending':
      Btn = <div className={classes.createBtn}>
        <Button disabled={true}>Under Review</Button>
      </div>;
      break;

    case 'Rejected':
      Btn = null;
      break;

    default:
      break;
  }

  return (
    <Toolbar className={classes.toolbar}>

      {Btn}
    </Toolbar>
  );
}

export default CreateTopBar;
