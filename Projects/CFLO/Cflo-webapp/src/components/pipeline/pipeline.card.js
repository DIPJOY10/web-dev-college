import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {useSelector, useDispatch} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import {setPipelines, deletePipeline} from './pipeline.utils';
import {StatusItem} from './status.item';
import Chip from '@material-ui/core/Chip';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import EditBtn from '../styled/actionBtns/edit.btn';
import DeleteBtn from '../styled/actionBtns/delete.btn';
import EditDialog from './pipeline.dialog.edit';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
    maxWidth: '18rem',
    minWidth: '18rem',
    paddingTop: '1rem',

  },
  title: {
    marginLeft: '1rem',
  },
  row: {

    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
  },
  divider: {
    margin: '0.5rem',
  },
  chipStyle: {
    height: '1.3rem',
    margin: '0.8rem',
    fontSize: '0.9rem',
  },
  bColor: {
    backgroundColor: 'yellow',
  },
  iconBlock: {
    display: 'flex',
    flexDirection: 'row',
    height: '1.5rem',
    marginBottom: '0.8rem',
  },

}));

export default function PipelineCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const pipelineReducer = useSelector((state) => state.pipeline);
  const {
    pipelineDictionary,
  } = pipelineReducer;
  const {pipelineId, onSelect} = props;
  const pipeline = pipelineDictionary[pipelineId];
  const name = pipeline?.name?pipeline.name:'';
  const states = pipeline?.states?pipeline.states:[];
  const stateColor = pipeline?.stateColor?pipeline.stateColor:{};

  return (

    <Paper className={classes.root} onClick={()=>{
      if (onSelect) {
        onSelect(pipelineId);
      }
    }} variant="outlined">

      <div className={classes.row}>

        <Typography variant="button" className={classes.title}>
          <b>{name}</b>
        </Typography>
        {pipeline.platform?<Chip label={'Platform'} className={classes.chipStyle}/>:<div className={classes.iconBlock}>
          <EditBtn onClick={()=>{
            setOpen(true);
          }}/>
          <DeleteBtn
            onClick={()=>{
              deletePipeline(pipelineId, pipelineReducer, dispatch);
            }}
          />
        </div>}
      </div>
      <Divider className={classes.divider}/>
      {states.map((state)=>{
        const color = stateColor[state];
        return <StatusItem text={state} color={color}/>;
      })}
      <EditDialog
        open={open}
        setOpen={setOpen}
        pipelineId={pipelineId}
      />
    </Paper>

  );
}
