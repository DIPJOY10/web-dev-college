import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "10px 17px",
        backgroundColor: "#F7F7FD",
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        fontWeight: "500",
        color: "black",
        borderRadius: "5px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        "&:hover": {
            backgroundColor: "#e1e1e4",
        },
        [theme.breakpoints.down('xs')]: {
            padding: "7px 11px",
            borderRadius: "4px",
            fontSize: "14px"
        }
    },
    root2: {
        padding: "10px 17px",
        backgroundColor: "#e1e1e4",
        display: "flex",
        opacity: "0.5",
        alignItems: "center",
        fontWeight: "500",
        color: "black",
        borderRadius: "5px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        [theme.breakpoints.down('xs')]: {
            padding: "7px 11px",
            borderRadius: "4px",
            fontSize: "14px"
        }
    },
}));

export default function CustomBtn({ startPart, endPart, disabled, text, onClick, style }) {
    const classes = useStyles();
    const theme = useTheme()

    return (
        <>
            {disabled ? (
                <div
                    className={classes.root2}
                    style={style}
                >
                    {startPart && (<span style={{ marginRight: "8px", display: "flex" }} >{startPart}</span>)}
                    <span style={{ textDecoration: "none" }} >{text}</span>
                    {endPart && (<span style={{ marginLeft: "8px", display: "flex" }} >{endPart}</span>)}
                </div>
            ) : (
                <div
                    className={classes.root}
                    onClick={onClick}
                    style={style}
                >
                    {startPart && (<span style={{ marginRight: "8px", display: "flex" }} >{startPart}</span>)}
                    <span style={{ textDecoration: "none" }} >{text}</span>
                    {endPart && (<span style={{ marginLeft: "8px", display: "flex" }} >{endPart}</span>)}
                </div>
            )}
        </>
    );
}
