import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { Paper, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    disCont: {
        margin: "20px",
        padding: "40px 30px",
        [theme.breakpoints.down('sm')]: {
            margin: "20px 5px",
            padding: "40px 5px",
        },
        [theme.breakpoints.down('xs')]: {
            margin: "20px 5px",
            padding: "10px",
            marginTop: "-20px"
        }
    },
    title: {
        fontSize: "17px",
        fontWeight: "510",
        margin: "10px 0px",
        marginLeft: "15px"
    },
    ulStyle: {
        margin: "20px 0px",
        marginLeft: "45px"
    },
    styleMargin: {
        marginLeft: "30px"
    },
    mainTitle: {
        marginTop: "40px",
        color: theme.palette.primary.main,
        fontSize: "20px",
        fontWeight: "510",
    },
    subtitle: {
        marginTop: "15px",
        marginLeft: "30px",
        fontSize: "16px",
        fontWeight: "510",
    }
}));

export default function Disclaimer(props) {
    const history = useHistory();
    const classes = useStyles();
    const { reportType } = useParams();

    let DisclaimerComponent = null

    switch (reportType) {
        case "Rental":
            DisclaimerComponent = <Paper elevation={3} className={classes.disCont} >
                <p>
                    To help you analyze investment properties faster, we have entered certain assumptions like property tax rate, insurance cost as well as other values based on the location and trends of the property and financial parameters. However, these (editable) values may vary according to the specific property or individual’s financial credentials.
                </p>
                <p style={{ marginTop: "10px" }} >
                    The details of these default values are given below:
                </p>
                <p className={classes.mainTitle} >
                    Tax & Insurance
                </p>
                <p className={classes.title} >
                    Property tax:
                </p>
                <p className={classes.styleMargin} >
                    It is the average effective tax rate of that state based on WalletHub’s 2021 findings. This estimate is based on the home value, property type, and an estimated local tax rate. Actual rate or taxes assessed may vary.
                </p>
                <p className={classes.title} >
                    Property insurance:
                </p>
                <p className={classes.styleMargin} >
                    Based on data from Quadrant Information Services to analyze 2022 rates for all ZIP codes and carriers in all 50 states and Washington, D.C. Rates are weighted based on the population density in each geographic region, except in cities. Quoted rates are based on 40-year-old male and female homeowners with a clean claim history, good credit and the following coverage limits:
                </p>
                <ul className={classes.ulStyle} >
                    <li>Coverage A, Dwelling: $250,000</li>
                    <li>Coverage B, Other Structures: $25,000</li>
                    <li>Coverage C, Personal Property: $125,000</li>
                    <li>Coverage D, Loss of Use: $50,000</li>
                    <li>Coverage E, Liability: $300,000</li>
                    <li>Coverage F, Medical Payments: $1,000</li>
                </ul>
                <p className={classes.styleMargin} >
                    The homeowners also have a $1,000 deductible and a separate wind and hail deductible (if required).
                </p>
                <p className={classes.styleMargin} >
                    These are sample rates and should be used as an approximate value. Your actual quotes may differ.
                </p>
                <p className={classes.mainTitle} >
                    Financing related default values:
                </p>
                <p className={classes.title} >
                    Down payment: 20%
                </p>
                <p className={classes.styleMargin} >
                    It is set as default since most lenders require 20% down payment to forego mortgage insurance which is an extra cost burden to the investor.
                </p>
                <p className={classes.title} >
                    Interest rate:
                </p>
                <p className={classes.styleMargin} >
                    It is based on the current average rate for the benchmark 30-year fixed mortgage. (updated monthly)
                </p>
                <p className={classes.title} >
                    Loan term: 30 yrs
                </p>
                <p className={classes.styleMargin} >
                    In the United States, the traditional home loan is the 30-year fixed rate mortgage. This is the most popular loan for those buying homes for the first time and even those who own more than one home. The 30-year fixed home loan fits more financial situations than any other home loan. This loan program also allows the homebuyer to have low monthly payments while having payment certainty throughout the duration of the loan.
                </p>
                <p className={classes.subtitle} >
                    Highlights of the 30 year fixed rate mortgage are:
                </p>
                <ul className={classes.ulStyle} style={{ marginTop: "5px" }} >
                    <li>If the homebuyer chooses to increase their monthly payments, they can build equity in their home faster.</li>
                    <li>There are usually no prepayment penalties with a 30-year fixed rate mortgage.</li>
                    <li>If rates rise the homeowner is protected, but if rates fall the homeowner can refinance into a lower rate loan.</li>
                </ul>
                <p className={classes.mainTitle} >
                    Others:
                </p>
                <p className={classes.title} >
                    Rehab Period: 0 months
                </p>
                <p className={classes.styleMargin} >
                    This is to make the cash flow and other analysis from the time when rehab work is completed.
                </p>
                <p className={classes.title} >
                    Vacancy: 8%
                </p>
                <p className={classes.styleMargin} >
                    This roughly amounts to one month of vacancy every year.
                </p>
                <p className={classes.title} >
                    Other Income: 0
                </p>
                <p className={classes.styleMargin} >
                    Other income from sources like extra parking space, a mobile tower, etc is generally absent.
                </p>
                <p className={classes.title} >
                    Appreciation: 3%
                </p>
                <p className={classes.title} >
                    Income increase: 3%
                </p>
                <p className={classes.title} >
                    Expense increase: 3%
                </p>
                <p className={classes.title} >
                    Selling cost: 5%
                </p>
                <p>
                    <span style={{ fontWeight: "510", fontSize: "16px" }} >Note:</span> These default parameters are meant to make your analysis easier and faster. They should be used as an approximate value. Your actual quotes may differ. You can always edit them to suit your specific requirements.
                </p>
            </Paper>
            break;

        case "BRRRR":
            DisclaimerComponent = <Paper elevation={3} className={classes.disCont} >
                <p>
                    To help you analyze investment properties faster, we have entered certain assumptions like property tax rate, insurance cost as well as other values based on the location and trends of the property and financial parameters. However, these (editable) values may vary according to the specific property or individual’s financial credentials.
                </p>
                <p style={{ marginTop: "10px" }} >
                    The details of these default values are given below:
                </p>
                <p className={classes.mainTitle} >
                    Tax & Insurance
                </p>
                <p className={classes.title} >
                    Property tax:
                </p>
                <p className={classes.styleMargin} >
                    It is the average effective tax rate of that state based on WalletHub’s 2021 findings. This estimate is based on the home value, property type, and an estimated local tax rate. Actual rate or taxes assessed may vary.
                </p>
                <p className={classes.title} >
                    Property insurance:
                </p>
                <p className={classes.styleMargin} >
                    Based on data from Quadrant Information Services to analyze 2022 rates for all ZIP codes and carriers in all 50 states and Washington, D.C. Rates are weighted based on the population density in each geographic region, except in cities. Quoted rates are based on 40-year-old male and female homeowners with a clean claim history, good credit and the following coverage limits:
                </p>
                <ul className={classes.ulStyle} >
                    <li>Coverage A, Dwelling: $250,000</li>
                    <li>Coverage B, Other Structures: $25,000</li>
                    <li>Coverage C, Personal Property: $125,000</li>
                    <li>Coverage D, Loss of Use: $50,000</li>
                    <li>Coverage E, Liability: $300,000</li>
                    <li>Coverage F, Medical Payments: $1,000</li>
                </ul>
                <p className={classes.styleMargin} >
                    The homeowners also have a $1,000 deductible and a separate wind and hail deductible (if required).
                </p>
                <p className={classes.styleMargin} >
                    These are sample rates and should be used as an approximate value. Your actual quotes may differ.
                </p>
                <p className={classes.mainTitle} >
                    Financing:
                </p>
                <p className={classes.title} >
                    Down payment: 20%
                </p>
                <p className={classes.styleMargin} >
                    It is set as default since most lenders require 20% down payment to forego mortgage insurance which is an extra cost burden to the investor.
                </p>
                <p className={classes.title} >
                    Interest rate:
                </p>
                <p className={classes.styleMargin} >
                    It is based on the current average rate for the benchmark 30-year fixed mortgage. (updated monthly)
                </p>
                <p className={classes.title} >
                    Loan term: 30 yrs
                </p>
                <p className={classes.styleMargin} >
                    In the United States, the traditional home loan is the 30-year fixed rate mortgage. This is the most popular loan for those buying homes for the first time and even those who own more than one home. The 30-year fixed home loan fits more financial situations than any other home loan. This loan program also allows the homebuyer to have low monthly payments while having payment certainty throughout the duration of the loan.
                </p>
                <p className={classes.subtitle} >
                    Highlights of the 30 year fixed rate mortgage are:
                </p>
                <ul className={classes.ulStyle} style={{ marginTop: "5px" }} >
                    <li>If the homebuyer chooses to increase their monthly payments, they can build equity in their home faster.</li>
                    <li>There are usually no prepayment penalties with a 30-year fixed rate mortgage.</li>
                    <li>If rates rise the homeowner is protected, but if rates fall the homeowner can refinance into a lower rate loan.</li>
                </ul>
                <p className={classes.mainTitle} >
                    Refinanc:
                </p>
                <p className={classes.title} >
                    Refinance: Immediately after rehab
                </p>
                <p className={classes.styleMargin} >
                    This will help you get the refinance cash out quickly so that you may venture into another investment. (The repeat part of BRRRR, ie Buy Repair Rent Refinance Repeat)
                </p>
                <p className={classes.title} >
                    Retained equity: 20%
                </p>
                <p className={classes.styleMargin} >
                    This is equivalent to 80% down payment on a home loan.
                </p>
                <p className={classes.title} >
                    Interest Rate:
                </p>
                <p className={classes.styleMargin} >
                    It is based on the current average rate for the benchmark 30-year fixed mortgage. (updated monthly)
                </p>
                <p className={classes.title} >
                    Refinance loan term: 30yrs
                </p>
                <p className={classes.mainTitle} >
                    Others:
                </p>
                <p className={classes.title} >
                    Vacancy: 8%
                </p>
                <p className={classes.styleMargin} >
                    This roughly amounts to one month of vacancy every year.
                </p>
                <p className={classes.title} >
                    Other Income: 0
                </p>
                <p className={classes.styleMargin} >
                    Other income from sources like extra parking space, a mobile tower, etc is generally absent.
                </p>
                <p className={classes.title} >
                    Appreciation: 3%
                </p>
                <p className={classes.title} >
                    Income increase: 3%
                </p>
                <p className={classes.title} >
                    Expense increase: 3%
                </p>
                <p className={classes.title} >
                    Selling cost: 5%
                </p>
                <p>
                    <span style={{ fontWeight: "510", fontSize: "16px" }} >Note:</span> These default parameters are meant to make your analysis easier and faster. They should be used as an approximate value. Your actual quotes may differ. You can always edit them to suit your specific requirements.
                </p>
            </Paper>
            break;

        case "Flip":
            DisclaimerComponent = <Paper elevation={3} className={classes.disCont} >
                <p>
                    To help you analyze investment properties faster, we have entered certain assumptions like property tax rate, insurance cost as well as other values based on the location and trends of the property and financial parameters. However, these (editable) values may vary according to the specific property or individual’s financial credentials.
                </p>
                <p style={{ marginTop: "10px" }} >
                    The details of these default values are given below:
                </p>
                <p className={classes.mainTitle} >
                    Tax & Insurance
                </p>
                <p className={classes.title} >
                    Property tax:
                </p>
                <p className={classes.styleMargin} >
                    It is the average effective tax rate of that state based on WalletHub’s 2021 findings. This estimate is based on the home value, property type, and an estimated local tax rate. Actual rate or taxes assessed may vary.
                </p>
                <p className={classes.title} >
                    Property insurance:
                </p>
                <p className={classes.styleMargin} >
                    Based on data from Quadrant Information Services to analyze 2022 rates for all ZIP codes and carriers in all 50 states and Washington, D.C. Rates are weighted based on the population density in each geographic region, except in cities. Quoted rates are based on 40-year-old male and female homeowners with a clean claim history, good credit and the following coverage limits:
                </p>
                <ul className={classes.ulStyle} >
                    <li>Coverage A, Dwelling: $250,000</li>
                    <li>Coverage B, Other Structures: $25,000</li>
                    <li>Coverage C, Personal Property: $125,000</li>
                    <li>Coverage D, Loss of Use: $50,000</li>
                    <li>Coverage E, Liability: $300,000</li>
                    <li>Coverage F, Medical Payments: $1,000</li>
                </ul>
                <p className={classes.styleMargin} >
                    The homeowners also have a $1,000 deductible and a separate wind and hail deductible (if required).
                </p>
                <p className={classes.styleMargin} >
                    These are sample rates and should be used as an approximate value. Your actual quotes may differ.
                </p>
                <p className={classes.mainTitle} >
                    Financing:
                </p>
                <p className={classes.title} >
                    Down payment: 20%
                </p>
                <p className={classes.styleMargin} >
                    It is set as default since most lenders require 20% down payment to forego mortgage insurance which is an extra cost burden to the investor.
                </p>
                <p className={classes.title} >
                    Interest rate:
                </p>
                <p className={classes.styleMargin} >
                    It is based on the current average rate for the benchmark 30-year fixed mortgage. (updated monthly)
                </p>
                <p className={classes.title} >
                    Loan term: 30 yrs
                </p>
                <p className={classes.styleMargin} >
                    In the United States, the traditional home loan is the 30-year fixed rate mortgage. This is the most popular loan for those buying homes for the first time and even those who own more than one home. The 30-year fixed home loan fits more financial situations than any other home loan. This loan program also allows the homebuyer to have low monthly payments while having payment certainty throughout the duration of the loan.
                </p>
                <p className={classes.subtitle} >
                    Highlights of the 30 year fixed rate mortgage are:
                </p>
                <ul className={classes.ulStyle} style={{ marginTop: "5px" }} >
                    <li>If the homebuyer chooses to increase their monthly payments, they can build equity in their home faster.</li>
                    <li>There are usually no prepayment penalties with a 30-year fixed rate mortgage.</li>
                    <li>If rates rise the homeowner is protected, but if rates fall the homeowner can refinance into a lower rate loan.</li>
                </ul>
                <p>
                    <span style={{ fontWeight: "510", fontSize: "16px" }} >Note:</span> These default parameters are meant to make your analysis easier and faster. They should be used as an approximate value. Your actual quotes may differ. You can always edit them to suit your specific requirements.
                </p>
            </Paper>
            break;
    }


    return (
        <div>
            {DisclaimerComponent}
        </div>
    );
}
