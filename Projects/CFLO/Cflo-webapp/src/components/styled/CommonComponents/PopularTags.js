import React, { useState, useEffect, useRef, useCallback } from "react";
import { CircularProgress, makeStyles, Paper, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
}));

function PopularTags() {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const { } = useSelector((state) => state);

    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "7px",
                width: "100%",
                padding: "20px",
                fontSize: "20px",
                marginTop: "15px",
                cursor: "pointer",
                border: "1.5px solid rgba(0, 0, 0, 0.12)",
            }}
            onClick={() => { history.push("/explore/doc/resources") }}
        >
            Get Resources
        </div>
    );

}
export default PopularTags;