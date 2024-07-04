import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory, Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "center",
    },
    mainImgCont: {
        position: "relative",
        width: "100%",
        height: "calc(100% - 100px)",
        "& img": {
            float: "left",
            width: "100%",
            height: "100%",
            objectFit: "scale-down"
        }
    },
    imgConts: {
        display: "flex",
        overflowX: "auto",
        marginTop: "15px",
        width: "100%",
        paddingLeft: "15px",
        "& div": {
            flexShrink: "0",
            width: "80px",
            height: "50px",
            overflow: "hidden",
            marginRight: "15px",
            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            cursor: "pointer",
            "& img": {
                float: "left",
                width: "100%",
                height: "100%",
                objectFit: "scale-down"
            }
        },
        "&::-webkit-scrollbar": {
            display: "none"
        },
        scrollbarWidth: "none",
    },
    controlersCont: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "rgba(255, 255, 255, 0)"
    },
    navGo: {
        width: "25%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0)",
        cursor: "pointer",
    },
    showFullPic: {
        width: "50%",
        height: "100%",
        cursor: "pointer",
        backgroundColor: "rgba(255, 255, 255, 0)"
    },
    deleteCon: {
        width: "100%",
        height: "30px",
        display: "flex",
        justifyContent: "space-between",
        paddingRight: "20px",
        backgroundColor: "rgba(255, 255, 255, 0)"
    },
    nextCon: {
        width: "100%",
        height: "calc(100% - 30px)",
        backgroundColor: "rgba(255, 255, 255, 0)"
    }
}));

export default function ImageVideoViewer(props) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    const {
        data, picVideoViewerHeight, picVideoViewerWidth,
        picVideoViewerHeightSmall, isDeletable, removeFun
    } = props

    const videoThum = "https://placekitten.com/450/300";

    const [current, setCurrent] = useState(0);
    const [clickedImg, setClickedImg] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleClose = () => {
        setClickedImg(null)
        setDialogOpen(false)
    }

    const next = () => {
        if (data.length > 1) {
            if (current === data.length - 1) {
                setCurrent(0)
            } else {
                setCurrent(current + 1)
            }
        }
    }

    const previous = () => {
        if (data.length > 1) {
            if (current === 0) {
                setCurrent(data.length - 1)
            } else {
                setCurrent(current - 1)
            }
        }
    }

    return (
        <div className={classes.root}
            style={data && data.length > 1 ?
                { width: picVideoViewerWidth, height: picVideoViewerHeight }
                :
                { width: picVideoViewerWidth, height: picVideoViewerHeightSmall }
            }
        >
            <div className={classes.mainImgCont}
                style={data && data.length > 1 ? {} : { height: "100%" }}
            >
                <div className={classes.controlersCont} >
                    <div className={classes.navGo} onClick={previous} ></div>
                    <div className={classes.showFullPic}
                        onClick={() => {
                            if (data[current]?.type === "photo") {
                                setClickedImg(data[current]?.url)
                                setDialogOpen(true)
                            }
                        }}
                    ></div>
                    <div className={classes.navGo}>
                        <div className={classes.deleteCon} >
                            <div></div>
                            {isDeletable && (
                                <CancelIcon
                                    style={{ color: "gray", fontSize: "30px" }}
                                    onClick={() => { removeFun(data[current]?._id) }}
                                />
                            )}
                        </div>
                        <div className={classes.nextCon} onClick={next} ></div>
                    </div>
                </div>

                {data[current]?.type === "photo" && data[current]?.url ? (
                    <img src={data[current]?.url} alt="main" />
                ) : (
                    <video width="100%" height="100%" controls>
                        <source src={data[current]?.url} type="video/mp4" />
                    </video>
                )}
            </div>
            {data && data.length > 1 && (
                <div className={classes.imgConts}>
                    {data.map((iv, i) => (
                        <div
                            onClick={() => {
                                setCurrent(i);
                            }}
                            style={current === i ? { border: `3px solid ${theme.palette.primary.main}` } : {}}
                        >
                            {iv?.type === "photo" ? (
                                <img src={iv?.url} alt="nav" />
                            ) : (
                                <img src={videoThum} alt="nav" />
                            )}
                        </div>
                    ))}
                </div>
            )}
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        borderRadius: "5px",
                        maxWidth: "1200px"
                    }
                }}
            >
                <DialogContent style={{ padding: "0" }} >
                    {clickedImg && (
                        <img style={{
                            maxHeight: "90vh",
                            maxWidth: "1200px"
                        }} src={clickedImg} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
