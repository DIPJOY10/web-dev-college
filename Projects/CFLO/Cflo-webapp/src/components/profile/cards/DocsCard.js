import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import DocSvg from "../../../Assets/document.svg";

const useStyles = makeStyles((theme) => ({
    cardCont: {
        width: "320px",
        backgroundColor: "white",
        margin: "10px",
        display: "flex",
        opacity: "0.5",
        padding: "45px 20px",
        borderRadius: "15px",
        alignItems: "center",
        flexDirection: "column",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        "& img": {
            width: "100px",
            height: "auto",
            marginBottom: "15px",
        },
        "& h2": {
            fontSize: "24px",
            fontWeight: "510",
            color: "#193B56",
        },
        "& p": {
            padding: "3px 9px",
            fontSize: "12px",
            backgroundColor: theme.palette.primary.main,
            color: "white",
            borderRadius: "5px",
            marginBottom: "5px"
        },
        "& h4": {
            fontSize: "12px",
            color: "#696969",
            fontWeight: "400",
            textAlign: "center",
            marginBottom: "4px"
        },
    }
}));

export default function DocsCard(props) {
    const classes = useStyles();

    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div className={classes.cardCont} >
            <img src={DocSvg} />
            <h2>Documents</h2>
            <p>In Progress</p>
            <h4>Create notes, report and upload documents. Organize them
                into folders and share accross teams.</h4>
        </div>
    );
}
