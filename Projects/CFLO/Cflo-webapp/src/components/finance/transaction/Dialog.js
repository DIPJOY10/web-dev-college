import React, { useState, useEffect } from "react";
import cx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


function costomDialog(props) {
    const {
        open,
        handleClose, 
        setOnlyDays, 
        setOnlyDayMonth, 
        onlyDayMonth, 
        onlyDays, 
        styleInputRadio, 
        styleDialogText,
        termName,
        setTermName,
        termDays,
        setTermDays,
        termDMDay, 
        setTermDMDay,
        termDMMonth,
        setTermDMMonth,
        saveNewTerm
    } = props;

    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New Term</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        value={termName}
                        onChange={(event)=>{setTermName(event.target.value)}}
                        type="text"
                        fullWidth
                    />
                    <Typography gutterBottom>
                        <input
                            className={cx(styleInputRadio)}  
                            type="radio"
                            name="termType"
                            value={onlyDays}
                            onClick={() => {
                                setOnlyDays(true);
                                setOnlyDayMonth(false);
                            }}
                        /> Due in fixed number of days
                    </Typography>
                    {onlyDays ? (
                        <input
                            className={cx(styleDialogText)}
                            type="text"
                            value={termDays}
                            onChange={(event)=>{setTermDays(event.target.value)}}
                        />
                    ) : (
                        <input
                            className={cx(styleDialogText)}
                            type="text"
                            value={termDays}
                            disabled
                        />
                    )} days
                    <Typography gutterBottom>
                        <input
                            className={cx(styleInputRadio)}
                            type="radio"
                            name="termType"
                            value={onlyDayMonth}
                            onClick={() => {
                                setOnlyDays(false);
                                setOnlyDayMonth(true);
                            }}
                        />Due by certain day of the month
                    </Typography>
                    {onlyDayMonth ? (
                        <input
                            className={cx(styleDialogText)}
                            type="text"
                            value={termDMDay}
                            onChange={(event)=>{setTermDMDay(event.target.value)}}
                        />
                    ) : (
                        <input
                            className={cx(styleDialogText)}
                            type="text"
                            value={termDMDay}
                            disabled
                        />
                    )} days of month
                    <Typography gutterBottom style={{ marginLeft: "20px" }}>
                        Due the next month if issued within
                    </Typography>
                    {onlyDayMonth ? (
                        <input
                            className={cx(styleDialogText)}
                            type="text"
                            value={termDMMonth}
                            onChange={(event)=>{setTermDMMonth(event.target.value)}}
                        />
                    ) : (
                        <input
                            className={cx(styleDialogText)}
                            type="text"
                            value={termDMMonth}
                            disabled
                        />
                    )} days of due date
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveNewTerm} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default costomDialog;