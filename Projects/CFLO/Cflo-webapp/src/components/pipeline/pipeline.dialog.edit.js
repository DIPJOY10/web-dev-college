import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router-dom';
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
import {blue} from '@material-ui/core/colors';
import EditBtn from '../styled/actionBtns/edit.btn';
import CloseBtn from '../styled/actionBtns/close.btn';
import _ from 'lodash';
import DraggableStatusList from './DraggableStatusList';
import Api from '../../helpers/Api';
import {setPipelines} from './pipeline.utils';
import {ColorBlock, ColorBlob, ColorSelect} from './color.cards';
import Paper from '@material-ui/core/Paper';
import CreateBtn from '../styled/actionBtns/create.btn';
import TitleInput from '../styled/title.input';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import PanToolIcon from '@material-ui/icons/PanTool';
import {StatusItem} from './status.item';
import TocIcon from '@material-ui/icons/Toc';

const useStyles = makeStyles({
  listStyle: {
    padding: '1rem',
    paddingBottom: '2rem',
    paddingTop: 0,
    minWidth: '17rem',
    width: '90vw',
    maxWidth: '32rem',
  },
  centerDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  margin: {
    margin: '1rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '1rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    minWidth: '17rem',
  },
  createBtn: {
    paddingLeft: '1rem',
    padding: '0.5rem',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    maxWidth: '6rem',
  },
  createBtnPaper: {
    maxWidth: '6rem',
    margin: '1rem',
  },
  bgColor: {
    backgroundColor: '#64b5f6',
    color: 'white',
  },
});

