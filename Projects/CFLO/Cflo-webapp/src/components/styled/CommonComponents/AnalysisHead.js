import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import PagePath from "./Page.Path";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "10px 0px 15px",
        [theme.breakpoints.down("xs")]: {
            padding: "5px 0px 15px",
        }
    },
    headSubCont: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        "& h3": {
            fontSize: "28px",
            marginBottom: "0px",
            color: "#00345D",
            display: "flex",
            marginTop: "-3px",
            alignItems: "center"
        },
        [theme.breakpoints.down("sm")]: {
            alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
            marginBottom: "5px",
            "& h3": {
                fontSize: "16px",
                marginBottom: "3px",
            },
        }
    },
    backIcon: {
        padding: "0px 2px 0px 0px",
        fontSize: "32px",
        marginRight: "5px",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
        [theme.breakpoints.down("xs")]: {
            fontSize: "20px",
            borderRadius: "3px",
        }
    },
    subSubHeadCont: {
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            marginTop: "-5px",
            marginBottom: "5px"
        }
    },
    pageDesc: {
        marginTop: "10px",
        fontSize: "14px",
        color: "#626060",
        [theme.breakpoints.down("xs")]: {
            marginTop: "4px",
            fontSize: "9px",
        }
    },
    imagPropCont: {
        margin: "15px 0px 0px",
        display: "flex",
        alignItems: "center",
        "& h4": {
            fontSize: "20px",
            color: "#000929",
            marginBottom: "5px"
        },
        "& h5": {
            fontSize: "14px",
            color: "#808494",
            fontWeight: "450"
        },
        [theme.breakpoints.down("xs")]: {
            "& h4": {
                fontSize: "16px",
                color: "#000929",
                marginBottom: "5px"
            },
            "& h5": {
                fontSize: "11px",
                color: "#808494",
                fontWeight: "450"
            },
        }
    },
    imgCont: {
        height: "66px",
        width: "100px",
        borderRadius: "5px",
        marginRight: "15px",
        [theme.breakpoints.down("xs")]: {
            height: "50px",
            width: "70px",
            borderRadius: "5px",
            marginRight: "5px",
        }
    }
}));

export default function AnalysisHeader({ isImgProps, style, pageTitle, pathArr, rightBtns, imgSrc, propName, propDetails, pageDesc }) {
    const history = useHistory();
    const classes = useStyles();
    let len = pathArr.length;
    const backfun = pathArr[len - 2]?.onClick;

    return (
        <div className={classes.root} style={style ? style : {}} >
            <div className={classes.headSubCont} >
                <h3>
                    <ArrowBackIcon
                        className={classes.backIcon}
                        onClick={backfun}
                    />
                    {pageTitle}
                </h3>
                {rightBtns && (
                    <div className={classes.subSubHeadCont} >
                        {rightBtns}
                    </div>
                )}
            </div>
            {pathArr.length > 0 && (
                <PagePath
                    pathArr={pathArr}
                />
            )}
            {isImgProps && (
                <div className={classes.imagPropCont} >
                    <img className={classes.imgCont} src={imgSrc} />
                    <div>
                        <h4>{propName}</h4>
                        <h5>{propDetails}</h5>
                    </div>
                </div>
            )}
            <p className={classes.pageDesc} >{pageDesc}</p>
        </div>
    );
}