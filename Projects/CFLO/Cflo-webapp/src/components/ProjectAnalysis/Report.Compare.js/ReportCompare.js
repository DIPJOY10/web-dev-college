import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Button, Grow, Typography, useMediaQuery } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import Dialog from "@material-ui/core/Dialog";
import SaveIcon from '@material-ui/icons/Save';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import BusinessIcon from '@material-ui/icons/Business';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ShareIcon from '@material-ui/icons/Share';
import _ from 'lodash';
import ListIcon from '@material-ui/icons/List';
import config from "../../../config/index";
import { criteriaLabelArr } from "../criteria.label.data"
import Autocomplete from "@material-ui/lab/Autocomplete";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { createCompareReports, fetchReports, getAllAdminProfileCriteria, getReports, getCompareReports, getReportsByIdsArr, updateCompareReport } from "../api.call";
import { reportDataCalculation } from "../CalculationFunctions";
import "./index.css"
import Footer from "../../landing/footer/footer";
import SavedCompareReports from "./Saved.Compare.Reports";
import CompareReportShareDialog from "./Report.Compare.Share";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
    },
    navHeader: {
        height: '50px',
        display: 'flex',
        padding: '0px 20px',
        paddingLeft: "5px",
        backgroundColor: "white",
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            padding: '0px',
            paddingLeft: "5px",
        }
    },
    navLeft: {
        display: 'flex',
        alignItems: 'center',
        "& p": {
            fontSize: "20px",
            fontWeight: "500",
            color: theme.palette.primary.main
        },
        [theme.breakpoints.down('sm')]: {
            "& p": {
                fontSize: "16px",
            },
        }
    },
    backBtn: {
        fontSize: "27px",
        marginRight: "10px",
        cursor: "pointer",
        [theme.breakpoints.down('sm')]: {
            fontSize: "25px",
        }
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
    },
    mainCont: {
        height: "calc(100vh - 50px)",
        width: "100%",
        overflowY: "auto",
        backgroundColor: "#F5F5F5",
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        padding: "30px"
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
    allCompareCont: {
        maxWidth: "100%",
        display: "flex",
        backgroundColor: "white",
        padding: "30px",
        position: "relative",
    },
    editBtn: {
        position: "absolute",
        top: "30px",
        left: "30px",
        display: "flex",
        flexDirection: "column",
    },
    compareData: {
        display: "flex",
    },
    iconCont: {
        textAlign: "center",
        width: "150px",
        backgroundColor: "#dad8d8",
        borderRadius: "5px",
    },
    compareLabel: {
        minWidth: "360px",
    },
    createSpace: {
        minWidth: "100%",
        height: "260px",
    },
    dataLabelCont: {
        minWidth: "100%",
        "& p": {
            fontSize: "14px",
            fontWeight: "450",
            padding: "5px 0px",
        },
        "& h3": {
            fontSize: "16px",
            fontWeight: "500",
            paddingBottom: "10px",
            paddingTop: "30px",
            color: theme.palette.primary.main,
        }
    },
    compareDataCont: {
        display: "flex",
        minWidth: "calc(100% - 360px)",
        overflowX: "auto"
    },
    propertyDataCont: {
        "& p": {
            width: "350px",
            textAlign: "right",
            fontSize: "14px",
            fontWeight: "450",
            padding: "5px 0px",
            paddingRight: "30px"
        },
        "& h3": {
            width: "350px",
            textAlign: "right",
            fontSize: "16px",
            fontWeight: "500",
            paddingBottom: "10px",
            paddingTop: "30px",
            color: theme.palette.primary.main,
            paddingRight: "30px"
        }
    },
    lableForTwoLine: {
        paddingBottom: "25px"
    },
    titleStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 15px",
        backgroundColor: theme.palette.primary.main
    },
    dividers: {
        padding: "16px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            padding: "10px",
        }
    },
    footerTop: {
        width: "100%",
        backgroundColor: "#2e73f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px 20px",
        marginTop: "60px",
        "& a": {
            textDecoration: "none",
            color: "white"
        }
    }
}));

