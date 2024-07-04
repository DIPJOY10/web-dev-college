import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    'width': '17rem',
  },
  input: {
    'borderRadius': 4,
    'position': 'relative',
    'backgroundColor': theme.palette.background.paper,
    'border': '1px solid #ced4da',
    'fontSize': 16,
    'padding': '10px 26px 10px 12px',
    'transition': theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    'fontFamily': [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function PipelineSelect(props) {
  const classes = useStyles();
  const {
    onSelect, pipelineId, type,
  } = props;

  const pipelineReducer = useSelector((state) => state.pipeline);
  const {
    pipelineDictionary,
    pipelineIds,
  } = pipelineReducer;
  const typePipelineIds = pipelineIds.filter((pipelineId)=>{
    const pipeline = pipelineDictionary[pipelineId];
    return pipeline.type == type;
  });
  let pipeline = null;

  if (pipelineId) {
    pipeline = pipelineDictionary[pipelineId];
  }
  else if (typePipelineIds.length>0) {
    const pipeId = typePipelineIds[0];
    pipeline = pipelineDictionary[pipeId];
  }


  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <div>

      <FormControl className={classes.margin}>

        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={pipelineId}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          {typePipelineIds.map((pipeId)=>{
            const pipeline = pipelineDictionary[pipeId];
            return (
              <MenuItem value={pipeId}>{pipeline.name}</MenuItem>
            );
          })}

        </Select>
      </FormControl>

    </div>
  );
}