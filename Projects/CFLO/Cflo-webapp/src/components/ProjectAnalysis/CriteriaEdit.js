import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Chip, Paper, Typography } from "@material-ui/core";
import { updateAnalysisReport, updatePurchaseCriteria } from "./api.call";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfoLabel from "./InputComponents/InfoLabel";
import TextFieldNumberFormated from "../styled/CommonComponents/TextFieldNumberFormated";
import { useDebounce } from "react-use";

const useStyles = makeStyles((theme) => ({
    mainHeader: {
        fontSize: "20px",
        color: theme.palette.primary.main,
        fontWeight: "500"
    },
    paperCont: {
        margin: "0px 0px 2rem",
        padding: "0px 1rem",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down('sm')]: {
            margin: "12px 0px",
        }
    },
    inputMainCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 0px",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
        }
    },
    leftHalf: {
        width: "50%",
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        }
    },
    rightHalf: {
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        }
    },
    paperTitle: {
        fontSize: "21px",
        color: "#00345D",
        fontWeight: "510",
        marginBottom: "7px"
    },
    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "2rem",
        [theme.breakpoints.down('sm')]: {
            margin: "12px",
        }
    },
    loaderCont: {
        position: 'fixed',
        top: "0px",
        right: "0px",
        width: "100vw",
        height: "100vh",
        zIndex: "1000",
        paddingLeft: "100px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('xs')]: {
            paddingLeft: "0px",
        },
    },
}));


