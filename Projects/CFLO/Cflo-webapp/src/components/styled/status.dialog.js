import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import {blue} from '@material-ui/core/colors';
import Api from '../../helpers/Api';
import {setPipelines} from '../pipeline/pipeline.utils';
import {StatusItem} from '../pipeline/status.item';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  listStyle: {
    padding: '2rem',
    flex: 1,
    paddingBottom: '2rem',
    paddingTop: 0,
  },
  textStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: '12rem',
  },
  statusItemStyle: {
    marginTop: '0.3rem',
    paddingRight: '2rem',
  },
});

export default function SimpleDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState([
    'Planned', 'In Progress', 'Completed',
  ]);

  const [stateColor, setStateColor] = useState({
    'Planned': '#42a5f5',
    'In Progress': '#00e5ff',
    'Completed': '#00e676',
  });

  const {pipelineId, status, setStatus} = props;
  const pipelineReducer = useSelector((state) => state.pipeline);
  const {
    pipelineDictionary,
  } = pipelineReducer;

  const pipeline = pipelineDictionary[pipelineId];

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (pipelineId) {
      if (pipeline&&pipeline._id) {
        setStates(pipeline.states);
        setStateColor(pipeline.stateColor);
      }
      else {
        Api.post('pipeline/get', {
          pipelines: [pipelineId],
        }).then((res)=>{
          const pipelines = res.results;
          setPipelines(pipelines, pipelineReducer, dispatch);
          const pipeline = pipelines[0];
          setStates(pipeline.states);
          setStateColor(pipeline.stateColor);
          // no need to update, already updated above
        });
      }
    }
  }, []);

  return (
    <>

      <div className={classes.textStyle}>
        <StatusItem text={status} color={stateColor[status]} onClick={()=>{
          setOpen(true);
        }}/>
      </div>

      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">{status}</DialogTitle>
        <List className={classes.listStyle}>
          {states.map((state, index)=>{
            const color = stateColor[state];

            return <Paper variant="outlined" square className={classes.statusItemStyle}>
              <StatusItem key={state+index} text={state} color={color} onClick={()=>{
                setStatus(state);
              }}/>

            </Paper>;
          })}

        </List>
      </Dialog>
    </>

  );
}