export default function ReportCompare(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { compareId, publicParam } = useParams();
    const { auth, team: teamReducer } = useSelector((state) => state);
    const { user } = auth
    const { teamIds, teamDictionary } = teamReducer;

    const [openShareDialog, setOpenShareDialog] = useState(false)
    const [loadingBool, setLoadingBool] = useState(false)
    const [stateChange, setStateChange] = useState(false)
    const [editBtnBool, setEditBtnBool] = useState(true)
    const [compareArr, setCompareArr] = useState([])
    const [allProjects, setAllProjects] = useState([])
    const [allCriteriaPolicies, setAllCriteriaPolicies] = useState([])
    const [selectedCriteria, setSelectedCriteria] = useState({})
    const [criteriaText, setCriteriaText] = useState("")
    const [reportType, setReportType] = useState(null)
    const [showCompareData, setShowCompareData] = useState(false)
    const [numOfSelected, setNumOfSelected] = useState(0)
    const [criteriaDialog, setCriteriaDialog] = useState(false)
    const [compView, setCompView] = useState("ownerView")

    const closeCriteriaDialog = () => {
        setCriteriaDialog(false)
    }

    const getDataFromReducer = () => {
        if (allProjects.length === 0) {
            var projectRows = [];
            teamIds.map((teamId) => {
                var value = teamDictionary[teamId];
                if (value?.parentModelName === "Project" && value?.parent) {
                    projectRows.push(value?.parent);
                }
            });
            setAllProjects(projectRows)
        }
    };

    const getAllCriteria = async () => {
        await getAllAdminProfileCriteria({ profileId: user.profile })
            .then((data) => {
                console.log(data)
                setAllCriteriaPolicies(data)
                setSelectedCriteria(data[0])
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const createDataArrWithReportsApiCall = async (reportType, compareData) => {
        let teamIds = [];
        let reportsDataArr = compareData?.reports
        reportsDataArr.map((report) => {
            teamIds.push(report?.teamId?._id)
        })
        await getReportsByIdsArr({
            teamIdArr: teamIds,
            reportTypes: reportType
        })
            .then((reports) => {
                let compDataArr = []
                let grouped_data = _.groupBy(reports, 'teamId')
                reportsDataArr.map((report) => {
                    let teamId = report?.teamId?._id
                    let reportData = {
                        ...report,
                        teamId: teamId
                    }
                    let projectData = report?.teamId?.parent
                    reportDataCalculation(reportData, projectData)
                        .then((calculatedData) => {
                            compDataArr.push({
                                project: projectData,
                                reportsArr: grouped_data?.[teamId],
                                report: reportData,
                                calculatedData: calculatedData
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                setCompareArr(compDataArr)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const resetCompare = async () => {
        if (compareId) {
            await getCompareReports({ compareId: compareId })
                .then(async (data) => {
                    await createDataArrWithReportsApiCall(data?.compareType, data)
                        .then((fullUpdatedData) => {
                            setReportType(data?.compareType)
                            setShowCompareData(true)
                            setNumOfSelected(data.reports.length)
                            setSelectedCriteria(data?.criteriaPolicy)
                            setEditBtnBool(true)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const compareInitArr = [
                {
                    project: null,
                    reportsArr: [],
                    report: null,
                    calculatedData: null
                },
                {
                    project: null,
                    reportsArr: [],
                    report: null,
                    calculatedData: null
                }
            ]
            setCompareArr(compareInitArr)
            setReportType(null)
            setShowCompareData(false)
            setNumOfSelected(0)
        }
    }

    useEffect(() => {
        if (user) {
            getDataFromReducer()
            getAllCriteria()
        }
        resetCompare()

        if (compareId) {
            if (publicParam) {
                setCompView("publicView")
            } else {
                setCompView("ownerEditView")
            }
        }
    }, [compareId, publicParam])

    const selectProject = async (value, inx) => {
        setLoadingBool(true)
        setStateChange(!stateChange)
        const teamId = value?.team;
        let queryObj
        if (reportType) {
            queryObj = {
                teamId: teamId,
                reportType: reportType
            }
        } else {
            queryObj = {
                teamId: teamId
            }
        }
        await getReports({ query: queryObj })
            .then((data) => {
                let updatedArr = [...compareArr];
                let rentalRArr = []
                let flipRArr = []
                let brrrrRArr = []
                data.map((d) => {
                    if (d?.reportType === "Rental") {
                        rentalRArr.push(d);
                    } else if (d?.reportType === "Flip") {
                        flipRArr.push(d);
                    } else if (d?.reportType === "BRRRR") {
                        brrrrRArr.push(d);
                    }
                })
                let modifiedReportArr = [...rentalRArr, ...brrrrRArr, ...flipRArr];
                let editObj = {
                    ...updatedArr[inx],
                    project: value,
                    reportsArr: modifiedReportArr
                }
                updatedArr[inx] = editObj;
                setCompareArr(updatedArr)
                setStateChange(!stateChange)
                setLoadingBool(false)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const selectReport = async (value, inx) => {
        setLoadingBool(true)
        setStateChange(!stateChange)
        await reportDataCalculation(value, compareArr[inx]?.project)
            .then((data) => {
                console.log(data);
                let updatedArr = [...compareArr];
                let editObj = {
                    ...updatedArr[inx],
                    report: value,
                    calculatedData: data
                }
                updatedArr[inx] = editObj;
                let isAnyEmpty = true;
                let num = 0;
                let type = null

                updatedArr.map((d) => {
                    if (!d?.project || !d?.report || !d?.calculatedData) {
                        isAnyEmpty = false
                    } else {
                        num++;
                        type = d?.report?.reportType
                    }
                })
                setReportType(type)
                setNumOfSelected(num)
                if (isAnyEmpty) {
                    updatedArr.push({
                        project: null,
                        reportsArr: [],
                        report: null,
                        calculatedData: null
                    })
                }
                setCompareArr(updatedArr)
                setStateChange(!stateChange)
                setLoadingBool(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onSelectCriteria = (value) => {
        setSelectedCriteria(value)
        closeCriteriaDialog(false)
    }

    const saveCompare = async () => {
        let reportArr = [];
        console.log(compareArr)
        compareArr.map((compData) => {
            if (compData?.report?._id) {
                reportArr.push(compData?.report?._id)
            }
        })
        if (compareId) {
            const newObj = {
                reports: reportArr,
                criteriaPolicy: selectedCriteria?._id,
                _id: compareId
            }

            await updateCompareReport(newObj)
                .then((data) => {
                    console.log(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            const newObj = {
                reports: reportArr,
                criteriaPolicy: selectedCriteria?._id,
                compareType: reportType,
                profile: user.profile
            }
            await createCompareReports(newObj)
                .then((data) => {
                    console.log(data)
                    history.push(`/investment/analysis/compare/${data?._id}`)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const editEnable = () => {
        setEditBtnBool(false)
        const newObj = {
            project: null,
            reportsArr: [],
            report: null,
            calculatedData: null
        }
        const editedArr = [...compareArr, newObj]
        setCompareArr(editedArr)
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const checkCriteriaFun = (criteriaLabel, compareProp) => {
        if (criteriaLabel?.compare) {
            if (criteriaLabel?.compare === "greater") {
                if (selectedCriteria?.[reportType]?.[criteriaLabel?.limitLabel] >= compareProp?.calculatedData?.[criteriaLabel?.calculatedLabel]) {
                    return true
                } else {
                    return false
                }
            } else if (criteriaLabel?.compare === "less") {
                if (selectedCriteria?.[reportType]?.[criteriaLabel?.limitLabel] <= compareProp?.calculatedData?.[criteriaLabel?.calculatedLabel]) {
                    return true;
                } else {
                    return false
                }
            }
        } else {
            return compareProp?.calculatedData?.[criteriaLabel?.calculatedLabel];
        }
    }

    console.log(compView)

    let HeaderView = null;

    switch (compView) {
        case "ownerView":
        case "ownerEditView":
            HeaderView = <div className={classes.navHeader} >
                <div className={classes.navLeft} >
                    <KeyboardBackspaceIcon onClick={() => { history.goBack() }} className={classes.backBtn} />
                    <p>Compare Reports</p>
                </div>
                <div className={classes.navRight} >
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<ListIcon />}
                        onClick={() => { setCompView("listView") }}
                    >
                        Saved Compares
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<RotateLeftIcon />}
                        style={{ marginLeft: "15px" }}
                        onClick={() => { resetCompare() }}
                    >
                        reset
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { saveCompare() }}
                        style={{ marginLeft: "15px" }}
                        startIcon={<SaveIcon />}
                        disabled={!showCompareData}
                    >
                        Save Compare
                    </Button>
                </div>
            </div>
            break;

        case "publicView":
            HeaderView = <></>
            break;

        case "listView":
            HeaderView = <div className={classes.navHeader} >
                <div className={classes.navLeft} >
                    <KeyboardBackspaceIcon onClick={() => { history.goBack() }} className={classes.backBtn} />
                    <p>Compare Reports</p>
                </div>
                <div className={classes.navRight} >
                </div>
            </div>
            break
    }


    let BodyView = null;

    switch (compView) {
        case "ownerView":
        case "ownerEditView":
        case "publicView":
            BodyView = <>
                <div className={classes.allCompareCont} >
                    <div className={classes.editBtn} >
                        {compView === "ownerEditView" && editBtnBool && showCompareData && (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => { editEnable() }}
                                startIcon={<EditIcon />}
                            >
                                Edit Compare
                            </Button>
                        )}
                        {compView === "ownerEditView" && showCompareData && (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => { setOpenShareDialog(true) }}
                                style={{ marginTop: "10px" }}
                                startIcon={<ShareIcon />}
                            >
                                Share
                            </Button>
                        )}

                        <CompareReportShareDialog
                            compareId={compareId}
                            openShareDialog={openShareDialog}
                            setOpenShareDialog={setOpenShareDialog}
                        />

                    </div>
                    {showCompareData ? (
                        <div className={classes.compareLabel} >
                            <div className={classes.createSpace} ></div>
                            <div className={classes.dataLabelCont} >
                                <h3>PROPERTY DESCRIPTION</h3>
                                <p>Property Type:</p>
                                <p>Beds / Baths:</p>
                                <p>Square Footage:</p>
                                <p>Year Built:</p>
                                <p>Lot Size:</p>

                                <h3>PURCHASE & REHAB</h3>
                                <p>Purchase Price:</p>
                                <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Amount Financed:</p>
                                <p style={{ color: theme.palette.primary.main }} >Down Payment:</p>
                                <p>Purchase Costs:</p>
                                <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Rehab Costs:</p>
                                <p>Total Cash Needed:</p>

                                <h3>FINANCING (Purchase)</h3>
                                <p>Loan Amount:</p>
                                <p>Loan to Cost:</p>
                                <p>Loan to Value:</p>
                                <p>Financing Of:</p>
                                <p>Loan Type:</p>
                                <p>Interest Rate:</p>
                                <p>Mortgage Insurance</p>

                                <h3>VALUATION</h3>
                                <p>After Repair Value:</p>
                                <p>ARV Per Square Foot:</p>
                                <p>Price Per Square Foot</p>
                                <p>Rehab Per Square Foot:</p>

                                {(reportType === "BRRRR" || reportType === "Flip") ? (<>
                                    <h3>HOLDING COSTS</h3>
                                    <p>Holding Period:</p>
                                    <p style={{ paddingBottom: "25px" }} >Loan Payments</p>
                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Holding Costs</p>
                                    <p style={{ color: theme.palette.primary.main }} >Total</p>
                                </>) : null}
                                {reportType === "Rental" && (
                                    <>
                                        <h3>CASH FLOW (Monthly, Year 1)</h3>
                                        <p style={{ paddingBottom: "25px" }} >Gross Rent:</p>
                                        <p>Vacancy:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Other Income:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Operating Income:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Operating Expenses:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Net Operating Income:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}`, paddingBottom: "25px" }} >Loan Payments:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Cash Flow:</p>

                                        <h3>INVESTMENT RETURNS (Year 1):</h3>
                                        <p>Cap Rate (Purchase Price):</p>
                                        <p>Cap Rate (Market Value):</p>
                                        <p>Cash on Cash Return:</p>
                                        <p>Return on Equity:</p>
                                        <p>Return on Investment</p>
                                        <p>Internal Rate of Return</p>

                                        <h3>FINANCIAL RATIOS (At Purchase)</h3>
                                        <p>Rent to Value:</p>
                                        <p>Gross Rent Multiplier:</p>
                                        <p>Equity Multiple:</p>
                                        <p>Break Even Ratio:</p>
                                        <p>Debt Coverage Ratio:</p>
                                        <p>Debt Yield:</p>
                                    </>
                                )}
                                {reportType === "BRRRR" && (
                                    <>
                                        <h3>REFINANCE</h3>
                                        <p>Refinance Loan Amount:</p>
                                        <p>Refinance Costs:</p>
                                        <p>Purchase Loan Repayment:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Holding Costs:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Refinance Cash Out:</p>
                                        <p>Invested Cash:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Refinance Cash Out</p>
                                        <p style={{ color: theme.palette.primary.main }} >Total Cash Invested:</p>

                                        <h3>FINANCING (Refinance)</h3>
                                        <p>Loan Amount:</p>
                                        <p>Loan to Value:</p>
                                        <p>Financing Of:</p>
                                        <p>Loan Type:</p>
                                        <p>Interest Rate:</p>
                                        <p style={{ paddingBottom: "25px" }} >Mortgage Insurance</p>

                                        <h3>CASH FLOW (Year 1, After Refinance)</h3>
                                        <p style={{ paddingBottom: "25px" }} >Gross Rent:</p>
                                        <p>Vacancy:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Other Income:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Operating Income:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Operating Expenses:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Net Operating Income:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Loan Payments:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Cash Flow:</p>

                                        <h3>INVESTMENT RETURNS (Year 1, After Refinance):</h3>
                                        <p>Cap Rate (Purchase Price):</p>
                                        <p>Cap Rate (Market Value):</p>
                                        <p>Cash on Cash Return:</p>
                                        <p>Return on Equity:</p>
                                        <p>Return on Investment</p>
                                        <p>Internal Rate of Return</p>

                                        <h3>FINANCIAL RATIOS (At Purchase)</h3>
                                        <p>Rent to Value:</p>
                                        <p>Gross Rent Multiplier:</p>
                                        <p>Equity Multiple:</p>
                                        <p>Break Even Ratio:</p>
                                        <p>Debt Coverage Ratio:</p>
                                        <p>Debt Yield:</p>
                                    </>
                                )}
                                {reportType === "Flip" && (
                                    <>
                                        <h3>SALE & PROFIT</h3>
                                        <p>After Repair Value:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Selling Costs</p>
                                        <p style={{ color: theme.palette.primary.main }} >Sale Proceeds</p>
                                        <p>Loan Repayment</p>
                                        <p>Holding Costs:</p>
                                        <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Invested Cash:</p>
                                        <p style={{ color: theme.palette.primary.main }} >Total Profit</p>

                                        <h3>INVESTMENT RETURNS</h3>
                                        <p>Return on Investment:</p>
                                        <p>Annualized ROI:</p>
                                    </>
                                )}
                                <h3>PURCHASE CRITERIA
                                    {compView === "ownerView" ? (
                                        <EditIcon
                                            style={{ cursor: 'pointer', marginBottom: "-7px", marginLeft: '10px' }}
                                            onClick={() => { setCriteriaDialog(true) }}
                                        />
                                    ) : (<>
                                        {compView === "ownerEditView" && !editBtnBool && (
                                            <EditIcon
                                                style={{ cursor: 'pointer', marginBottom: "-7px", marginLeft: '10px' }}
                                                onClick={() => { setCriteriaDialog(true) }}
                                            />
                                        )}
                                    </>)}
                                </h3>
                                {criteriaLabelArr.map((criteriaLabel) => (
                                    <>
                                        {criteriaLabel?.type ? (<>
                                            {selectedCriteria?.[reportType]?.[criteriaLabel?.boolLabel] && reportType === criteriaLabel?.type && (
                                                <p>{`${criteriaLabel?.text} ${criteriaLabel?.limitLabel ? selectedCriteria?.[reportType]?.[criteriaLabel?.limitLabel] : ""}`}</p>
                                            )}
                                        </>) : (<>
                                            {criteriaLabel?.typeNot ? (<>
                                                {reportType !== criteriaLabel?.typeNot && selectedCriteria?.[reportType]?.[criteriaLabel?.boolLabel] && (
                                                    <p>{`${criteriaLabel?.text} ${criteriaLabel?.limitLabel ? selectedCriteria?.[reportType]?.[criteriaLabel?.limitLabel] : ""}`}</p>
                                                )}
                                            </>) : (<>
                                                {selectedCriteria?.[reportType]?.[criteriaLabel?.boolLabel] && (
                                                    <p>{`${criteriaLabel?.text} ${criteriaLabel?.limitLabel ? selectedCriteria?.[reportType]?.[criteriaLabel?.limitLabel] : ""}`}</p>
                                                )}
                                            </>)}
                                        </>)}
                                    </>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    <div className="compareDataCont" >
                        {compareArr && compareArr.length > 0 && compareArr.map((compareProp, i) => (
                            <div>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px", height: "130px" }} >
                                    {compareProp?.project ? (
                                        <>
                                            <img
                                                style={{
                                                    width: "150px",
                                                    maxHeight: "130px"
                                                }}
                                                src={compareProp?.project?.displayPicture?.url}
                                            />
                                        </>
                                    ) : (
                                        <div className={classes.iconCont} >
                                            <BusinessIcon
                                                style={{
                                                    fontSize: "100px",
                                                    color: "gray"
                                                }}
                                            />
                                            <AddCircleIcon
                                                style={{
                                                    fontSize: "32px",
                                                    color: "green",
                                                    position: "relative",
                                                    top: "4px",
                                                    left: "-23px"
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{
                                        margin: "0px 20px",
                                        marginBottom: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                        height: "40px"
                                    }}
                                >
                                    {compView === "ownerView" && allProjects && allProjects.length > 0 && (
                                        <Autocomplete
                                            size="small"
                                            value={compareProp?.project || {}}
                                            options={allProjects}
                                            getOptionLabel={(option) => { return option?.displayName || "Select a project ..." }}
                                            getOptionSelected={(option) => {
                                                return option?._id == compareProp?.project?._id;
                                            }}
                                            style={{ width: "300px" }}
                                            onChange={(event, value) => {
                                                selectProject(value, i)
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={"Select Project"}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                    {compView === "ownerEditView" && (<>
                                        {editBtnBool ? (
                                            <>{compareProp?.project?.displayName}</>
                                        ) : (<>
                                            {allProjects && allProjects.length > 0 && (
                                                <Autocomplete
                                                    size="small"
                                                    value={compareProp?.project || {}}
                                                    options={allProjects}
                                                    getOptionLabel={(option) => { return option?.displayName || "Select a project ..." }}
                                                    getOptionSelected={(option) => {
                                                        return option?._id == compareProp?.project?._id;
                                                    }}
                                                    style={{ width: "300px" }}
                                                    onChange={(event, value) => {
                                                        selectProject(value, i)
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={"Select Project"}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            )}
                                        </>)}
                                    </>)}
                                    {compView === "publicView" && (
                                        <>{compareProp?.project?.displayName}</>
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        height: "40px"
                                    }}
                                >
                                    {compView === "ownerView" && compareProp?.reportsArr && compareProp?.reportsArr.length > 0 && (
                                        <Autocomplete
                                            id="grouped-demo"
                                            size="small"
                                            value={compareProp?.report || {}}
                                            options={compareProp?.reportsArr}
                                            groupBy={(option) => option?.reportType}
                                            onChange={(event, value) => {
                                                selectReport(value, i)
                                            }}
                                            getOptionLabel={(option) => { return option?.reportTitle || "Select a report ..." }}
                                            style={{ width: "300px" }}
                                            renderInput={(params) => <TextField {...params} label="Select Report" size="small" variant="outlined" />}
                                        />
                                    )}

                                    {compView === "ownerEditView" && (<>
                                        {editBtnBool ? (
                                            <>{compareProp?.report?.reportTitle}</>
                                        ) : (<>
                                            {compareProp?.reportsArr && compareProp?.reportsArr.length > 0 && (
                                                <Autocomplete
                                                    id="grouped-demo"
                                                    size="small"
                                                    value={compareProp?.report || {}}
                                                    options={compareProp?.reportsArr}
                                                    groupBy={(option) => option?.reportType}
                                                    onChange={(event, value) => {
                                                        selectReport(value, i)
                                                    }}
                                                    getOptionLabel={(option) => { return option?.reportTitle || "Select a report ..." }}
                                                    style={{ width: "300px" }}
                                                    renderInput={(params) => <TextField {...params} label="Select Report" size="small" variant="outlined" />}
                                                />
                                            )}
                                        </>)}
                                    </>)}
                                    {compView === "publicView" && (
                                        <>{compareProp?.report?.reportTitle}</>
                                    )}
                                </div>
                                <div classsName={classes.propertyDataCont} >
                                    {showCompareData && compareProp?.project && compareProp?.report && compareProp?.calculatedData ? (
                                        <div className={classes.propertyDataCont} >
                                            <h3>PROPERTY DESCRIPTION</h3>
                                            <p>{compareProp?.project?.subCategory || compareProp?.project?.category || "-"}</p>
                                            <p>{`${compareProp?.project?.roomNumbers || "-"} / ${compareProp?.project?.bathNumbers || "-"}`}</p>
                                            <p>{compareProp?.project?.area || "-"}</p>
                                            <p>{compareProp?.project?.year || "-"}</p>
                                            <p>{compareProp?.project?.lotSize || "-"}</p>

                                            <h3>PURCHASE & REHAB</h3>
                                            <p>{compareProp?.report?.purchasePrice ? numberWithCommas(parseFloat(compareProp?.report?.purchasePrice).toFixed(2)) : "-"}</p>
                                            <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{compareProp?.calculatedData?.amountFinanced ? numberWithCommas(parseFloat(compareProp?.calculatedData?.amountFinanced).toFixed(2)) : "-"}</p>
                                            <p style={{ color: theme.palette.primary.main }} >{compareProp?.calculatedData?.downPaymentCash ? numberWithCommas(parseFloat(compareProp?.calculatedData?.downPaymentCash).toFixed(2)) : "-"}</p>
                                            <p>{compareProp?.report?.purchaseTotal ? numberWithCommas(parseFloat(compareProp?.report?.purchaseTotal).toFixed(2)) : "-"}</p>
                                            <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{compareProp?.calculatedData?.rehabCombined ? numberWithCommas(parseFloat(compareProp?.calculatedData?.rehabCombined).toFixed(2)) : "-"}</p>
                                            <p style={{ color: theme.palette.primary.main }} >{compareProp?.calculatedData?.totalCashNeeded ? numberWithCommas(parseFloat(compareProp?.calculatedData?.totalCashNeeded).toFixed(2)) : "-"}</p>

                                            <h3>FINANCING (Purchase)</h3>
                                            <p>{compareProp?.calculatedData?.amountFinanced ? numberWithCommas(parseFloat(compareProp?.calculatedData?.amountFinanced).toFixed(2)) : "-"}</p>
                                            <p>{compareProp?.calculatedData?.loanToCost ? numberWithCommas(parseFloat(compareProp?.calculatedData?.loanToCost).toFixed(2)) : "-"}</p>
                                            <p>{compareProp?.calculatedData?.loanToValue ? numberWithCommas(parseFloat(compareProp?.calculatedData?.loanToValue).toFixed(2)) : "-"}</p>
                                            <p>
                                                {(100 - Number(compareProp?.report?.DownPayment)) > 0 && Number(compareProp?.report?.RehabCostPercent) > 0 ? (
                                                    <>Purchase({(100 - Number(compareProp?.report?.DownPayment))}%) Rehab({compareProp?.report?.RehabCostPercent}%)</>
                                                ) : (
                                                    <>{(100 - Number(compareProp?.report?.DownPayment)) > 0 ? (<>
                                                        Purchase({(100 - Number(compareProp?.report?.DownPayment))}%)
                                                    </>) : (<>
                                                        {Number(compareProp?.report?.RehabCostPercent) > 0 ? (<>
                                                            Rehab({compareProp?.report?.RehabCostPercent}%)
                                                        </>) : (<>
                                                            no Finance
                                                        </>)}
                                                    </>)}</>
                                                )}
                                            </p>
                                            <p>
                                                {compareProp?.report?.LoanTerm ? (
                                                    <>{`${compareProp?.report?.LoanType}, ${compareProp?.report?.LoanTerm} years`}</>
                                                ) : (
                                                    <>{`${compareProp?.report?.LoanType}, - years`}</>
                                                )}
                                            </p>
                                            <p>{compareProp?.report?.InterestRate ? parseFloat(compareProp?.report?.InterestRate).toFixed(2) : "-"}</p>
                                            <p>
                                                <>{`Upfront: $${compareProp?.calculatedData?.mortgageUpfrontAmount ? numberWithCommas(parseFloat(compareProp?.calculatedData?.mortgageUpfrontAmount).toFixed(2)) : "-"}`}</>
                                                <>{`Recurring: $${compareProp?.calculatedData?.mortgageRecurringAmount ? numberWithCommas(parseFloat(compareProp?.calculatedData?.mortgageRecurringAmount).toFixed(2)) : "-"}`}</>
                                            </p>

                                            <h3>VALUATION</h3>
                                            <p>{compareProp?.report?.ARV ? numberWithCommas(parseFloat(compareProp?.report?.ARV).toFixed(2)) : "-"}</p>
                                            <p>{compareProp?.calculatedData?.arvPerSq ? numberWithCommas(parseFloat(compareProp?.calculatedData?.arvPerSq).toFixed(2)) : "-"}</p>
                                            <p>{compareProp?.calculatedData?.pricePerSq ? numberWithCommas(parseFloat(compareProp?.calculatedData?.pricePerSq).toFixed(2)) : "-"}</p>
                                            <p>{compareProp?.calculatedData?.rehabPerSq ? numberWithCommas(parseFloat(compareProp?.calculatedData?.rehabPerSq).toFixed(2)) : "-"}</p>

                                            {(reportType === "BRRRR" || reportType === "Flip") ? (<>
                                                <h3>HOLDING COSTS</h3>
                                                <p>{`${compareProp?.report?.rehabPeriod ? compareProp?.report?.rehabPeriod : "- "} months`}</p>
                                                <p>
                                                    <>{`$ ${compareProp?.calculatedData?.holdingLoanPayments ? numberWithCommas(parseFloat(compareProp?.calculatedData?.holdingLoanPayments).toFixed(2)) : " -"} \n`}</>
                                                    <br />
                                                    <span style={{ fontSize: "12px" }} >({`$ ${compareProp?.calculatedData?.holdingLoanPayments && compareProp?.report?.rehabPeriod ? numberWithCommas(parseFloat((parseInt(compareProp?.calculatedData?.holdingLoanPayments)) / parseInt(compareProp?.report?.rehabPeriod)).toFixed(2)) : "- "}`}/mo)</span>
                                                </p>
                                                <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{`$ ${compareProp?.calculatedData?.recurringTotal ? numberWithCommas(parseFloat(compareProp?.calculatedData?.recurringTotal).toFixed(2)) : "-"}`}</p>
                                                <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.holdingCosts ? numberWithCommas(parseFloat(compareProp?.calculatedData?.holdingCosts).toFixed(2)) : "-"}`}</p>
                                            </>) : null}
                                            {reportType === "Rental" && (
                                                <>
                                                    <h3>CASH FLOW (Monthly, Year 1)</h3>
                                                    <p>
                                                        <>{`$ ${compareProp?.calculatedData?.AnnualRentalIncome ? numberWithCommas(parseFloat(compareProp?.calculatedData?.AnnualRentalIncome).toFixed(2)) : "-"}`}</>
                                                        <br />
                                                        <span style={{ fontSize: "12px" }} >({`$ ${compareProp?.calculatedData?.GrossRentPerMonth ? numberWithCommas(parseFloat(compareProp?.calculatedData?.GrossRentPerMonth).toFixed(2)) : "-"} `}/mo)</span>
                                                    </p>
                                                    <p>{compareProp?.calculatedData?.VacancyExpense ? numberWithCommas(parseFloat(compareProp?.calculatedData?.VacancyExpense).toFixed(2)) : "-"}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{compareProp?.calculatedData?.AnnualOtherIncome ? numberWithCommas(parseFloat(compareProp?.calculatedData?.AnnualOtherIncome).toFixed(2)) : "-"}</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{compareProp?.calculatedData?.operatingIncome ? numberWithCommas(parseFloat(compareProp?.calculatedData?.operatingIncome).toFixed(2)) : "-"}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{compareProp?.calculatedData?.operatingExpenseCombined ? numberWithCommas(parseFloat(compareProp?.calculatedData?.operatingExpenseCombined).toFixed(2)) : "-"}</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.NOI ? numberWithCommas(parseFloat(compareProp?.calculatedData?.NOI).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >
                                                        <>{`$ ${compareProp?.calculatedData?.AnnualLoanPayment ? numberWithCommas(parseFloat(compareProp?.calculatedData?.AnnualLoanPayment).toFixed(2)) : "-"}`}</>
                                                        <br />
                                                        <span style={{ fontSize: "12px" }} >({`$ ${compareProp?.calculatedData?.AnnualLoanPayment ? numberWithCommas((parseFloat(parseFloat(compareProp?.calculatedData?.AnnualLoanPayment)) / 12).toFixed(2)) : "-"}`}/mo)</span>
                                                    </p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.LeveredCashFlow ? numberWithCommas(parseFloat(compareProp?.calculatedData?.LeveredCashFlow).toFixed(2)) : "-"}`}</p>

                                                    <h3>INVESTMENT RETURNS (Year 1):</h3>
                                                    <p>{`${compareProp?.calculatedData?.capRate ? parseFloat(compareProp?.calculatedData?.capRate).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.capRateMarket ? parseFloat(compareProp?.calculatedData?.capRateMarket).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.COC ? parseFloat(compareProp?.calculatedData?.COC).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.ROE ? parseFloat(compareProp?.calculatedData?.ROE).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.ROI ? parseFloat(compareProp?.calculatedData?.ROI).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.UnleveredIRRArray[0] ? parseFloat(compareProp?.calculatedData?.UnleveredIRRArray[0]).toFixed(2) : "-"}%`}</p>

                                                    <h3>FINANCIAL RATIOS (At Purchase)</h3>
                                                    <p>{`${compareProp?.calculatedData?.rentToValue ? parseFloat(compareProp?.calculatedData?.rentToValue).toFixed(2) : "-"}`}%</p>
                                                    <p>{`${compareProp?.calculatedData?.GRM ? parseFloat(compareProp?.calculatedData?.GRM).toFixed(2) : "-"}`}</p>
                                                    <p>{`${compareProp?.calculatedData?.equityMultiple ? parseFloat(compareProp?.calculatedData?.equityMultiple).toFixed(2) : "-"}`}</p>
                                                    <p>{`${compareProp?.calculatedData?.breakEvenRatio ? parseFloat(compareProp?.calculatedData?.breakEvenRatio).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.debtCoverageRatio ? parseFloat(compareProp?.calculatedData?.debtCoverageRatio).toFixed(2) : "-"}`}</p>
                                                    <p>{`${compareProp?.calculatedData?.debtYield ? parseFloat(compareProp?.calculatedData?.debtYield).toFixed(2) : "-"}%`}</p>
                                                </>
                                            )}
                                            {reportType === "BRRRR" && (
                                                <>
                                                    <h3>REFINANCE</h3>
                                                    <p>{`$ ${compareProp?.calculatedData?.refinanceLoanAmt ? numberWithCommas(parseFloat(compareProp?.calculatedData?.refinanceLoanAmt).toFixed(2)) : "-"}`}</p>
                                                    <p>{`$ ${compareProp?.report?.refinanceCostTotal ? numberWithCommas(parseFloat(compareProp?.report?.refinanceCostTotal).toFixed(2)) : "-"}`}</p>
                                                    <p>{`$ ${compareProp?.calculatedData?.purchaseRepayment ? numberWithCommas(parseFloat(compareProp?.calculatedData?.purchaseRepayment).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{`$ ${compareProp?.calculatedData?.holdingCosts ? numberWithCommas(parseFloat(compareProp?.calculatedData?.holdingCosts).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.refinanceCashOut ? numberWithCommas(parseFloat(compareProp?.calculatedData?.refinanceCashOut).toFixed(2)) : "-"}`}</p>
                                                    <p>{`$ ${compareProp?.calculatedData?.totalCashNeeded ? numberWithCommas(parseFloat(compareProp?.calculatedData?.totalCashNeeded).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >Refinance Cash Out</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.totalCashInvested ? numberWithCommas(parseFloat(compareProp?.calculatedData?.totalCashInvested).toFixed(2)) : "-"}`}</p>

                                                    <h3>FINANCING (Refinance)</h3>
                                                    <p>{`$ ${compareProp?.calculatedData?.refinanceLoanAmt ? numberWithCommas(parseFloat(compareProp?.calculatedData?.refinanceLoanAmt).toFixed(2)) : "-"}`}</p>
                                                    <p>{`${compareProp?.calculatedData?.refinanceLoanToValue ? parseFloat(compareProp?.calculatedData?.refinanceLoanToValue).toFixed(2) : "-"}%`}</p>
                                                    <p>Financing Of:</p>
                                                    <p>
                                                        {compareProp?.report?.refinanceLoanTerm ? (
                                                            <>{`${compareProp?.report?.refinanceLoanType}, ${compareProp?.report?.refinanceLoanTerm} years`}</>
                                                        ) : (
                                                            <>{`${compareProp?.report?.refinanceLoanType}`}</>
                                                        )}
                                                    </p>
                                                    <p>{`${compareProp?.report?.refinanceInterestRate ? parseFloat(compareProp?.report?.refinanceInterestRate).toFixed(2) : "-"}%`}</p>
                                                    <p>
                                                        <>{`Upfront: $${compareProp?.calculatedData?.mortgageRefUpfrontAmount ? numberWithCommas(parseFloat(compareProp?.calculatedData?.mortgageRefUpfrontAmount).toFixed(2)) : "-"}`}</>
                                                        <br />
                                                        <span style={{ fontSize: "12px" }} >{`Recurring: $${compareProp?.calculatedData?.mortgageRefRecurringAmount ? numberWithCommas(parseFloat(compareProp?.calculatedData?.mortgageRefRecurringAmount).toFixed(2)) : "-"}`}</span>
                                                    </p>

                                                    <h3>CASH FLOW (Year 1, After Refinance)</h3>
                                                    <p>
                                                        <>{`$ ${compareProp?.calculatedData?.AnnualRentalIncome ? numberWithCommas(parseFloat(compareProp?.calculatedData?.AnnualRentalIncome).toFixed(2)) : "-"}`}</>
                                                        <br />
                                                        <span style={{ fontSize: "12px" }} >({`$ ${compareProp?.report?.GrossRent ? numberWithCommas(parseFloat(parseFloat(compareProp?.report?.GrossRent) / 12).toFixed(2)) : "-"}`}/mo)</span>
                                                    </p>
                                                    <p>{`$ ${compareProp?.calculatedData?.VacancyExpense ? numberWithCommas(parseFloat(compareProp?.calculatedData?.VacancyExpense).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{`$ ${compareProp?.calculatedData?.AnnualOtherIncome ? numberWithCommas(parseFloat(compareProp?.calculatedData?.AnnualOtherIncome).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.operatingIncome ? numberWithCommas(parseFloat(compareProp?.calculatedData?.operatingIncome).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{`$ ${compareProp?.calculatedData?.operatingExpenseCombined ? numberWithCommas(parseFloat(compareProp?.calculatedData?.operatingExpenseCombined).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.NOI ? numberWithCommas(parseFloat(compareProp?.calculatedData?.NOI).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >({`$ ${compareProp?.calculatedData?.GrossRentPerMonth ? numberWithCommas(parseFloat(compareProp?.calculatedData?.GrossRentPerMonth).toFixed(2)) : "-"}`}/mo)</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.LeveredCashFlow ? numberWithCommas(parseFloat(compareProp?.calculatedData?.LeveredCashFlow).toFixed(2)) : "-"}`}</p>

                                                    <h3>INVESTMENT RETURNS (Year 1, After Refinance):</h3>
                                                    <p>{`${compareProp?.calculatedData?.capRate ? parseFloat(compareProp?.calculatedData?.capRate).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.capRateMarket ? parseFloat(compareProp?.calculatedData?.capRateMarket).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.COC ? parseFloat(compareProp?.calculatedData?.COC).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.ROE ? parseFloat(compareProp?.calculatedData?.ROE).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.ROI ? parseFloat(compareProp?.calculatedData?.ROI).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.LeveredIRRArray[0] ? parseFloat(compareProp?.calculatedData?.LeveredIRRArray[0]).toFixed(2) : "-"}%`}</p>

                                                    <h3>FINANCIAL RATIOS (At Purchase)</h3>
                                                    <p>{`${compareProp?.calculatedData?.rentToValue ? parseFloat(compareProp?.calculatedData?.rentToValue).toFixed(2) : "-"}`}%</p>
                                                    <p>{`${compareProp?.calculatedData?.GRM ? parseFloat(compareProp?.calculatedData?.GRM).toFixed(2) : "-"}`}</p>
                                                    <p>{`${compareProp?.calculatedData?.equityMultiple ? parseFloat(compareProp?.calculatedData?.equityMultiple).toFixed(2) : "-"}`}</p>
                                                    <p>{`${compareProp?.calculatedData?.breakEvenRatio ? parseFloat(compareProp?.calculatedData?.breakEvenRatio).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.debtCoverageRatio ? parseFloat(compareProp?.calculatedData?.debtCoverageRatio).toFixed(2) : "-"}`}</p>
                                                    <p>{`${compareProp?.calculatedData?.debtYield ? parseFloat(compareProp?.calculatedData?.debtYield).toFixed(2) : "-"}%`}</p>
                                                </>
                                            )}
                                            {reportType === "Flip" && (
                                                <>
                                                    <h3>SALE & PROFIT</h3>
                                                    <p>{`$ ${compareProp?.report?.ARV ? numberWithCommas(parseFloat(compareProp?.report?.ARV).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{`$ ${compareProp?.report?.sellingCostTotal ? numberWithCommas(parseFloat(compareProp?.report?.sellingCostTotal).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.saleProceeds ? numberWithCommas(parseFloat(compareProp?.calculatedData?.saleProceeds).toFixed(2)) : "-"}`}</p>
                                                    <p>{`$ ${compareProp?.calculatedData?.loanRepayment ? numberWithCommas(parseFloat(compareProp?.calculatedData?.loanRepayment).toFixed(2)) : "-"}`}</p>
                                                    <p>{`$ ${compareProp?.calculatedData?.holdingCosts ? numberWithCommas(parseFloat(compareProp?.calculatedData?.holdingCosts).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }} >{`$ ${compareProp?.calculatedData?.totalCashNeeded ? numberWithCommas(parseFloat(compareProp?.calculatedData?.totalCashNeeded).toFixed(2)) : "-"}`}</p>
                                                    <p style={{ color: theme.palette.primary.main }} >{`$ ${compareProp?.calculatedData?.profitFlip ? numberWithCommas(parseFloat(compareProp?.calculatedData?.profitFlip).toFixed(2)) : "-"}`}</p>

                                                    <h3>INVESTMENT RETURNS</h3>
                                                    <p>{`${compareProp?.calculatedData?.ROI ? parseFloat(compareProp?.calculatedData?.ROI).toFixed(2) : "-"}%`}</p>
                                                    <p>{`${compareProp?.calculatedData?.annualizedROI ? parseFloat(compareProp?.calculatedData?.annualizedROI).toFixed(2) : "-"}%`}</p>
                                                </>
                                            )}
                                            <h3>PURCHASE CRITERIA</h3>
                                            {criteriaLabelArr.map((criteriaLabel) => (
                                                <>
                                                    {selectedCriteria?.[reportType]?.[criteriaLabel?.boolLabel] && (<>
                                                        {criteriaLabel?.type ? (<>
                                                            {reportType === criteriaLabel?.type && (<>
                                                                {checkCriteriaFun(criteriaLabel, compareProp) ? (
                                                                    <p style={{ color: "green" }} >Pass</p>
                                                                ) : (
                                                                    <p style={{ color: "red" }} >Fail</p>
                                                                )}
                                                            </>)}
                                                        </>) : (<>
                                                            {criteriaLabel?.typeNot ? (<>
                                                                {reportType !== criteriaLabel?.typeNot && (<>
                                                                    {checkCriteriaFun(criteriaLabel, compareProp) ? (
                                                                        <p style={{ color: "green" }} >Pass</p>
                                                                    ) : (
                                                                        <p style={{ color: "red" }} >Fail</p>
                                                                    )}
                                                                </>)}
                                                            </>) : (<>
                                                                {checkCriteriaFun(criteriaLabel, compareProp) ? (
                                                                    <p style={{ color: "green" }} >Pass</p>
                                                                ) : (
                                                                    <p style={{ color: "red" }} >Fail</p>
                                                                )}
                                                            </>)}
                                                        </>)}
                                                    </>)}
                                                </>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Dialog
                        open={criteriaDialog}
                        onClose={closeCriteriaDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle style={{ padding: "0px" }} >
                            <div className={classes.titleStyle} >
                                <p
                                    style={{
                                        color: "white",
                                        fontSize: "17px"
                                    }}
                                >
                                    Change Criteria
                                </p>
                                <ClearIcon
                                    style={{ color: "white", cursor: "pointer" }}
                                    onClick={closeCriteriaDialog}
                                />
                            </div>
                        </DialogTitle>
                        <DialogContent className={classes.dividers} >
                            <div style={{ marginLeft: "-18px", marginBottom: "100px" }} >
                                <MyAutocomplete
                                    isSmall={false}
                                    value={selectedCriteria}
                                    text={criteriaText}
                                    setText={setCriteriaText}
                                    placeholder={"Select Criteria"}
                                    results={allCriteriaPolicies}
                                    getOptionLabel={(option) => { return option?.title }}
                                    onSelect={onSelectCriteria}
                                    label={"Select Criteria"}
                                    setWidth={"300px"}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                {(compView === "ownerEditView" || compView === "ownerView") && !showCompareData && (<>
                    {numOfSelected > 1 ? (
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginTop: "50px" }}
                            onClick={() => { setShowCompareData(true) }}
                        >Compare Projects</Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginTop: "50px" }}
                            disabled
                        >Compare Projects</Button>
                    )}
                </>)}
            </>
            break;

        case "listView":
            BodyView = <SavedCompareReports />
            break
    }

    return (
        <>
            <div className={classes.root} >
                {HeaderView}
                <div className={classes.mainCont} >
                    {BodyView}
                </div>
            </div>
            {loadingBool &&
                <div className={classes.loaderCont} >
                    <CircularProgress
                        size={60}
                        thickness={3}
                        style={{ color: 'rgb(92, 144, 242)' }}
                    />
                </div>
            }
        </>
    );
}
