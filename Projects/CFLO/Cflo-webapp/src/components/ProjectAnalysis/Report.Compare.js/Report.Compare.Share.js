import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ClearIcon from '@material-ui/icons/Clear';
import configObject from "../../../config/index.js";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CopyToClipboard from "react-copy-to-clipboard"
import SocialShareBtn from "../../styled/CommonComponents/Social.Share.Btn.js";


const useStyles = makeStyles((theme) => ({
    titleStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 15px",
        backgroundColor: theme.palette.primary.main
    },
    dividers: {
        padding: "16px 24px",
        [theme.breakpoints.down("xs")]: {
            padding: "10px",
        }
    },
    rowCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column"
        }
    },
    leftSide: {
        width: "35%",
        fontSize: "15px",
        fontWeight: "510",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginBottom: "20px"
        },
    },
    rightSide: {
        width: "65%",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        }
    },
    linkCont: {
        width: "100%",
        display: "flex",
        overflowX: "hidden",
        margin: "15px 0px",
        [theme.breakpoints.down("xs")]: {
            marginTop: "5px"
        }
    },
    link: {
        width: "calc(100% - 80px)",
        padding: "6px",
        backgroundColor: "#efeded",
        overflowX: "hidden",
        fontSize: "13px"
    },
    socialMediaCont: {
        display: "flex",
        alignItems: "center",
    },
    text: {
        fontSize: "15px",
        fontWeight: "500",
    },
    onClick: {
        padding: "0px 6px",
        borderLeft: "1px solid white",
        cursor: "pointer",
        backgroundColor: theme.palette.primary.main,
        color: "white"
    },
    copy: {
        padding: "6px",
        borderLeft: "1px solid white",
        cursor: "pointer",
        backgroundColor: theme.palette.primary.main,
        color: "white"
    }
}));

export default function CompareReportShareDialog(props) {
    const {
        openShareDialog, setOpenShareDialog,
        compareId
    } = props
    const classes = useStyles();
    const [openShare, setOpenShare] = useState(false)
    const [shareLink, setShareLink] = useState("")
    const [copyLabel, setCopyLabel] = useState("Copy")

    const handleCloseShare = () => {
        setOpenShareDialog(false)
        setOpenShare(false)
    }

    useEffect(() => {
        setOpenShare(openShareDialog)
    }, [openShareDialog])

    useEffect(() => {
        let url = `${configObject?.BASE_URL}investment/analysis/compare/${compareId}/public/share`
        setShareLink(url)
    }, [compareId])

    return (
        <Dialog
            open={openShare}
            onClose={handleCloseShare}
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
                        Share
                    </p>
                    <ClearIcon
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={handleCloseShare}
                    />
                </div>
            </DialogTitle>
            <DialogContent className={classes.dividers} >
                <div className={classes.rowCont} >
                    <div className={classes.leftSide} >Interactive Compare</div>
                    <div className={classes.rightSide} >
                        <p className={classes.text} >Sharable Link</p>
                        <div className={classes.linkCont} >
                            <div className={classes.link} >{shareLink}</div>
                            <div className={classes.onClick}
                                onClick={() => { window.open(shareLink, '_blank').focus(); }}
                            >
                                <OpenInNewIcon
                                    style={{ marginTop: "6px", fontSize: "20px" }}
                                />
                            </div>
                            <CopyToClipboard text={shareLink} >
                                <div className={classes.copy} onClick={() => { setCopyLabel("Copied") }} >{copyLabel}</div>
                            </CopyToClipboard>
                        </div>
                        <div className={classes.socialMediaCont} >
                            <SocialShareBtn
                                shareLink={shareLink}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