export default function SimpleDialog(props) {
  const classes = useStyles();
  const {setOpen, open, pipelineId} = props;

  const DateNow = new Date();
  const [lastUpdated, setLastUpdated] = useState(DateNow);
  const pipelineReducer = useSelector((state) => state.pipeline);
  const {
    pipelineDictionary,
  } = pipelineReducer;

  const history = useHistory();
  const pipeline = pipelineDictionary[pipelineId];
  console.log(pipeline, ' in the pipeline dialog ', pipelineId);
  const [mode, setMode] = useState('List');

  const [editState, setEditState] = useState(null);

  const oldName = pipeline?.name?pipeline.name:'';
  const [name, setName] = useState(oldName);

  const oldStates = pipeline?.states?pipeline.states:[];
  const [states, setStates] = useState(oldStates);

  const oldStateColor = pipeline?.stateColor?pipeline.stateColor:{};
  const [stateColor, setStateColor] = useState(oldStateColor);

  const [text, setText] = useState('');


  const [color, setColor] = useState('#42a5f5');
  const [selectColor, setSelectColor] = useState(false);

  const dispatch = useDispatch();

  // console.log(mode=='Drag')

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

  const deleteState = (text)=>{
    const newStates = _.difference(states, [text]);
    const newObject = {
      ...stateColor,
    };
    delete newObject[text];

    setStateColor(newObject);
    setStates(newStates);
  };

  const selectEdit = (text)=>{
    setMode('Edit');
    setEditState(text);
    setText(text);
    const color = stateColor[text];
    setColor(color);
  };

  const update = ()=>{
    setMode('List');
    setText('');
    setColor('#42a5f5');
    const oldText = editState;

    // delele part
    const index = states.indexOf(oldText);
    const newArr = [...states.slice(0, index), text, ...states.slice(index+1)];

    const newObject = {
      ...stateColor,
    };
    delete newObject[oldText];
    newObject[text] = color;
    // add part
    // console.log(newObject,newArr)

    setStateColor(newObject);
    setStates(newArr);
  };

  let namePlaceholder;

  switch (pipeline?.type) {
    case 'Job':
      namePlaceholder = 'Contractor Job Pipeline';
      break;

    case 'Task':
      namePlaceholder = 'Team B tasks';
      break;

    case 'Issue':
      namePlaceholder = 'Team C Issues';
      break;

    default:
      namePlaceholder = 'Contractor Job Pipeline';
      break;
  }

  const close = ()=>{
    history.goBack();
  };

  const updatePipelineApi = (callback)=>{
    if (pipeline) {
      Api.post('pipeline/update', {
        ...pipeline,
        states,
        name,
        stateColor,
      }).then((pipeline)=>{
        setPipelines([pipeline], pipelineReducer, dispatch);
        if (callback) {
          callback();
        }
      });
    }
  };

  useEffect(() => {
    const timeNow = new Date;
    if (timeNow-lastUpdated>500) {
      setLastUpdated(timeNow);
      updatePipelineApi();
    }
  }, [states, name, stateColor]);

  const handleClose = () => {
    // do not close
    setOpen(true);
  };

  return (

    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>


      <div className={clsx(classes.row, classes.center, classes.margin)}>
        <div className={clsx(classes.row, classes.center)}>
          <Typography className={classes.margin}>
                        🚦
          </Typography>
          <Typography variant='button' >
            <b>Pipeline</b>
          </Typography>
        </div>
        {mode=='Edit'?null: <CreateBtn onClick={()=>{
          updatePipelineApi();
          setOpen(false);
        }}>
                    Save
        </CreateBtn>}
        <CloseBtn
          onClick={()=>setOpen(false)}
        />
      </div>

      <TitleInput
        title={name}
        placeholder={namePlaceholder}
        setTitle={setName} />


      <div className={classes.centerDiv}>


        {selectColor?


               <ColorSelect
                 color={color}
                 setColor={(color)=>{
                   setColor(color);
                   setSelectColor(false);
                 }}
               /> :
                    <div className={clsx(classes.centerDiv, classes.margin)}>
                      <div className={classes.centerDiv}>
                        <div className={clsx(classes.row, classes.center)}>
                          <Typography variant='button'>
                            <b>Status Name</b>
                          </Typography>
                          {text.length>2&&mode!=='Edit'? <Paper className={classes.createBtnPaper}>
                            <ButtonBase className={classes.createBtn} onClick={addState}>
                              <Typography variant='button'>
                                <b>Add</b>
                              </Typography>


                            </ButtonBase>
                          </Paper>:null}
                          {mode=='Edit'?<Paper className={classes.createBtnPaper}>
                            <ButtonBase className={classes.createBtn} onClick={()=>update()}>
                              <Typography variant='button'>
                                <b>Done</b>
                              </Typography>


                            </ButtonBase>
                          </Paper>:null}
                        </div>

                        <InputBase
                          rowsMax={1}
                          value={text}
                          placeholder={'Meeting (atleast 4 characters)'}
                          onChange={(event)=>setText(event.target.value)}
                          className={classes.input}
                        />
                      </div>


                      <div className={classes.row}>

                        <Typography variant='button'><b>Choose Color</b></Typography>
                        <ColorBlob setColor={()=>{
                          setSelectColor(true);
                        }} backgroundColor={color}/>
                      </div>


                    </div>

        }

        {setMode=='Edit'?null:<>
          <div className={clsx(classes.row, classes.center, classes.margin)}>
            <Paper className={clsx(classes.createBtnPaper, classes.margin, (mode=='Drag')&&classes.bgColor)}>
              <ButtonBase className={classes.createBtn} onClick={()=>{
                setMode('Drag');
              }}>


                <PanToolIcon style={{marginRight: '0.6rem'}}/>
                <Typography variant='button'>
                  <b>Drag</b>
                </Typography>
              </ButtonBase>
            </Paper>
            <Paper className={clsx(classes.createBtnPaper, classes.margin, _.isEqual(mode, 'List')&&classes.bgColor)}>
              <ButtonBase className={classes.createBtn} onClick={()=>{
                setMode('List');
              }}>


                <TocIcon style={{marginRight: '0.6rem'}}/>
                <Typography variant='button' >
                  <b>List</b>
                </Typography>

              </ButtonBase>
            </Paper>
          </div>

        </>}


        {mode=='Drag'?<DraggableStatusList
          states={states}
          stateColor={stateColor}
          setStates={setStates}
        />:null}

        {mode=='List'?<>
          {states.map((status)=>{
            const color = stateColor[status];
            return <StatusItem
              text={status}
              color={color}
              onEdit={()=>selectEdit(status)}
              onDelete={()=>deleteState(status)}
            />;
          })}

        </>:null}


      </div>

    </Dialog>

  );
}
