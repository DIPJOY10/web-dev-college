import React, { useState } from "react";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    expandIcon: {
        cursor: "pointer",
        color: "#1684EA",
        "&:hover": {
            color: "#1684ea",
        },
        marginLeft: "auto",
    },
    ExpandedContainer: {
        display: "flex",
        flexDirection: "column",
    },
    list_container: {
        width: "calc(100% - 16px)",
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "25px",
        marginBottom: "5px"
    },
    expandedCont: {
        height: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: "25px",
        marginTop: "-6px"
    },
    textStyle: {
        color: "#1684EA",
        [theme.breakpoints.down('md')]: {
            fontSize: "13px"
        }
    }
}));

function DropDownWithLabel({ list }) {
    const classes = useStyles();
    const { expandIcon, ExpandedContainer, list_container, root } = classes;
    const [expanded, setExpanded] = useState(false);

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }


    return (
        <div className={root}>
            {expanded === false ? (
                <div className={classes.expandedCont} >
                    <p className={classes.textStyle} >Monthly Breakdown</p>
                    <ExpandMoreIcon
                        className={expandIcon}
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    />
                </div>
            ) : (
                <div className={ExpandedContainer}>
                    <div className={classes.expandedCont} >
                        <p className={classes.textStyle} >Monthly Breakdown</p>
                        <KeyboardArrowUpIcon
                            className={expandIcon}
                            onClick={() => {
                                setExpanded(!expanded);
                            }}
                        />
                    </div>
                    {list.map((entry, index) => (
                        <div className={list_container}>
                            <p>{entry.name}</p>
                            <p>$ {numberWithCommas(parseFloat(entry.value).toFixed(1))}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropDownWithLabel;
