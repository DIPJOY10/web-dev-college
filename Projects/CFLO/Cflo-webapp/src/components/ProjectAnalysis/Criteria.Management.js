import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Grow, Typography, useMediaQuery } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createPolicy, getAllAdminProfileCriteria } from "./api.call";
import CriteriaLine from "./CriteriaLines";
import CriteriaEdit from "./CriteriaEdit";
import ProfileSelect from "../styled/profile.select";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import TextField from '@material-ui/core/TextField';
import AnalysisHeader from "../styled/CommonComponents/AnalysisHead";
import CustomBtn from "../styled/CommonComponents/CustomBtn"
import LessText from "../styled/CommonComponents/LessText";
import NormalDialog from "../styled/CommonComponents/NormalDialog"



const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: "white",
        padding: "0px 10px",
        [theme.breakpoints.down('sm')]: {
            padding: "0px 5px",
        }
    },
    headerC: {
        display: "flex",
        alignItems: 'center',
        justifyContent: "space-between",
        padding: "5px 10px",
        marginBottom: "20px",
        "& p": {
            fontSize: "17px",
            fontWeight: "500",
            textTransform: "capitalize"
        },
        [theme.breakpoints.down('sm')]: {
            "& p": {
                fontSize: "15px",
            },
        }
    },
    mainCont: {
        marginBottom: "20px",
        padding: "10px 20px 25px",
        backgroundColor: "#F9F9F9",
        borderRadius: "10px",
        [theme.breakpoints.down('md')]: {
            padding: "10px 5px 25px",
        }
    },
    bodyCont: {
        padding: "10px 30px",
        [theme.breakpoints.down('sm')]: {
            padding: "10px 0px",
        }
    },
    criteriaTypeCont: {
        display: "flex",
        marginBottom: "25px",
        [theme.breakpoints.down('md')]: {
            flexDirection: "column"
        }
    },
    typeCont: {
        width: "180px",
        fontSize: "17px",
        fontWeight: "510",
        color: "#00345D",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        [theme.breakpoints.down('md')]: {
            fontSize: "15px",
            width: "100%",
            padding: "10px 5px",
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
        width: "350px",
        [theme.breakpoints.down("xs")]: {
            padding: "10px",
        }
    },
    createDialogCont: {
        width: "350px",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
    }
}));

