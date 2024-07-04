import { Button, Dialog, DialogTitle, Slide, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react'
import CancelIcon from '../../Assets/cancel.png';
import { deleteReport } from '../ProjectAnalysis/api.call';
const useStyles = makeStyles((theme) => ({
    Dialog: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    ImageContainer: {
        margin: '3vh 5vw 0 5vw',
        // width: '100%',
    },
    img: {
        width: '7rem',
        height: '7rem'
    },
    text: {
        color: '#616161'
    },
    ButtonGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: '2vh'
    }
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ConfirmationDialog(props) {
    const classes = useStyles();
    const { open, setOpen, reportId, teamId,
        setReports, message, btnText } = props;
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            // TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            className={classes.Dialog}
        >   <div className={classes.ImageContainer}>
                <img src={CancelIcon} alt="" className={classes.img} />
            </div>
            <DialogTitle>
                <Typography variant="h5">Are You Sure ?</Typography>
            </DialogTitle>
            <div style={{ width: '20rem', margin: '1vh 3vw 0 3vw' }}>
                <Typography className={classes.text} variant="body2">{message}</Typography>
            </div>
            <div className={classes.ButtonGroup}>
                <Button variant="contained" color="default"
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    Cancel
                </Button>
                <Button variant="contained" color="secondary" style={{ marginLeft: '1vw' }}
                    onClick={async () => {
                        let res = await deleteReport(reportId, teamId);
                        setReports([...res]);
                        console.log(res, "res");
                        setOpen(false);

                    }}
                >
                    {btnText}
                </Button>
            </div>

        </Dialog>
    )
}
