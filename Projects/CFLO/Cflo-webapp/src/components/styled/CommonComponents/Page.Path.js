import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
    pathCont: {
        width: "100%",
        display: 'flex',
        alignItems: 'center',
        margin: "0px",
        fontWeight: "500",
        color: "#808494",
        "& p": {
            marginTop: "0px",
            marginBottom: "0px",
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: "10px"
        }
    },
    singlePath: {
        margin: "0px 5px",
        cursor: "pointer",
        "&:hover": {
            color: theme.palette.primary.main
        },
        [theme.breakpoints.down('xs')]: {
            margin: "0px 2px",
        }
    },
    currentOne: {
        color: theme.palette.primary.main,
        margin: "0px 5px",
        [theme.breakpoints.down('xs')]: {
            margin: "0px",
        }
    }
}));

export default function PagePath({ pathArr }) {
    const history = useHistory();
    const classes = useStyles();
    const len = pathArr.length;

    return (
        <div className={classes.pathCont} >
            {pathArr && pathArr.map((path, i) => (<>
                {i == 0 ? (<>
                    <p className={classes.singlePath} style={{ marginLeft: "0px" }} onClick={path.onClick}>{path?.text}</p>
                    {i !== (len - 1) && "/"}
                </>) : (<>
                    {i !== (len - 1) ? (<>
                        <p className={classes.singlePath} onClick={path.onClick}>{path?.text}</p>
                        {i !== (len - 1) && "/"}
                    </>) : (<>
                        <p className={classes.currentOne} >{path?.text}</p>
                    </>)}
                </>)}
            </>))}
        </div>
    );
}