import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ButtonBase} from '@material-ui/core';

const colorObject = {
  primary: [
    'red', 'pink', 'purple', 'indigo',
    'blue', 'cyan', 'teal', 'green',
    'lime', 'yellow', 'orange', 'brown',
  ],
  red: [
    '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f',
  ],
  pink: [
    '#ec407a', '#e91e63', '#c2185b', '#ad1457', '#880e4f',
  ],
  purple: [
    '#d500f9', '#aa00ff', '#ab47bc', '#673ab7', '#4527a0',
  ],
  indigo: [
    '#5c6bc0', '#3f51b5', '#3949ab', '#283593', '#1a237e',
  ],
  blue: [
    '#42a5f5', '#2196f3', '#2962ff', '#536dfe', '#3d5afe',
  ],
  cyan: [
    '#84ffff', '#18ffff', '#00e5ff', '#0097a7', '#00838f',
  ],
  teal: [
    '#64ffda', '#1de9b6', '#00bfa5', '#00796b', '#00695c',
  ],
  green: [
    '#00e676', '#76ff03', '#4caf50', '#388e3c', '#2e7d32',
  ],
  lime: [
    '#c6ff00', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24',
  ],
  yellow: [
    '#ffee58', '#ffeb3b', '#ffd740', '#ffea00', '#ffc400',
  ],
  orange: [
    '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100',
  ],
  brown: [
    '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e',
  ],
};


const useStyleColorBlock = makeStyles({
  // style rule
  colorBlock: (props) => ({
    backgroundColor: props.backgroundColor,
    height: props.height?props.height:'1.6rem',
    width: props.width?props.width:'6rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    marginBottom: '0.35rem',
    marginTop: '0.35rem',
    borderRadius: props.borderRadius?props.borderRadius:'0.6rem',
  }),

  blob: (props) => ({
    backgroundColor: props.backgroundColor,
    marginLeft: '1rem',
    marginRight: '1rem',
    height: '1.5rem',
    width: '1.5rem',
    borderRadius: '0.75rem',
  }),
});

export const ColorBlock = (props)=>{
  const {color, setColor, blockColor} = props;
  const classes = useStyleColorBlock({backgroundColor: blockColor, ...props});
  return (
    <ButtonBase className={classes.colorBlock} onClick={()=>{
      setColor(blockColor);
    }}>

    </ButtonBase>
  );
};

export const ColorBlob = (props)=>{
  const classes = useStyleColorBlock(props);
  return (
    <ButtonBase className={classes.blob} onClick={()=>{
      if (props.setColor) {
        props.setColor();
      }
    }}>

    </ButtonBase>
  );
};
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '75rem',
    margin: '2rem',
  },
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '15rem',
    textAlign: 'center',
  },
}));

export const ColorSelect = (props)=> {
  const {
    color,
    setColor,
  } = props;

  const classes = useStyles();
  const colors = colorObject['primary'];
  // console.log(colors,' is colors')

  return (
    <div className={classes.root}>

      <Paper>
        <div className={classes.row}>
          {colors.map((primaryColor)=>{
            const secondaryColors = colorObject[primaryColor];
            return (
              <div className={classes.col}>

                <Typography>{primaryColor}</Typography>
                {secondaryColors.map((blockColor)=>{
                  return (
                    <ColorBlock {...props} blockColor={blockColor}/>
                  );
                })}

              </div>

            );
          })}


        </div>
      </Paper>

    </div>
  );
};
