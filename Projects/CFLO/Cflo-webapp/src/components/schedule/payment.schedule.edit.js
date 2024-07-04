import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import PMEdit from './payment.milestone.edit';
import PMCreate from './payment.milestone.create';
import PMList from './payment.milestone.list';
import PaperBtn from '../styled/actionBtns/paper.btn';
import AddIcon from '@material-ui/icons/Add';
import { Toolbar } from '@material-ui/core';
import Api from '../../helpers/Api';
import { setPaymentSAndM } from './schedule.utils';

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

export default function S(props) {
  const {
    scheduleId, isMobile
  } = props;

  const [editPMId, setEditPMId] = useState(null);
  const [mode, setMode] = useState('List');
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const scheduleReducer = useSelector((state) => state.schedule);
  const {
    paymentScheduleDictionary,
  } = scheduleReducer;

  const scheduleOld = paymentScheduleDictionary[scheduleId];
  const milestonesOld = scheduleOld?.milestones ? scheduleOld?.milestones : [];
  const [schedule, setSchedule] = useState({});
  const [milestones, setMilestones] = useState([]);
  const {
    root, row, col,
  } = classes;

  let PMView = null;

  useEffect(() => {
    Api.post('schedule/payment/get', {
      scheduleId,
    }).then((scheduleAndMilestone) => {
      const newSchedule = scheduleAndMilestone.schedule;
      const newMilestones = scheduleAndMilestone.milestones;
      setSchedule(newSchedule);
      setMilestones(newMilestones);
      setPaymentSAndM(newSchedule, newMilestones, scheduleReducer, dispatch);
    });
  }, [schedule]);


  const onPMDelete = () => {

  };


  switch (mode) {
    case 'Create':
      PMView = <PMCreate scheduleId={scheduleId} setMode={setMode} isMobile={isMobile} />;
      break;

    case 'Edit':
      PMView = <PMEdit setMode={setMode} milestoneId={editPMId} isMobile={isMobile} />;
      break;

    case 'List':
      PMView = <Toolbar variant="dense" className={classes.tabRoot}>
        <PaperBtn
          text={'Create'}
          icon={<AddIcon />}
          onClick={() => {
            setMode('Create');
          }}
        />
      </Toolbar>;

      break;

    default:
      break;
  }

  useEffect(() => {
    if (milestones.length > 0) {

    }
    else {
      setMode('Create');
    }
  }, []);

  return (
    <div className={root}>
      {PMView}
      <PMList
        milestones={milestones}
        onPMDelete={onPMDelete}
        setEditPM={setEditPMId}
        setMode={setMode}
      />
    </div>
  );
}
