import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";


const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        minWidth: '15rem',
        alignItems: "center"
    },
    row: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
    },
    row1: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
    },
    titleText: {
        fontSize: "0.9rem",
        fontWeight: "600",
        textAlign: "left",
        lineHeight: 0.7
    },
    nameText: {
        fontSize: (props) => {
            if (props.size == "xs") {
                return "0.8rem";
            } else {
                return "1.0rem";
            }
        },
        fontWeight: "500",
        textAlign: "left"
    },

    avatarBox: {
        padding: "0.7rem 0.5rem 0.7rem 0.7rem",
        [theme.breakpoints.down("sm")]: {
            padding: "0.3rem",
            marginRight: "0.4rem",
        },
    },
    dP: (props) => {
        if (props.size == "xs") {
            return {
                height: "1.1rem",
                width: "1.1rem",
            };
        } else {
            return {
                height: "1.5rem",
                width: "1.5rem",
            };
        }
    },
    textBox: {
        // flex: 1,
        // flexDirection: "column",
    },
}));

export default function ListPaperCard(props) {
    const { data, onSelect, size, counter, profileId } = props;
    const dataId = data?._id;
    const history = useHistory();
    const classes = useStyles({ size });
    const user = data?.user;
    const displayName = user?.displayName;
    const displayPicture = user?.displayPicture;

    return (
        <Paper

            className={classes.root}
            variant="outlined"
            square
        >
            <div className={classes.avatarBox}>
                <Avatar
                    alt={displayName}
                    src={displayPicture?.thumbUrl}
                    className={classes.dP}
                />
            </div>

            <div className={classes.textBox}>
                <Typography className={classes.nameText}>
                    {displayName}
                </Typography>
                <Typography className={classes.titleText}>
                    {data?.title?.slice(0, 40)}
                </Typography>

            </div>
        </Paper>
    );
}
