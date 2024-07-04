import React, {useState, useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CreateButton from '../../styled/actionBtns/create.btn';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '19rem',
  },
  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
    flexWrap: 'wrap',
  },
  paperText: {
    margin: '1rem',
  },
  chip: {
    margin: '0.3rem',
  },
}));

const HandleJobCat = (props)=>{
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {jobId} = props;
  const {selectedJobCats, jobCatDictionary, jobDictionary} = useSelector((state)=>state.dashboard);
  const job = jobDictionary[jobId];

  useEffect(() => {
    dispatch({
      type: 'AddDashboard',
      payload: {
        selectedJobCats: job?.categories||[],
      },
    });
  }, []);

  return (
    <Paper className={classes.root}>
      <div className={classes.rowDiv}>
        <Typography variant="h6" gutterBottom className={classes.paperText}>
                    Job Categories
        </Typography>

        <CreateButton
          variant="contained"
          className={classes.button}
          startIcon={selectedJobCats.length>0?<EditIcon />:<AddIcon />}
          onClick={()=>{
            history.push('/dashboard/job/categories/'+jobId);
          }}
        >
          {selectedJobCats.length>0?'Edit':'Add'}
        </CreateButton>
      </div>

      <div className={classes.rowDiv}>
        {selectedJobCats.map((tagId) => {
          const tag = jobCatDictionary[tagId];

          return (

            <Chip
              className={classes.chip}
              label={tag.name}
            />

          );
        })}
      </div>

    </Paper>

  );
};

export default HandleJobCat;
