import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {ButtonBase} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';
import Api from '../../helpers/Api';
import {setPipelines} from './pipeline.utils';
import {ColorBlock, ColorBlob, ColorSelect} from './color.cards';
import Paper from '@material-ui/core/Paper';
import CreateBtn from '../styled/actionBtns/create.btn';
import CloseBtn from '../styled/actionBtns/close.btn';
import RemoveIcon from '@material-ui/icons/Remove';
import _ from 'lodash';
import DraggableStatusList from './DraggableStatusList';
import PipelineCard from './pipeline.card';
import EditDialog from './pipeline.dialog.edit';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    marginTop: '1rem',
    flexWrap: 'wrap',
  },
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin: {
    margin: '1rem',
  },
  padding: {
    padding: '1rem',
  },
  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    maxWidth: '9rem',
  },
  createBtnPaper: {
    maxWidth: '9rem',
    maxHeight: '2rem',
    marginRight: '0.6rem',
  },

}));


export default function PipelineList(props) {
  const {
    type, onSelect, onClose,
  } = props;

  const [pipeId, setPipeId] = useState(null);
  const [open, setOpen] = useState(false);

  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const {user} = auth;
  const pipelineReducer = useSelector((state) => state.pipeline);
  const {
    pipelineDictionary,
    pipelineIds,
  } = pipelineReducer;
  const typePipelineIds = pipelineIds.filter((pipelineId)=>{
    const pipeline = pipelineDictionary[pipelineId];
    return pipeline.type == type;
  });


  const dispatch = useDispatch();
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:1300px)');

  const create = ()=>{
    Api.post('pipeline/create', {
      type,
      user: user._id,
    }).then((pipeline)=>{
      setPipelines([pipeline], pipelineReducer, dispatch);
      setOpen(true);
      setPipeId(pipeline._id);
    });
  };

  return (
    <Paper className={clsx(classes.row, classes.center, classes.margin, classes.padding)}>
      <div className={classes.root}>
        <div className={classes.row}>
          <div className={classes.row}>
            <Typography variant='h6'>
              <b>{type} Pipelines</b>
            </Typography>
          </div>

          <Paper className={classes.createBtnPaper}>
            <ButtonBase className={classes.createBtn} onClick={create}>
              <Typography variant='button'>
                <b>Add Pipeline</b>
              </Typography>


            </ButtonBase>
          </Paper>
          {onClose?<CloseBtn onClick={()=>{
            onClose();
          }} />:null}
        </div>

        <div className={classes.row}>
          {typePipelineIds.map((pipelineId)=>{
            return <PipelineCard pipelineId={pipelineId} onSelect={()=>{
              if (onSelect) {
                onSelect(pipelineId);
              }
              else {
                setPipeId(pipelineId);
              }
            }} />;
          })}
        </div>

      </div>


      <EditDialog
        open={open}
        setOpen={setOpen}
        pipelineId={pipeId}
      />
    </Paper>

  );
}
