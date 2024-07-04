import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ForumIcon from '@material-ui/icons/Forum';
import WorkIcon from '@material-ui/icons/Work';
import PeopleIcon from '@material-ui/icons/People';
import Dialog from '@material-ui/core/Dialog';

import {useParams, useHistory} from 'react-router-dom';

import CloseBtn from '../styled/actionBtns/close.btn';
import _ from 'lodash';

import clsx from 'clsx';
import LinearProgress from '@material-ui/core/LinearProgress';


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1rem',
  },

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
    width: '100%',
    maxWidth: '40rem',
    marginBottom: '10rem',
  },

  colDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    width: '100%',
  },

  menuText: {
    color: '#424242',
    fontWeight: 600,
    height: '3rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    fontSize: 17,
  },

  paperText: {
    margin: '1rem',
  },
}));

export default function SimpleDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();


  const {setOpen, open} = props;

  const [selected, setSelected] = useState(false);
  const [activity, setActivity] = useState('Post');

  const onCreate = (activity)=>{
    let path = '/dashboard/create/post/';

    switch (activity) {
      case 'Job':
        path = '/dashboard/create/job/';
        history.push(path);
        break;

      case 'Investment':
        path = '/dashboard/create/investment/';
        history.push(path);
        break;

      case 'Post':
        path = '/dashboard/create/post/';
        history.push(path);
        setOpen(false);
        break;

      default:
        break;
    }
  };

  const history = useHistory();

  const handleClose = () => {
    // do not close
    setOpen(false);
  };

  return (

    <Dialog className={classes.colDiv} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>


      <Paper className={classes.root}>

        <List className={classes.colDiv}>

          <Typography variant="h6" gutterBottom className={classes.paperText}>
                    Select Activity
          </Typography>


          <ListItem button onClick={()=>onCreate('Job')}>
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Job" secondary="Post a job/contract for your company/project" />
          </ListItem>


          <ListItem button onClick={()=>{
            onCreate('Investment');
          }}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Partner or Invest" secondary="Pitch your project and get partners" />
          </ListItem>


          <ListItem button onClick={()=>{
            onCreate('Post');
          }}>
            <ListItemIcon>
              <ForumIcon />
            </ListItemIcon>
            <ListItemText primary="Forum" secondary="Ask a question or Create Post" />
          </ListItem>

        </List>


      </Paper>


    </Dialog>

  );
}
