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
import RemoveIcon from '@material-ui/icons/Remove';
import _ from 'lodash';
import DraggableStatusList from './DraggableStatusList';
import PipelineCard from './pipeline.card';
import PipelineList from './pipeline.list';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '6rem',
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
  inputPaper: {
    padding: '1rem',
    maxWidth: '20rem',
    margin: '1rem',
  },
  input: {
    marginLeft: '1rem',
  },
}));


export default function Pipelines() {
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  const {user} = auth;
  const pipelineReducer = useSelector((state) => state.pipeline);
  const {
    pipelineDictionary,
    pipelineIds,
  } = pipelineReducer;


  const [text, setText] = useState('');
  const [states, setStates] = useState([]);
  const [stateColor, setStateColor] = useState({});
  const [color, setColor] = useState('#42a5f5');
  const [selectColor, setSelectColor] = useState(false);

  const dispatch = useDispatch();
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:1300px)');
  // console.log(states, stateColor)
  const addState = ()=>{
    setStates([...states, text]);
    const newObject = {
      ...stateColor,
    };
    newObject[text] = color;
    setText('');
    setColor('#42a5f5');
    // console.log(newObject,' is the new object added')
    setStateColor(newObject);
  };

  const removeState = (text)=>{
    setStates( _.pull(states, text));
    const newObject = {
      ...stateColor,
    };
    delete newObject.text;
    setStateColor(newObject);
  };

  const create = ()=>{
    const type = 'Job';
    Api.post('pipeline/create', {
      type,
      user: user._id,
    }).then((pipeline)=>{
      setPipelines([pipeline], pipelineReducer, dispatch);
    });
  };

  const createDefaultJob = ()=>{
    const type = 'Job';
    Api.post('pipeline/create', {
      type,
      user: user._id,
      platform: true,
    }).then((pipeline)=>{
      setPipelines([pipeline], pipelineReducer, dispatch);
    });
  };

  const createDefaultTask = ()=>{
    const type = 'Task';
    Api.post('pipeline/create', {
      type,
      user: user._id,
      platform: true,
    }).then((pipeline)=>{
      setPipelines([pipeline], pipelineReducer, dispatch);
    });
  };

  const createDefaultIssue = ()=>{
    const type = 'Issue';
    Api.post('pipeline/create', {
      type,
      user: user._id,
      platform: true,
    }).then((pipeline)=>{
      setPipelines([pipeline], pipelineReducer, dispatch);
    });
  };


  const onSelect = (pipelineId)=>{
    history.push('/pipeline/'+pipelineId);
  };

  return (
    <div className={classes.root}>

      {/* <div>
                <CreateBtn onClick={createDefaultJob}>
                    Default Job Pipeline
                </CreateBtn>
                <CreateBtn onClick={createDefaultTask}>
                    Default Task Pipeline
                </CreateBtn>
                <CreateBtn onClick={createDefaultIssue}>
                    Default Issue Pipeline
                </CreateBtn>
            </div> */}

      <PipelineList type={'Job'} />
      <PipelineList type={'Task'} />
      <PipelineList type={'Issue'} />
    </div>
  );
}
