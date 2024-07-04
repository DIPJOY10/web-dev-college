import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root:(props) => ({
        backgroundColor: props.color,
        height:'1.30rem',
        margin:'0 0.25rem',
        padding:'0.20rem 0.25rem',
        borderRadius: '0.15rem'
    }),

    textStyle:{
        fontSize: 12,
        fontWeight:'600',
        color:'#edf0f7'
    }
}));

export default function Label(props) {
  const { text, color } = props;

  const classes = useStyles(props);
 

  return (
    <Paper onClick={()=>{

    }} className={classes.root} variant="outlined" square >
        <Typography className={classes.textStyle}>
                {text}
        </Typography>
    </Paper>
  );
}

