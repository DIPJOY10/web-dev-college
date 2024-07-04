import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';



const useStyles = makeStyles({
    root: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        fontSize : "16px", 
        fontWeight: "550" 
    },
});

export default function BarInReport(props) {
    const { label, total } = props;
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { root } = classes;


    return (
        <div className={root}>
            <div style={{ marginLeft: "23px"}} >{label}</div>
            <div>${total}</div>
        </div>
    );
}
