import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { updatePurchaseCriteria } from "./api.call";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
    notSelected: {
        margin: "10px",
        marginLeft: "0px",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down('sm')]: {
            fontSize: "12px",
        }
    },
    linesCont: {
        width: "calc(100% - 180px)",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        backgroundColor: "white",
        height: "95px",
        display: "flex",
        flexWrap: "wrap",
        overflowY: "hidden",
        borderRadius: "10px",
        padding: "7px 10px 0px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
        }
    },
    selectedIcon: {
        fontSize: "20px",
        marginRight: "5px",
        color: theme.palette.primary.main,
        cursor: "pointer",
    },
    notSelectedIcon: {
        fontSize: "20px",
        marginRight: "5px",
        color: "#EBF6FE",
        cursor: "pointer",
    }
}));

export default function CriteriaLine(props) {
    const classes = useStyles();
    const { criteriaPolicy, criteriaType, setAllCriteriaPolicies, allCriteriaPolicies, setLoadingBool } = props;

    const updateOnClick = async (data) => {
        setLoadingBool(true)
        await updatePurchaseCriteria({
            criteriaId: criteriaPolicy?.[criteriaType]?._id,
            updateField: data
        })
            .then((data) => {
                let updatedCriteriaPolicy = []
                allCriteriaPolicies.map((curCriteriaPolicy) => {
                    if (curCriteriaPolicy?._id === criteriaPolicy?._id) {
                        const updatedObj = {
                            ...curCriteriaPolicy,
                            [criteriaType]: data
                        }
                        updatedCriteriaPolicy.push(updatedObj)
                    } else {
                        updatedCriteriaPolicy.push(curCriteriaPolicy)
                    }
                })
                setAllCriteriaPolicies(updatedCriteriaPolicy)
            })
            .catch((err) => {
                console.log(err)
            })
        setLoadingBool(false)
    };



    return (
        <div className={classes.linesCont} >
            <p
                className={classes.notSelected}

                onClick={() => { updateOnClick({ criteriaOnPurchasePriceBool: !criteriaPolicy?.[criteriaType]?.criteriaOnPurchasePriceBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnPurchasePriceBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                Purchase Price No More Than ${criteriaPolicy?.[criteriaType]?.purchasePriceLimit}
            </p>
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOnTotalCashNeededBool: !criteriaPolicy?.[criteriaType]?.criteriaOnTotalCashNeededBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnTotalCashNeededBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                Total Cash Needed No More Than ${criteriaPolicy?.[criteriaType]?.TotalCashNeededLimit}
            </p>
            {criteriaType === "BRRRR" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnTotalCashInvestedBool: !criteriaPolicy?.[criteriaType]?.criteriaOnTotalCashInvestedBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnTotalCashInvestedBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Total Cash Invested No More Than ${criteriaPolicy?.[criteriaType]?.TotalCashInvestedLimit}
                </p>
            ) : null}
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOn70RuleBool: !criteriaPolicy?.[criteriaType]?.criteriaOn70RuleBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOn70RuleBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                70% Rule
            </p>
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOnPricePerSqFtBool: !criteriaPolicy?.[criteriaType]?.criteriaOnPricePerSqFtBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnPricePerSqFtBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                Price Per Square Foot No More Than ${criteriaPolicy?.[criteriaType]?.pricePerSqFtLimit}
            </p>
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOnARVPerSqFtBool: !criteriaPolicy?.[criteriaType]?.criteriaOnARVPerSqFtBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnARVPerSqFtBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                ARV Per Square Foot No More Than ${criteriaPolicy?.[criteriaType]?.aRVPerSqFtLimit}
            </p>
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOn1RuleBool: !criteriaPolicy?.[criteriaType]?.criteriaOn1RuleBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOn1RuleBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    1% Rule
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOn2RuleBool: !criteriaPolicy?.[criteriaType]?.criteriaOn2RuleBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOn2RuleBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    2% Rule
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOn50RuleBool: !criteriaPolicy?.[criteriaType]?.criteriaOn50RuleBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOn50RuleBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    50% Rule
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnCashFlowBool: !criteriaPolicy?.[criteriaType]?.criteriaOnCashFlowBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnCashFlowBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Cash Flow(per month) At Least ${criteriaPolicy?.[criteriaType]?.cashFlowLimit}
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnCOCBool: !criteriaPolicy?.[criteriaType]?.criteriaOnCOCBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnCOCBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Cash on Cash Return At Least {criteriaPolicy?.[criteriaType]?.cOCLimit}
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnROEBool: !criteriaPolicy?.[criteriaType]?.criteriaOnROEBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnROEBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Return on Equity At Least {criteriaPolicy?.[criteriaType]?.rOELimit}
                </p>
            ) : null}
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOnROIBool: !criteriaPolicy?.[criteriaType]?.criteriaOnROIBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnROIBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                Return on Investment At Least {criteriaPolicy?.[criteriaType]?.rOILimit}
            </p>
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnIRRBool: !criteriaPolicy?.[criteriaType]?.criteriaOnIRRBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnIRRBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Internal Rate of Return At Least {criteriaPolicy?.[criteriaType]?.iRRLimit}
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaAnnualizedROIBool: !criteriaPolicy?.[criteriaType]?.criteriaAnnualizedROIBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaAnnualizedROIBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Annualized ROI At Least {criteriaPolicy?.[criteriaType]?.annualizedROILimit}
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnRentToValueBool: !criteriaPolicy?.[criteriaType]?.criteriaOnRentToValueBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnRentToValueBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Rent to Value At Least {criteriaPolicy?.[criteriaType]?.rentToValueLimit}
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnGRMBool: !criteriaPolicy?.[criteriaType]?.criteriaOnGRMBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnGRMBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Gross Rent Multiplier No More Than {criteriaPolicy?.[criteriaType]?.gRMLimit}
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnEquityMultipleBool: !criteriaPolicy?.[criteriaType]?.criteriaOnEquityMultipleBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnEquityMultipleBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Equity Multiple At Least {criteriaPolicy?.[criteriaType]?.equityMultipleLimit}
                </p>
            ) : null}
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOnBreakEvenRatioBool: !criteriaPolicy?.[criteriaType]?.criteriaOnBreakEvenRatioBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnBreakEvenRatioBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                Break Even Ratio No More Than {criteriaPolicy?.[criteriaType]?.breakEvenRatioLimit}
            </p>
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOnLoanToCostRatioBool: !criteriaPolicy?.[criteriaType]?.criteriaOnLoanToCostRatioBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnLoanToCostRatioBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                Loan to Cost Ratio No More Than {criteriaPolicy?.[criteriaType]?.loanToCostRatioLimit}
            </p>
            <p
                className={classes.notSelected}
                onClick={() => { updateOnClick({ criteriaOnLoanToValueRatioBool: !criteriaPolicy?.[criteriaType]?.criteriaOnLoanToValueRatioBool }) }}
            >
                {criteriaPolicy?.[criteriaType]?.criteriaOnLoanToValueRatioBool ? (
                    <CheckCircleIcon className={classes.selectedIcon} />
                ) : (
                    <FiberManualRecordIcon className={classes.notSelectedIcon} />
                )}
                Loan to Value Ratio No More Than {criteriaPolicy?.[criteriaType]?.loanToValueRatioLimit}
            </p>
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnDebtCoverageRatioBool: !criteriaPolicy?.[criteriaType]?.criteriaOnDebtCoverageRatioBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnDebtCoverageRatioBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Debt Coverage Ratio At Least {criteriaPolicy?.[criteriaType]?.debtCoverageRatioLimit}
                </p>
            ) : null}
            {criteriaType !== "Flip" ? (
                <p
                    className={classes.notSelected}
                    onClick={() => { updateOnClick({ criteriaOnDebtYieldBool: !criteriaPolicy?.[criteriaType]?.criteriaOnDebtYieldBool }) }}
                >
                    {criteriaPolicy?.[criteriaType]?.criteriaOnDebtYieldBool ? (
                        <CheckCircleIcon className={classes.selectedIcon} />
                    ) : (
                        <FiberManualRecordIcon className={classes.notSelectedIcon} />
                    )}
                    Debt Yield At Least {criteriaPolicy?.[criteriaType]?.debtYieldLimit}
                </p>
            ) : null}
        </div>
    );
}
