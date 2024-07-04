import React, {useEffect, useRef, useState} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import {
  Toolbar, AppBar, Divider,
} from '@material-ui/core';
import CreateBtn from '../../styled/actionBtns/create.btn';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import {
  useHistory,
} from 'react-router-dom';
import Api from '../../../helpers/Api';
import {setJobs} from './job.utils';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    flex: 1,
    width: 'calc(100% - 17rem)',
    display: 'flex',
    flexDirection: 'row',
    paddingRight: '3rem',
    height: '4.5rem',
    position: 'fixed',
    top: 0,
    right: 0,
    left: '17rem',
    borderColor: 'black',
    borderWidth: '10px',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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
    right: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
  },

}));

function CreateTopBar(props) {
  const {
    job,
  } = props;

  const dispatch = useDispatch();


  const status = job?.status?job?.status:'Incomplete';
  const jobId = job?._id;
  const [isFilled, setIsFilled] = useState(false);

  const history = useHistory();

  const classes = useStyles();
  const {
    showCreate,
  } = props;

  let Btn = null;

  useEffect(() => {
    const {
      title, description, roles,
    } = job;
    // console.log()
    if (title?.length>3&&description?.length>3) {
      setIsFilled(true);
    }
    else {
      setIsFilled(false);
    }
  }, [job]);

  const updateApi = ()=>{
    Api.post('job/update', {
      _id: jobId,
      status: 'Review Pending',
    }).then((jobNew)=>{

    });
  };

  switch (status) {
    case 'Incomplete':
      Btn = <div className={classes.createBtn}>
        {isFilled?<CreateBtn endIcon={<DoneIcon />} onClick={()=>{
          updateApi();
        }}
        >
                Submit
        </CreateBtn>:<Button disabled={true}>Submit for Review</Button>}
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
    <AppBar className={classes.toolbar} elevation={1}>
      <Toolbar>
        {Btn}

      </Toolbar>

    </AppBar>

  );
}

export default CreateTopBar;
