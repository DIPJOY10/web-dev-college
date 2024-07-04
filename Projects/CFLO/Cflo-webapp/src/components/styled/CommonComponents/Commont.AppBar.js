import React, { useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Divider, Toolbar, IconButton, Typography, useScrollTrigger, useMediaQuery } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
const foldedWidth = '6rem';
const useStyles = makeStyles((theme) => ({
    positionFixed: {
        top: "0",
        right: "0",
        left: "20vw",
        position: "fixed",
        borderColor: 'grey',
        width : "80vw",
        [theme.breakpoints.down('md')]: {
            left: "0",
            width: "100vw",
        },
        [theme.breakpoints.down('sm')]: {
            left: "0",
            width: "100vw",
        },
    },
    toolbar: {
        backgroundColor: 'white',
        borderColor: 'grey',
        flex: 1,
        marginTop: '0px',
        color: '#48494a',
        width: '100%',
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
        padding: '0px 10px',
        [theme.breakpoints.down('sm')]: {
            marginLeft: "0px",
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: "0px",
        },
    },
    leftCont: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rightCont: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}));

export default function CommonAppBar(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        leftItems, rightItems
    } = props;
    const {
        appbarMainCont, appBarStyle, toolbar, leftCont, rightCont, positionFixed
    } = classes;

    console.log(rightItems)

    return (
        <AppBar className={positionFixed} >
            <Toolbar className={toolbar} >
                <div className={leftCont} >
                    {
                        leftItems?.length > 0 && leftItems.map((item, index) => (
                           <span key={index} >{item}</span> 
                        ))
                    }
                </div>
                <div className={rightCont} >
                    {
                        rightItems?.length > 0 && rightItems.map((item, index) => (
                            <span key={index} >{item}</span> 
                        ))
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}