export default function CriteriaManagement(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { adminProfiles } = useGetAdminProfiles();

    const [allCriteriaPolicies, setAllCriteriaPolicies] = useState([]);
    const [loadingBool, setLoadingBool] = useState(false);
    const [projectData, setProjectData] = useState({});
    const [currentReport, setCurrentReport] = useState({})
    const [view, setView] = useState("lists")
    const [arrayPath, setArrayPath] = useState([])
    const [owner, setOwner] = useState(user);
    const [name, setName] = useState("")
    const [createDialog, setCreateDialog] = useState(false)


    const handleCloseCreate = () => {
        setCreateDialog(false)
    }

    useEffect(() => {
        setOwner(adminProfiles[0])
    }, [adminProfiles])

    useEffect(() => {
        setLoadingBool(true)
        getAllAdminProfileCriteria({ profileId: user.profile })
            .then((data) => {
                console.log(data)
                setAllCriteriaPolicies(data)
                setLoadingBool(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const showEditView = (purchasePolicy, criteriaType) => {
        const newProject = {
            purchasePolicy: purchasePolicy
        }
        const newReport = {
            reportType: criteriaType
        }
        setProjectData(newProject)
        setCurrentReport(newReport)
        setView("edit")
    }

    const createPolicyApi = async () => {
        handleCloseCreate()
        setLoadingBool(true)
        await createPolicy({
            policyName: name,
            profileId: owner?.profile
        })
            .then((data) => {
                console.log(data)
                let updatedPolicyArr = [data, ...allCriteriaPolicies]
                setAllCriteriaPolicies(updatedPolicyArr)
            })
            .catch((err) => {
                console.log(err)
            })
        setLoadingBool(false)
    }


    let Component = null

    switch (view) {
        case "lists":
            Component = <>
                {allCriteriaPolicies && allCriteriaPolicies.map((criteriaPolicy) => (
                    <div className={classes.mainCont} >
                        <div className={classes.headerC} >
                            <p>
                                <LessText
                                    limit={30}
                                    string={criteriaPolicy?.title}
                                />
                                <p style={{ fontSize: "12px" }} >By {criteriaPolicy?.profile?.parent?.displayName}</p></p>
                            <div></div>
                        </div>
                        <div className={classes.criteriaTypeCont} >
                            <div className={classes.typeCont} >
                                <div onClick={() => { showEditView(criteriaPolicy, "Rental") }} style={{ cursor: "pointer" }} >Rental{` Criteria `}<EditIcon style={{ position: "relative", top: "5px", fontSize: "20px" }} /></div>
                            </div>
                            <CriteriaLine
                                criteriaPolicy={criteriaPolicy}
                                criteriaType={"Rental"}
                                setAllCriteriaPolicies={setAllCriteriaPolicies}
                                allCriteriaPolicies={allCriteriaPolicies}
                                setLoadingBool={setLoadingBool}
                            />
                        </div>
                        <div className={classes.criteriaTypeCont} >
                            <div className={classes.typeCont} >
                                <div onClick={() => { showEditView(criteriaPolicy, "BRRRR") }} style={{ cursor: "pointer" }} >BRRRR{` Criteria `}<EditIcon style={{ position: "relative", top: "6px" }} /></div>
                            </div>
                            <CriteriaLine
                                criteriaPolicy={criteriaPolicy}
                                criteriaType={"BRRRR"}
                                setAllCriteriaPolicies={setAllCriteriaPolicies}
                                allCriteriaPolicies={allCriteriaPolicies}
                                setLoadingBool={setLoadingBool}
                            />
                        </div>
                        <div className={classes.criteriaTypeCont} >
                            <div className={classes.typeCont} >
                                <div onClick={() => { showEditView(criteriaPolicy, "Flip") }} style={{ cursor: "pointer" }} >Flip{` Criteria `}<EditIcon style={{ position: "relative", top: "6px" }} /></div>
                            </div>
                            <CriteriaLine
                                criteriaPolicy={criteriaPolicy}
                                criteriaType={"Flip"}
                                setAllCriteriaPolicies={setAllCriteriaPolicies}
                                allCriteriaPolicies={allCriteriaPolicies}
                                setLoadingBool={setLoadingBool}
                            />
                        </div>
                    </div>
                ))}
            </>
            break;
        case "edit":
            Component = <CriteriaEdit
                projectData={projectData}
                setProjectData={setProjectData}
                currentReport={currentReport}
                isForManagement={true}
                allCriteriaPolicies={allCriteriaPolicies}
                setAllCriteriaPolicies={setAllCriteriaPolicies}
            />
            break;
    }


    useEffect(() => {
        let pathArr = []

        if (view === "edit") {
            pathArr = [
                {
                    text: "Dashboard",
                    onClick: () => { }
                },
                {
                    text: "Criteria Management",
                    onClick: () => { setView("lists") }
                },
                {
                    text: "Edit Criteria",
                    onClick: () => { }
                }
            ]
        } else {
            pathArr = [
                {
                    text: "Dashboard",
                    onClick: () => { history.goBack() }
                },
                {
                    text: "Criteria Management",
                    onClick: () => { }
                },
            ]
        }

        setArrayPath(pathArr)
    }, [view])




    return (
        <>
            <div className={classes.root} >
                <AnalysisHeader
                    pageTitle={view === "edit" ? "Edit Criteria" : "Criteria Management"}
                    pathArr={arrayPath}
                    isImgProps={false}
                    pageDesc={view === "edit" ? "Use this page to select & edit the purchase criteria associated with different metrics." : "Create and customize investment criteria for rentals, BRRRRs, and flips on this page."}
                    rightBtns={<>
                        {view === "edit" ? null : (
                            <CustomBtn
                                startPart={<AddIcon />}
                                text={"Create"}
                                onClick={() => { setCreateDialog(true) }}
                            />
                        )}
                    </>}
                />
                <div className={classes.bodyCont} >
                    {Component}
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
            <NormalDialog
                openDialog={createDialog}
                handleCloseShare={handleCloseCreate}
                pageTitle={"Create New Policy"}
                content={<div className={classes.createDialogCont} >
                    <ProfileSelect
                        owner={owner}
                        adminProfiles={adminProfiles}
                        displayOwner={true}
                        title={"Owner"}
                        onChange={(value) => {
                            setOwner(value);
                        }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Enter Policy Name"
                        variant="outlined"
                        value={name}
                        size="small"
                        style={{ width: "100%" }}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }} >
                        <div></div>
                        {name && name.length > 2 ? (
                            <Button
                                onClick={createPolicyApi}
                                color="primary"
                                variant="outlined"
                            >
                                Create
                            </Button>
                        ) : (
                            <Button
                                color="primary"
                                variant="outlined"
                                disabled
                            >
                                Create
                            </Button>
                        )}
                    </div>
                </div>}
            />
        </>
    );
}
