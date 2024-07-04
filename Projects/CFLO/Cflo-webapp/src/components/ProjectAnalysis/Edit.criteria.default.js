import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import CriteriaEdit from "./CriteriaEdit";
import AnalysisHeader from "../styled/CommonComponents/AnalysisHead";
import configObject from "../../config/index"

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
        width: "100%",
        backgroundColor: "white",
        padding: `0px ${theme.sideMargin.fullScreen}`,
        [theme.breakpoints.down('md')]: {
            padding: `0px ${theme.sideMargin.mdScreen}`,
        },
        [theme.breakpoints.down('sm')]: {
            padding: `0px ${theme.sideMargin.smScreen}`,
        },
        [theme.breakpoints.down('xs')]: {
            padding: "0px 5px",
            padding: `0px ${theme.sideMargin.sxScreen}`,
        },
    },
}));

export default function EditCriteriaDefault({
    criteriaType, setView, projectData, setProjectData,
}) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const { teamId } = useParams();

    const [currentReport, setCurrentReport] = useState({ reportType: criteriaType });
    const [tLink, setTLink] = useState("")

    useEffect(() => {
        if (criteriaType === "Rental") {
            setTLink(configObject?.tutorialLinks?.rentalLink)
        } else if (criteriaType === "BRRRR") {
            setTLink(configObject?.tutorialLinks?.brrrrLink)
        } else if (criteriaType === "Flip") {
            setTLink(configObject?.tutorialLinks?.flipLink)
        }
    }, [criteriaType])



    let pathArr = [
        {
            text: "Project",
            onClick: () => {
                history.push(`/projects/${teamId}`)
            }
        },
        {
            text: "Analysis",
            onClick: () => {
                setView("default");
            }
        },
        {
            text: `${criteriaType} Criteria`,
        }
    ]






    return (
        <div className={classes.mainCont} >
            <AnalysisHeader
                pageTitle={`${criteriaType} Criteria`}
                pathArr={pathArr}
                imgSrc={projectData?.displayPicture?.url}
                propName={projectData?.displayName}
                isImgProps={false}
                propDetails={<>{projectData?.subCategory || "Nan"} \ {projectData?.bathNumbers || "Nan"}{projectData?.bathroomsFull || projectData?.bathroomsHalf ? `(${projectData?.bathroomsFull ? `${projectData?.bathroomsFull}F` : ""}${projectData?.bathroomsHalf ? `/${projectData?.bathroomsHalf}H` : ""})` : null} BA \ {projectData?.roomNumbers || "Nan"} BR \ {`${projectData?.area || "Nan"} sqft`}</>}
                pageDesc={<>Use this page to select the purchase criteria associated with different metrics. <a style={{ textDecoration: 'none', color: "#2196F3" }} href={tLink} target="_blank" >View tutorial</a>
                </>}
                rightBtns={<></>}
            />
            <CriteriaEdit
                projectData={projectData}
                setProjectData={setProjectData}
                currentReport={currentReport}
                isForManagement={false}
            />
        </div>
    );
}