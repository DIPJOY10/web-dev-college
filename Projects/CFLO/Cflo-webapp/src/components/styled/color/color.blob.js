import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ButtonBase, Dialog} from '@material-ui/core';
import ColorSelect from './color.select';


const useStyles = makeStyles({

  blob: (props) => ({
    backgroundColor: props.color,
    marginLeft: '1rem',
    marginRight: '1rem',
    height: '1.5rem',
    width: '1.5rem',
    borderRadius: '0.75rem',
    zIndex: 200
  }),

  paper:{
     padding:'1rem'
  }
});


export const ColorBlob = (props)=>{
  const classes = useStyles(props);
  const {
     color, setColor, open, setOpen
  } = props;

  return (
       <>
          <ButtonBase className={classes.blob} onClick={()=>{
              setOpen()
          }}>
              
          </ButtonBase>

          <Dialog open={open} onClose={()=>setOpen()}>


                <ColorSelect 
                  color={color}
                  setColor={setColor}
                />


          </Dialog>
   
       </> 

  );
};