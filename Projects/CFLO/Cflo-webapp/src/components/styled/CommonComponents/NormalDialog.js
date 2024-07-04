import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
    dividers: {
        padding: "16px 24px",
        [theme.breakpoints.down("sm")]: {
            padding: "10px",
            paddingBottom: "20px",
        }
    },
    dialogHead: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "& h4": {
            fontSize: "20px"
        },
        [theme.breakpoints.down('sm')]: {
            "& h4": {
                fontSize: "15px"
            },
        }
    }
}));

export default function NormalDialog(props) {
    const { openDialog, handleCloseShare, pageTitle, content, style } = props
    const classes = useStyles();
    const theme = useTheme()

    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));


    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseShare}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: { borderRadius: isSmall ? "5px" : "12px" }
            }}
        >
            <DialogContent className={classes.dividers} style={isSmall ? { padding: "2px 7px 10px" } : { padding: "5px 15px 20px" }} >
                <div className={classes.dialogHead} >
                    <h4>{pageTitle}</h4>
                    <IconButton onClick={handleCloseShare} >
                        <ClearIcon />
                    </IconButton>
                </div>
                {content}
            </DialogContent>
        </Dialog>
    );
}