export default function CriteriaEdit(props) {
    const history = useHistory();
    const classes = useStyles();
    const { teamId } = useParams();
    const {
        currentReport, projectData, setProjectData, isForManagement,
        allCriteriaPolicies, setAllCriteriaPolicies
    } = props;

    const [purchasePriceLimit, setPurchasePriceLimit] = useState(0)
    const [cashNeededLimit, setCashNeedLimit] = useState(0)
    const [role70Limit, setRole70Limit] = useState(0)
    const [priceSqFtLimit, setPriceSqFtLimit] = useState(0)
    const [aRVpriceSqFtLimit, setARVPriceSqFtLimit] = useState(0)
    const [cashFlowLimit, setCashFlowLimit] = useState(0)
    const [cOCReturnLimit, setCOCReturnLimit] = useState(0)
    const [ROELimit, setROELimit] = useState(0)
    const [ROILimit, setROILimit] = useState(0)
    const [IRRLimit, setIRRLimit] = useState(0)
    const [rentToValueLimit, setRentToValueLimit] = useState(0)
    const [grossRentMultiplerLimit, setGrossRentMultiplerLimit] = useState(0)
    const [equityMultipleLimit, setEquityMultipleLimit] = useState(0)
    const [breakEvenRatioLimit, setBreakEvenRatioLimit] = useState(0)
    const [loanToCostLimit, setLoanToCostLimit] = useState(0)
    const [loanToValueLimit, setLoanToValueLimit] = useState(0)
    const [debtCoverageRatioLimit, setDebtCoverageRatioLimit] = useState(0)
    const [debtYieldLimit, setDebtYieldLimit] = useState(0)
    const [totalCashInvestedLimit, setTotalCashInvestedLimit] = useState(0)
    const [annualizedROILimit, setAnnualizedROILimit] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setAnnualizedROILimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.annualizedROILimit)
        setTotalCashInvestedLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashInvestedLimit)
        setPurchasePriceLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.purchasePriceLimit)
        setCashNeedLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.TotalCashNeededLimit)
        setRole70Limit(projectData?.purchasePolicy?.[currentReport?.reportType]?.rule70Limit)
        setPriceSqFtLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.pricePerSqFtLimit)
        setARVPriceSqFtLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.aRVPerSqFtLimit)
        setCashFlowLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.cashFlowLimit)
        setCOCReturnLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.cOCLimit)
        setROELimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.rOELimit)
        setROILimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.rOILimit)
        setIRRLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.iRRLimit)
        setRentToValueLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.rentToValueLimit)
        setGrossRentMultiplerLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.gRMLimit)
        setEquityMultipleLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.equityMultipleLimit)
        setBreakEvenRatioLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.breakEvenRatioLimit)
        setLoanToCostLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToCostRatioLimit)
        setLoanToValueLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.loanToValueRatioLimit)
        setDebtCoverageRatioLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.debtCoverageRatioLimit)
        setDebtYieldLimit(projectData?.purchasePolicy?.[currentReport?.reportType]?.debtYieldLimit)
    }, [])


    const saveCriteria = async () => {
        const updatedObj = {
            purchasePriceLimit: purchasePriceLimit,
            TotalCashNeededLimit: cashNeededLimit,
            TotalCashInvestedLimit: totalCashInvestedLimit,
            rule70Limit: role70Limit,
            pricePerSqFtLimit: priceSqFtLimit,
            aRVPerSqFtLimit: aRVpriceSqFtLimit,
            cashFlowLimit: cashFlowLimit,
            cOCLimit: cOCReturnLimit,
            rOELimit: ROELimit,
            rOILimit: ROILimit,
            iRRLimit: IRRLimit,
            annualizedROILimit: annualizedROILimit,
            rentToValueLimit: rentToValueLimit,
            gRMLimit: grossRentMultiplerLimit,
            equityMultipleLimit: equityMultipleLimit,
            breakEvenRatioLimit: breakEvenRatioLimit,
            loanToCostRatioLimit: loanToCostLimit,
            loanToValueRatioLimit: loanToValueLimit,
            debtCoverageRatioLimit: debtCoverageRatioLimit,
            debtYieldLimit: debtYieldLimit
        };

        await updatePurchaseCriteria({
            criteriaId: projectData?.purchasePolicy?.[currentReport?.reportType]?._id,
            updateField: updatedObj
        })
            .then((data) => {
                if (isForManagement) {
                    let updatedCriteriaPolicy = []
                    allCriteriaPolicies.map((curCriteriaPolicy) => {
                        if (curCriteriaPolicy?._id === projectData?.purchasePolicy?._id) {
                            const updatedObj = {
                                ...curCriteriaPolicy,
                                [currentReport?.reportType]: data
                            }
                            updatedCriteriaPolicy.push(updatedObj)
                        } else {
                            updatedCriteriaPolicy.push(curCriteriaPolicy)
                        }
                    })
                    setAllCriteriaPolicies(updatedCriteriaPolicy)
                } else {
                    let reportType = currentReport?.reportType
                    let currentPPolicy = projectData?.purchasePolicy
                    const updatedProject = {
                        ...projectData,
                        purchasePolicy: {
                            ...currentPPolicy,
                            [reportType]: data
                        }
                    }
                    setProjectData(updatedProject)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useDebounce(
        () => {
            saveCriteria();
        },
        1200,
        [purchasePriceLimit, cashNeededLimit, totalCashInvestedLimit, aRVpriceSqFtLimit,
            role70Limit, priceSqFtLimit, cashFlowLimit, cOCReturnLimit,
            ROELimit, ROILimit, annualizedROILimit, rentToValueLimit, IRRLimit,
            grossRentMultiplerLimit, equityMultipleLimit, breakEvenRatioLimit,
            loanToCostLimit, loanToValueLimit, debtCoverageRatioLimit, debtYieldLimit]
    )

    const updateOnClick = async (data) => {
        setIsLoading(true)
        await updatePurchaseCriteria({
            criteriaId: projectData?.purchasePolicy?.[currentReport?.reportType]?._id,
            updateField: data
        })
            .then((data) => {
                let reportType = currentReport?.reportType
                let currentPPolicy = projectData?.purchasePolicy
                const updatedProject = {
                    ...projectData,
                    purchasePolicy: {
                        ...currentPPolicy,
                        [reportType]: data
                    }
                }
                setProjectData(updatedProject)
            })
            .catch((err) => {
                console.log(err)
            })
        setIsLoading(false)
    };





    return (
        <div style={{ paddingTop: "15px", width: "100%" }} >
            <Typography className={classes.mainHeader} ></Typography>

            <Typography className={classes.paperTitle} >Purchase</Typography>

            <Paper className={classes.paperCont} >
                <div className={classes.inputMainCont} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPurchasePriceBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnPurchasePriceBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPurchasePriceBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnPurchasePriceBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPurchasePriceBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={"The amount that you are paying to buy a property"}
                            />
                            <h3>Purchase Price:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPurchasePriceBool && (<>
                            <Typography>No More Than:</Typography>
                            <TextFieldNumberFormated
                                value={purchasePriceLimit}
                                onChange={(e) => { setPurchasePriceLimit(e.target.value) }}
                                variant={"outlined"}
                                style={{ width: "60%" }}
                                size={"small"}
                                disabled={false}
                            />
                        </>)}
                    </div>
                </div>

                <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashNeededBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnTotalCashNeededBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashNeededBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnTotalCashNeededBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashNeededBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={
                                    "The total amount of cash required to buy and rehab a property"
                                }
                            />
                            <h3>Total Cash Needed:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashNeededBool && (<>
                            <Typography>No More Than:</Typography>
                            <TextFieldNumberFormated
                                value={cashNeededLimit}
                                onChange={(e) => { setCashNeedLimit(e.target.value) }}
                                variant={"outlined"}
                                style={{ width: "60%" }}
                                size={"small"}
                                disabled={false}
                            />
                        </>)}
                    </div>
                </div>

                {currentReport?.reportType === "BRRRR" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashInvestedBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnTotalCashInvestedBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashInvestedBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnTotalCashInvestedBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashInvestedBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "The total amount of cash required to buy and rehab a property"
                                    }
                                />
                                <h3>Total Cash Invested:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnTotalCashInvestedBool && (<>
                                <Typography>No More Than:</Typography>
                                <TextFieldNumberFormated
                                    value={totalCashInvestedLimit}
                                    onChange={(e) => { setTotalCashInvestedLimit(e.target.value) }}
                                    variant={"outlined"}
                                    style={{ width: "60%" }}
                                    size={"small"}
                                    disabled={false}
                                />
                            </>)}
                        </div>
                    </div>
                )}
            </Paper>

            <Typography className={classes.paperTitle} >Valuation</Typography>

            <Paper className={classes.paperCont} >
                <div className={classes.inputMainCont} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn70RuleBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOn70RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn70RuleBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOn70RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn70RuleBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={
                                    "states that the sum of purchase price and rehab costs of a property should not exceed 70% of its ARV(after repair value).(Purchase price + Rehab costs)70% of ARV"
                                }
                            />
                            <h3>70% Rule:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn70RuleBool && (<>
                            <Typography>ARV Multiple:</Typography>
                            <TextField
                                id="outlined-start-adornment"
                                type="number"
                                value={role70Limit}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setRole70Limit(val);
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                variant="outlined"
                                style={{ width: "60%" }}
                                size="small"
                            />
                        </>)}
                    </div>
                </div>

                <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPricePerSqFtBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnPricePerSqFtBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPricePerSqFtBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnPricePerSqFtBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPricePerSqFtBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={
                                    "Ratio of purchase price and total square footage of the property"
                                }
                            />
                            <h3>Price Per Square Foot:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnPricePerSqFtBool && (<>
                            <Typography>No More Than:</Typography>
                            <TextFieldNumberFormated
                                value={priceSqFtLimit}
                                onChange={(e) => { setPriceSqFtLimit(e.target.value) }}
                                variant={"outlined"}
                                style={{ width: "60%" }}
                                size={"small"}
                                disabled={false}
                            />
                        </>)}
                    </div>
                </div>


                <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnARVPerSqFtBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnARVPerSqFtBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnARVPerSqFtBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnARVPerSqFtBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnARVPerSqFtBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={
                                    "Ratio of after repair value and total square footage of the property"
                                }
                            />
                            <h3>ARV Per Square Foot:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnARVPerSqFtBool && (<>
                            <Typography>No More Than:</Typography>
                            <TextFieldNumberFormated
                                value={aRVpriceSqFtLimit}
                                onChange={(e) => { setARVPriceSqFtLimit(e.target.value) }}
                                variant={"outlined"}
                                style={{ width: "60%" }}
                                size={"small"}
                                disabled={false}
                            />
                        </>)}
                    </div>
                </div>
            </Paper>


            {currentReport?.reportType !== "Flip" && (<>
                <Typography className={classes.paperTitle} >Cash Flow</Typography>

                <Paper className={classes.paperCont} >
                    <div className={classes.inputMainCont} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn1RuleBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOn1RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn1RuleBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOn1RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn1RuleBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "states that the rent to value ratio (ratio of monthly gross rent to purchase price) of a property should not be less than 1 percent. Rent to value(Monthly gross rent/Purchase price)1%"
                                    }
                                />
                                <h3>1% Rule:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} ></div>
                    </div>


                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn2RuleBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOn2RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn2RuleBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOn2RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn2RuleBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "states that the rent to value ratio (ratio of monthly gross rent to purchase price) of a property should not be less than 2 percent. Rent to value or (Monthly gross rent/Purchase price)2%"
                                    }
                                />
                                <h3>2% Rule:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} ></div>
                    </div>
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn50RuleBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOn50RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn50RuleBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOn50RuleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOn50RuleBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "states that operating expenses should not exceed 50% of the operating income. Operating expense(Operating income/2)"
                                    }
                                />
                                <h3>50% Rule:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} ></div>
                    </div>


                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCashFlowBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnCashFlowBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCashFlowBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnCashFlowBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCashFlowBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "Net amount received from a rental property as income, when financing is used"
                                    }
                                />
                                <h3>Cash Flow(per month):</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCashFlowBool && (<>
                                <Typography>At Least:</Typography>
                                <TextFieldNumberFormated
                                    value={cashFlowLimit}
                                    onChange={(e) => { setCashFlowLimit(e.target.value) }}
                                    variant={"outlined"}
                                    style={{ width: "60%" }}
                                    size={"small"}
                                    disabled={false}
                                />
                            </>)}
                        </div>
                    </div>
                </Paper>
            </>)}

            <Typography className={classes.paperTitle} >Investment Returns</Typography>

            <Paper className={classes.paperCont} >
                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCOCBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnCOCBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCOCBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnCOCBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCOCBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={"COC=Yearly cash flow/ Cash Invested"}
                                />
                                <h3>Cash on Cash Return:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnCOCBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    id="outlined-start-adornment"
                                    type="number"
                                    value={cOCReturnLimit}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCOCReturnLimit(val);
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}




                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROEBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnROEBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROEBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnROEBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROEBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={"ROE= Yearly cash flow/Total equity at the end of the year"}
                                />
                                <h3>Return on Equity:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROEBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    id="outlined-basic"
                                    type="number"
                                    value={ROELimit}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setROELimit(val);
                                    }}
                                    variant="outlined"
                                    size="small"
                                    style={{ width: "60%" }}
                                />
                            </>)}
                        </div>
                    </div>)}


                <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROIBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnROIBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROIBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnROIBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROIBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={
                                    "Total return on your invested cash if you were to sell the property. ROI = (Total equity + cumulative cash flow - selling cost - total invested cash) / total invested cash"
                                }
                            />
                            <h3>Return on Investment:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnROIBool && (<>
                            <Typography>At Least:</Typography>
                            <TextField
                                id="outlined-start-adornment"
                                type="number"
                                value={ROILimit}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setROILimit(val);
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                variant="outlined"
                                style={{ width: "60%" }}
                                size="small"
                            />
                        </>)}
                    </div>
                </div>

                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnIRRBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnIRRBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnIRRBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnIRRBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnIRRBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "IRR is a discount rate that makes the net present value (NPV) of all cash flows equal to zero in a discounted cash flow analysis."
                                    }
                                />
                                <h3>Internal Rate of Return:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnIRRBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    id="outlined-start-adornment"
                                    type="number"
                                    value={IRRLimit}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setIRRLimit(val);
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}


                {currentReport?.reportType === "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaAnnualizedROIBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaAnnualizedROIBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaAnnualizedROIBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaAnnualizedROIBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaAnnualizedROIBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "IRR is a discount rate that makes the net present value (NPV) of all cash flows equal to zero in a discounted cash flow analysis."
                                    }
                                />
                                <h3>Annualized ROI:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaAnnualizedROIBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    id="outlined-start-adornment"
                                    type="number"
                                    value={annualizedROILimit}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setAnnualizedROILimit(val);
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}
            </Paper>

            <Typography className={classes.paperTitle} >Financial Ratios</Typography>

            <Paper className={classes.paperCont} >
                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnRentToValueBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnRentToValueBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnRentToValueBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnRentToValueBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnRentToValueBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "A rate of return of a rental property based on comparing the monthly gross rent to the purchase price or market value. Rent to value (at purchase)= Monthly Gross Rent/ Purchase Price. Rent to value (subsequently) = Monthly Gross Rent/Market value"
                                    }
                                />
                                <h3>Rent to Value:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnRentToValueBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    id="outlined-start-adornment"
                                    type="number"
                                    value={rentToValueLimit}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setRentToValueLimit(val);
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}

                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnGRMBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnGRMBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnGRMBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnGRMBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnGRMBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "A rate of return of a rental property based on comparing the purchase price or market value to the yearly gross rent. The gross rent multiplier shows the number of years it will take for the yearly gross rent to add up to the original purchase price. Gross Rent Multiplier (at purchase) = Purchase Price/ Yearly Gross Rent. Gross Rent Multiplier(subsequently) = Market value/yearly gross rent"
                                    }
                                />
                                <h3>Gross Rent Multiplier:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnGRMBool && (<>
                                <Typography>No More Than:</Typography>
                                <TextField
                                    value={grossRentMultiplerLimit}
                                    type="number"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setGrossRentMultiplerLimit(val);
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}

                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnEquityMultipleBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnEquityMultipleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnEquityMultipleBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnEquityMultipleBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnEquityMultipleBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "A ratio that shows the total rate of return of a rental property based on comparing the total profit from your investment to the total invested cash. The equity multiple takes into account the cumulative cash flow, equity accumulation and loan paydown and shows the total cumulative return on your invested capital, if you were to sell the property at a given point in time. The equity multiple is the same as the ROI, except expressed as a ratio. Equity Multiple = (Total equity - selling cost + cumulative cash flow)/Total invested cash"
                                    }
                                />
                                <h3>Equity Multiple:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnEquityMultipleBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    value={equityMultipleLimit}
                                    type="number"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setEquityMultipleLimit(val);
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}

                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnBreakEvenRatioBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnBreakEvenRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnBreakEvenRatioBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnBreakEvenRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnBreakEvenRatioBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "A ratio that compares a property's yearly operating expenses and debt service (loan payments) to its yearly gross rent. The break even ratio shows the minimum percentage of occupancy needed to cover all operating expenses and debt service obligations for a rental property. Break Even Ratio = (Yearly operating expense + Yearly debt service)/Yearly Gross Rent"
                                    }
                                />
                                <h3>Break Even Ratio:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnBreakEvenRatioBool && (<>
                                <Typography>No More Than:</Typography>
                                <TextField
                                    id="outlined-start-adornment"
                                    type="number"
                                    value={breakEvenRatioLimit}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setBreakEvenRatioLimit(val);
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}


                <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToCostRatioBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnLoanToCostRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToCostRatioBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnLoanToCostRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToCostRatioBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={
                                    "The ratio between loan amount and property acquisition cost. If rehab is financed: LTC = Loan amount/(Purchase price+Rehab Cost). If rehab is not financed: LTC = Loan amount/Purchase price"
                                }
                            />
                            <h3>Loan to Cost Ratio:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToCostRatioBool && (<>
                            <Typography>No More Than:</Typography>
                            <TextField
                                id="outlined-start-adornment"
                                type="number"
                                value={loanToCostLimit}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLoanToCostLimit(val);
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                variant="outlined"
                                style={{ width: "60%" }}
                                size="small"
                            />
                        </>)}
                    </div>
                </div>


                <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                    <div className={classes.leftHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToValueRatioBool ? (
                            <CheckCircleIcon
                                style={{
                                    color: "#009C79",
                                    marginRight: "10px",
                                    borderRadius: "50%"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnLoanToValueRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToValueRatioBool }) }}
                            />
                        ) : (
                            <FiberManualRecordIcon
                                style={{
                                    color: "#EBF6FE",
                                    marginLeft: "-4px",
                                    fontSize: "35px"
                                }}
                                onClick={() => { updateOnClick({ criteriaOnLoanToValueRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToValueRatioBool }) }}
                            />
                        )}
                        <div style={{ display: "flex", alignItems: "center" }} >
                            <InfoLabel
                                text={
                                    "The ratio between loan amount and the market value of the property"
                                }
                            />
                            <h3>Loan to Value Ratio:</h3>
                        </div>
                    </div>
                    <div className={classes.rightHalf} >
                        {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnLoanToValueRatioBool && (<>
                            <Typography>No More Than:</Typography>
                            <TextField
                                id="outlined-start-adornment"
                                type="number"
                                value={loanToValueLimit}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLoanToValueLimit(val);
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                variant="outlined"
                                style={{ width: "60%" }}
                                size="small"
                            />
                        </>)}
                    </div>
                </div>

                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtCoverageRatioBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnDebtCoverageRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtCoverageRatioBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnDebtCoverageRatioBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtCoverageRatioBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "A ratio that compares a property's yearly NOI to its yearly debt service - the total principal and interest payments on the loan. The debt coverage ratio, sometimes also called the debt service coverage ratio, is often used by lenders to determine loan eligibility. A debt coverage ratio below 1 indicates that there is not enough cash flow to cover the debt service, and may result in a loan denial. Debt Coverage Ratio = Yearly NOI/ Yearly Debt Service"
                                    }
                                />
                                <h3>Debt Coverage Ratio:</h3>
                            </div>
                            <Typography></Typography>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtCoverageRatioBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    value={debtCoverageRatioLimit}
                                    type="number"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setDebtCoverageRatioLimit(val);
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}

                {currentReport?.reportType !== "Flip" && (
                    <div className={classes.inputMainCont} style={{ borderTop: "1px solid #e9e8e8" }} >
                        <div className={classes.leftHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtYieldBool ? (
                                <CheckCircleIcon
                                    style={{
                                        color: "#009C79",
                                        marginRight: "10px",
                                        borderRadius: "50%"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnDebtYieldBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtYieldBool }) }}
                                />
                            ) : (
                                <FiberManualRecordIcon
                                    style={{
                                        color: "#EBF6FE",
                                        marginLeft: "-4px",
                                        fontSize: "35px"
                                    }}
                                    onClick={() => { updateOnClick({ criteriaOnDebtYieldBool: !projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtYieldBool }) }}
                                />
                            )}
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <InfoLabel
                                    text={
                                        "A ratio that compares a property's yearly NOI to the total loan amount. The debt yield is often used by lenders to determine loan eligibility, as an indicator of leverage and loan risk. A lower debt yield indicates higher leverage and therefore higher risk, while a higher debt yield indicates lower leverage and therefore lower risk. Debt Yield = Yearly NOI/Loan Amount"
                                    }
                                />
                                <h3>Debt Yield:</h3>
                            </div>
                        </div>
                        <div className={classes.rightHalf} >
                            {projectData?.purchasePolicy?.[currentReport?.reportType]?.criteriaOnDebtYieldBool && (<>
                                <Typography>At Least:</Typography>
                                <TextField
                                    id="outlined-start-adornment"
                                    value={debtYieldLimit}
                                    type="number"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setDebtYieldLimit(val);
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    variant="outlined"
                                    style={{ width: "60%" }}
                                    size="small"
                                />
                            </>)}
                        </div>
                    </div>)}
            </Paper>

            {isLoading &&
                <div className={classes.loaderCont} >
                    <CircularProgress
                        size={60}
                        thickness={3}
                        style={{ color: 'rgb(92, 144, 242)' }}
                    />
                </div>
            }
        </div>
    );
}
