import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { useInvestment } from './investment.hook';
import createLogo from '../../Assets/create1.png'
import { Button, Typography, useMediaQuery } from '@material-ui/core';
import InvestmentTable from './investment.table';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        // border: '2px solid red'
    },
    investmentBtn: {
        borderRadius: "5vw",
        width: "16vw",
        height: "5vh",
        border: "2px solid",
        marginBottom: '3vh',
        [theme.breakpoints.down('xs')]: {
            width: '52vw',
            height: '4vh',
        },
    },
}))
export default function InvestmentList() {

    const classes = useStyles();
    const {
        investmentDictionary,
    } = useSelector((state) => state.dashboard);
    const theme = useTheme();
    console.log(investmentDictionary, "Investment Dictionary");
    const { investmentCreate, loading } = useInvestment();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    return (
        <>
            <div className={classes.root}>
                <Button variant="outlined" className={classes.investmentBtn} color="primary" disabled={loading} onClick={() => {
                    investmentCreate();
                }}>
                    <img src={createLogo} alt="" />
                    <Typography variant="body2" style={isMobile ? { fontSize: '3vw' } : null}>
                        Create an investment
                    </Typography>
                </Button>

            </div>
            {/* <Typography variant="h6">InvestmentList</Typography> */}
            <InvestmentTable />
        </>
    )
}
