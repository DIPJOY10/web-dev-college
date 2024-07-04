import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import configObject from "../../config/index.js";
import CopyToClipboard from "react-copy-to-clipboard"
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import SocialShareBtn from "../styled/CommonComponents/Social.Share.Btn.js";
import NormalDialog from "../styled/CommonComponents/NormalDialog.js";
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';

const useStyles = makeStyles((theme) => ({
    socialMediaCont: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    labelCopyCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "15px 0px 10px",
        "& h3": {
            fontSize: "19px"
        },
        [theme.breakpoints.down('sm')]: {
            "& h3": {
                fontSize: "14px"
            },
        }
    },
    linkCont: {
        width: "100%",
        overflowX: "hidden",
        border: "1px solid #9B9B9B",
        fontSize: "16px",
        borderRadius: "9px",
        display: "flex",
        alignItems: "center",
        padding: "9px",
        paddingRight: "2px",
        backgroundColor: "#FCFCFC",
        "& p": {
            width: "calc(100% - 30px)",
            overflowX: "hidden"
        },
        [theme.breakpoints.down('sm')]: {
            padding: "4px",
            borderRadius: "5px",
            "& p": {
                fontSize: "11px",
                width: "calc(100% - 17px)",
            },
        }
    },
    dividerCont: {
        display: "flex",
        margin: "20px 0px",
        justifyContent: "space-between",
        alignItems: "center",
        "& div": {
            width: "47%",
            backgroundColor: "#c3c1c1",
            height: "1px"
        }
    },
    copyCont: {
        display: "flex",
        alignItems: "center",
        "& p": {
            fontSize: "16px",
            fontWeight: "510",
            color: theme.palette.primary.main
        },
        [theme.breakpoints.down('sm')]: {
            "& p": {
                fontSize: "13px",
                fontWeight: "500",
                color: theme.palette.primary.main
            },
        }
    },
    copyIcon: {
        color: "#434343",
        marginRight: "4px",
        cursor: "pointer",
        fontSize: "18px",
        [theme.breakpoints.down('sm')]: {
            marginRight: "3px",
            fontSize: "14px",
        }
    },
    openIcon: {
        backgroundColor: "white",
        width: "35px",
        cursor: "pointer",
        [theme.breakpoints.down('sm')]: {
            width: "16px",
            fontSize: "16px",
        }
    }
}));

export default function ReportShareDialog(props) {
    const {
        report, projectData, openShareDialog, setOpenShareDialog,
    } = props
    const classes = useStyles();

    const [openShare, setOpenShare] = useState(false)
    const [shareLink, setShareLink] = useState("")

    const handleCloseShare = () => {
        setOpenShareDialog(false)
        setOpenShare(false)
    }

    useEffect(() => {
        setOpenShare(openShareDialog)
    }, [openShareDialog])

    useEffect(() => {
        let url = `${configObject?.BASE_URL}shared/report/analysis/${report?._id}/view`
        setShareLink(url)
    }, [projectData, report])

    return (<>
        <NormalDialog
            openDialog={openShare}
            handleCloseShare={handleCloseShare}
            pageTitle={"Share Analysis Report"}
            content={<>
                <div>
                    <div className={classes.labelCopyCont} >
                        <h3>Interactive Link</h3>
                        <div className={classes.copyCont} >
                            <CopyToClipboard text={shareLink} >
                                <FilterNoneIcon className={classes.copyIcon} style={{ color: "#434343", marginRight: "4px", fontSize: "18px" }} />
                            </CopyToClipboard>
                            <p>Copy Link</p>
                        </div>
                    </div>
                    <div className={classes.linkCont} >
                        <p>{shareLink}</p>
                        <OpenInNewOutlinedIcon
                            onClick={() => { window.open(shareLink, '_blank').focus(); }}
                            className={classes.openIcon}
                        />
                    </div>
                    <div className={classes.dividerCont} >
                        <div></div>
                        <p>or</p>
                        <div></div>
                    </div>
                    <div className={classes.socialMediaCont} >
                        <SocialShareBtn
                            shareLink={shareLink}
                        />
                    </div>
                </div>
            </>}
        />
    </>);
}
