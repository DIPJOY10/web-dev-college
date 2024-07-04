import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    navBar: {
        flex: 1,
        display: "flex",
        flexDirection: 'row',
        marginTop: "0px",
        marginLeft: "20px",
        marginRight: "20px",
        borderBottom: "2px solid #E3E5E8",
        maxHeight: "40px",
        width: "max-content",
    },
    navOption: {
        marginLeft: "25px",
        fontSize: "15px",
        padding: "10px",
        paddingBottom: "35px",
        cursor: "pointer",
        position: "relative",
        fontWeight: "500",
        top: "-8px",
        [theme.breakpoints.down('sm')]: {
            fontSize: "14px",
        },
    },
    bottomStyle: {
        marginLeft: "25px",
        fontSize: "15px",
        padding: "10px",
        paddingBottom: "35px",
        cursor: "pointer",
        position: "relative",
        top: "-9px",
        fontWeight: "500",
        borderBottom: "4px solid #58C5D2",
        [theme.breakpoints.down('sm')]: {
            fontSize: "14px",
        },
    },
    myNavBarCont: {
        width: "100%",
    },
    barCont: {
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        '&::-webkit-scrollbar': {
            display: 'none'
        },
    }
}));



export default function CommonNavbar(props) {
    const {
        show, setShow, options
    } = props;
    const classes = useStyles();

    return (
        <div className={classes.myNavBarCont} >
            <div className={classes.barCont} >
                <div className={classes.navBar} >
                    {options.map((option) => (
                        <p
                            key={option.value}
                            className={show === option.value ? classes.bottomStyle : classes.navOption}
                            onClick={() => setShow(option.value)}
                        >
                            {option.label}
                        </p>
                    ))}
                </div>
            </div>
            {options.map((option) => {
                const {
                    Component, value
                } = option;
                return (<div key={value}>
                    {show === value ? Component : null}
                </div>)
            })}
        </div>
    );
}
