import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import PMCard from './payment.milestone.card.view';
import Api from '../../helpers/Api';


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
    scheduleId,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [schedule, setSchedule] = useState({});
  const [milestones, setMilestones] = useState([]);

  const {
    root, row, col,
  } = classes;

  useEffect(() => {
    Api.post('schedule/payment/get', {
      scheduleId,
    }).then((scheduleAndMilestone)=>{
      const newSchedule = scheduleAndMilestone.schedule;
      const newMilestones = scheduleAndMilestone.milestones;
      setSchedule(newSchedule);
      setMilestones(newMilestones);
    });
  }, []);

  return (
    <div className={root}>


      {milestones.map((milestone)=>{
        return <PMCard
          key={milestone._id}
          milestone={milestone}
        />;
      })}
    </div>
  );
}
