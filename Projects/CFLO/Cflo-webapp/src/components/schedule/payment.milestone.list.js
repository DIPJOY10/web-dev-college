import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import PMCard from './payment.milestone.card';


const useStyles = makeStyles((theme) => ({
  root: {

  },

  tabRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '1rem',
    padding: '1rem',
    height: '4rem',
    maxHeight: '4rem',
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
}));
export default function PMList(props) {
  const {
    milestones, setMode, setEditPM, onPMDelete,
  } = props;

  // console.log(milestones,' is the milestones')

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  return (
    <div className={root}>


      {milestones.map((milestone)=>{
        const milestoneId = milestone._id;

        return <PMCard
          key={milestoneId}
          milestoneId={milestoneId}
          onEditClick={()=>{
            setEditPM(milestoneId);
            setMode('Edit');
          }}
          onPMDelete={onPMDelete}
        />;
      })}
    </div>
  );
}
