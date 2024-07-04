import React, {useState} from 'react';
import minimalSelectClasses from './minimalSelect.styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {makeStyles} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';
// Original design here: https://github.com/siriwatknp/mui-treasury/issues/540

const useStyles = makeStyles({
  select: {
    'minWidth': '10rem',
    'background': 'white',
    'color': blue[500],
    'fontWeight': 200,
    'borderStyle': 'none',
    'borderWidth': 2,
    'borderRadius': 12,
    'paddingLeft': 24,
    'paddingTop': 14,
    'paddingBottom': 15,
    'boxShadow': '0px 5px 8px -3px rgba(0,0,0,0.14)',
    '&:focus': {
      borderRadius: 12,
      background: 'white',
      borderColor: blue[100],
    },
  },
  icon: {
    color: blue[300],
    right: 12,
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  paper: {
    borderRadius: 12,
    marginTop: 8,
  },
  list: {
    'paddingTop': 0,
    'paddingBottom': 0,
    'background': 'white',
    '& li': {
      fontWeight: 200,
      paddingTop: 12,
      paddingBottom: 12,
    },
    '& li:hover': {
      background: blue[100],
    },
    '& li.Mui-selected': {
      color: 'white',
      background: blue[400],
    },
    '& li.Mui-selected:hover': {
      background: blue[500],
    },
  },
});

const MinimalSelect = withStyles(minimalSelectClasses, {name: 'MinimalSelect'})((props) => {
  const classes = useStyles();
  const {values, index, setIndex} = props;
  const {select, paper, list, icon} = classes;
  const [val, setVal] = useState(values[0]);
  const handleChange = (event) => {
    setVal(event.target.value);
  };

  const iconComponent = (props) => {
    return (
      <ExpandMoreIcon className={props.className + ' ' + icon}/>
    );
  };

  // moves the menu below the select input
  const menuProps = {
    classes: {
      paper: paper,
      list: list,
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
  };


  return (
    <FormControl>
      <Select
        disableUnderline
        classes={{root: select}}
        MenuProps={menuProps}
        IconComponent={iconComponent}
        value={values[index]}
        onChange={handleChange}
      >
        {values.map((value, index)=>{
          return <MenuItem value={value} onClick={()=>setIndex(index)}>{value}</MenuItem>;
        })}

      </Select>
    </FormControl>
  );
});


export default MinimalSelect;
