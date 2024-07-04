import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import { Chip, Paper, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


const useStyles = makeStyles((theme) => ({
    finance_container: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column"
        }
    },
    singleCriteria: {
        width: "48%",
        display: "flex",
        alignItems: "center",
        margin: "7px 0px",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        }
    },
    lableStyle: {
        marginRight: "7px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            fontSize: "12px"
        }
    },
    greenLabel: {
        color: "green",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            fontSize: "13px"
        }
    },
    redLabel: {
        color: "red",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            fontSize: "13px"
        }
    }
}));




export default function Criteria(props) {
    const history = useHistory();
    const classes = useStyles();
    const { teamId } = useParams();
    const { currentReport, resultData, projectData } = props;

    return (
        <div className={classes.finance_container} >
            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPurchasePriceBool && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.purchasePriceLimit >= currentReport?.purchasePrice ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Purchase Price </Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.purchasePriceLimit >= currentReport?.purchasePrice ? (
                        <p className={classes.greenLabel} >less than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.purchasePriceLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >greater than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.purchasePriceLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashNeededBool && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashNeededLimit >= resultData?.totalCashNeeded ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Total Cash Needed</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashNeededLimit >= resultData?.totalCashNeeded ? (
                        <p className={classes.greenLabel} >less than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashNeededLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >greater than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashNeededLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashInvestedBool && currentReport?.reportType === "BRRRR" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashInvestedLimit >= resultData.totalCashInvested ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Total Cash Invested</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashInvestedLimit >= resultData.totalCashInvested ? (
                        <p className={classes.greenLabel} >less than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashInvestedLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >greater than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashInvestedLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn70RuleBool && (
                <div className={classes.singleCriteria} >
                    {resultData?.is70Rule ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    {resultData?.is70Rule ? (
                        <p className={classes.greenLabel} >Pass 70% Rule</p>
                    ) : (
                        <p className={classes.redLabel} >Fails 70% Rule</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPricePerSqFtBool && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.pricePerSqFtLimit >= resultData.pricePerSq ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Price Per Square Foot</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.pricePerSqFtLimit >= resultData.pricePerSq ? (
                        <p className={classes.greenLabel} >less than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.pricePerSqFtLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >greater than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.pricePerSqFtLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnARVPerSqFtBool && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.aRVPerSqFtLimit >= resultData.arvPerSq ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >ARV Per Square Foot</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.aRVPerSqFtLimit >= resultData.arvPerSq ? (
                        <p className={classes.greenLabel} >less than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.aRVPerSqFtLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >greater than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.aRVPerSqFtLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn1RuleBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {resultData?.is1Rule ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    {resultData?.is1Rule ? (
                        <p className={classes.greenLabel} >Pass 1% Rule</p>
                    ) : (
                        <p className={classes.redLabel} >Fails 1% Rule</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn2RuleBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {resultData?.is2Rule ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    {resultData?.is2Rule ? (
                        <p className={classes.greenLabel} >Pass 2% Rule</p>
                    ) : (
                        <p className={classes.redLabel} >Fails 2% Rule</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn50RuleBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {resultData?.is50Rule ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    {resultData?.is50Rule ? (
                        <p className={classes.greenLabel} >Pass 50% Rule</p>
                    ) : (
                        <p className={classes.redLabel} >Fails 50% Rule</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCashFlowBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.cashFlowLimit <= parseFloat(resultData.LeveredCashFlow) / 12 ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Cash Flow(per month)</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.cashFlowLimit <= parseFloat(resultData.LeveredCashFlow) / 12 ? (
                        <p className={classes.greenLabel} >greater than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.cashFlowLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >less than ${projectData?.purchasePolicy?.[currentReport?.reportType]?.cashFlowLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCOCBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.cOCLimit <= resultData?.COC ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Cash on Cash Return</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.cOCLimit <= resultData?.COC ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.cOCLimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.cOCLimit}%</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROEBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOELimit <= resultData.ROE ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Return on Equity</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOELimit <= resultData.ROE ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOELimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOELimit}%</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROIBool && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOILimit <= resultData?.ROI ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Return on Investment</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOILimit <= resultData?.ROI ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOILimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.rOILimit}%</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnIRRBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.iRRLimit <= resultData?.LeveredIRRArray[0] ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Internal Rate of Return</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.iRRLimit <= resultData?.LeveredIRRArray[0] ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.iRRLimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.iRRLimit}%</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaAnnualizedROIBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.annualizedROILimit <= resultData?.annualizedROI ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Annualized ROI</Typography>
                    {currentReport?.annualizedROILimit <= resultData?.annualizedROI ? (
                        <p className={classes.greenLabel} >greater than {currentReport?.annualizedROILimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >less than {currentReport?.annualizedROILimit}%</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnRentToValueBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.rentToValueLimit <= resultData.rentToValue ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Rent to Value</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.rentToValueLimit <= resultData.rentToValue ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.rentToValueLimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.rentToValueLimit}%</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnGRMBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.gRMLimit >= resultData.GRM ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Gross Rent Multiplier</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.gRMLimit >= resultData.GRM ? (
                        <p className={classes.greenLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.gRMLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.gRMLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnEquityMultipleBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.equityMultipleLimit <= resultData.equityMultiple ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Equity Multiple</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.equityMultipleLimit <= resultData.equityMultiple ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.equityMultipleLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.equityMultipleLimit}</p>
                    )}
                </div>)}

            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnBreakEvenRatioBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.breakEvenRatioLimit >= resultData.breakEvenRatio ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Break Even Ratio</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.breakEvenRatioLimit >= resultData.breakEvenRatio ? (
                        <p className={classes.greenLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.breakEvenRatioLimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.breakEvenRatioLimit}%</p>
                    )}
                </div>)}

            {currentReport?.isFinancing && projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToCostRatioBool && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToCostRatioLimit >= resultData.loanToCost ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Loan to Cost Ratio</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToCostRatioLimit >= resultData.loanToCost ? (
                        <p className={classes.greenLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToCostRatioLimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToCostRatioLimit}%</p>
                    )}
                </div>)}

            {currentReport?.isFinancing && projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToValueRatioBool && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToValueRatioLimit >= resultData.loanToValue ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Loan to Value Ratio</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToValueRatioLimit >= resultData.loanToValue ? (
                        <p className={classes.greenLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToValueRatioLimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToValueRatioLimit}%</p>
                    )}
                </div>)}

            {currentReport?.isFinancing && projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtCoverageRatioBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtCoverageRatioLimit <= resultData.debtCoverageRatio ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Debt Coverage Ratio</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtCoverageRatioLimit <= resultData.debtCoverageRatio ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtCoverageRatioLimit}</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtCoverageRatioLimit}</p>
                    )}
                </div>)}

            {currentReport?.isFinancing && projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtYieldBool && currentReport?.reportType !== "Flip" && (
                <div className={classes.singleCriteria} >
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtYieldLimit <= resultData.debtYield ? (
                        <CheckCircleIcon
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    ) : (
                        <CancelIcon
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                    <Typography className={classes.lableStyle} >Debt Yield</Typography>
                    {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtYieldLimit <= resultData.debtYield ? (
                        <p className={classes.greenLabel} >greater than {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtYieldLimit}%</p>
                    ) : (
                        <p className={classes.redLabel} >less than {projectData?.purchasePolicy?.[currentReport?.reportType]?.debtYieldLimit}%</p>
                    )}
                </div>)}
        </div>
    )
}