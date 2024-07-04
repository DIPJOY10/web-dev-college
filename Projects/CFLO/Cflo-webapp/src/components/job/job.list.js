import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useJobApi } from './job.hooks';
import JobTable from './job.table';
import createLogo from '../../Assets/create1.png'
import { Button, Checkbox, Dialog, DialogTitle, FormControlLabel } from '@material-ui/core';

import CreateBtn from '../styled/actionBtns/create.btn';



const useStyles = makeStyles((theme) => ({
    btn_container: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        // border: "1px solid red",
        alignItems: "center",
        marginBottom: "2vh",
    },
    jobBtn: {
        borderRadius: "5vw",
        width: "15vw",
        height: "5vh",
        border: "2px solid",
        [theme.breakpoints.down('xs')]: {
            width: '50vw',
            height: '4vh'
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    dialogBtn: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
    }
}));



export default function JobList(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('Draft')
    const [FilterStatus, setFilterStatus] = React.useState('All');
    let filterArray = [];
    const [filter, setFilter] = React.useState(filterArray);
    const [open, setOpen] = React.useState(false);
    const [change, setChange] = useState(false);
    const [checkstate, setcheckState] = React.useState({
        checkedAll: true,
        checkedIncomplete: false,
        checkedReview_Pending: false,
        checkedRejected: false,
        checkedActive: false,
        checkedClosed: false
    });


    const {
        jobDictionary,
        jobPublishedIds, jobDraftIds,

    } = useSelector((state) => state.dashboard);

    const {
        root, container
    } = classes;
    const {
        jobCreate, loading, jobEdit
    } = useJobApi()

    const handleChange = (event) => {
        setStatus(event.target.value);
        setFilterStatus(event.target.value);
        setcheckState({ ...checkstate, [event.target.name]: event.target.checked });
    };
    const handleSave = () => {
        if (checkstate?.checkedAll)
            filterArray.push("All");
        if (checkstate?.checkedIncomplete)
            filterArray.push("Incomplete");
        if (checkstate?.checkedReview_Pending)
            filterArray.push("Review Pending");
        if (checkstate?.checkedRejected)
            filterArray.push("Rejected");
        if (checkstate?.checkedActive)
            filterArray.push("Active");
        if (checkstate?.checkedClosed)
            filterArray.push("Closed");
        if (filterArray.includes("All") && filterArray.length > 1) {
            filterArray.shift();
        }
        setFilter(filterArray);
        setOpen(false);
        console.log(filterArray, "FilterState")
    }
    const handleReset = () => {
        setcheckState({
            checkedAll: true,
            checkedIncomplete: false,
            checkedReview_Pending: false,
            checkedRejected: false,
            checkedActive: false,
            checkedClosed: false
        })
    }

    console.log(Object.keys(jobDictionary).length, "Dictionary length")

    return (
        <>
            <div className={classes.btn_container}>
                <Button color="primary" variant="outlined" onClick={() => { setOpen(true); }}>
                    Filter
                </Button>
                <Dialog open={open} maxWidth={'xl'} onClose={() => { setOpen(false); }}>
                    <DialogTitle id="simple-dialog-title">Choose from below</DialogTitle>
                    <div style={{ paddingLeft: "15%", display: "flex", flexDirection: "column" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkstate.checkedAll}
                                    onChange={handleChange}
                                    name="checkedAll"
                                    color="primary"
                                />
                            }
                            label="All"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkstate.checkedIncomplete}
                                    onChange={handleChange}
                                    name="checkedIncomplete"
                                    color="primary"
                                />
                            }
                            label="Incomplete"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkstate.checkedReview_Pending}
                                    onChange={handleChange}
                                    name="checkedReview_Pending"
                                    color="primary"
                                />
                            }
                            label="Review Pending"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkstate.checkedRejected}
                                    onChange={handleChange}
                                    name="checkedRejected"
                                    color="primary"
                                />
                            }
                            label="Rejected"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkstate.checkedActive}
                                    onChange={handleChange}
                                    name="checkedActive"
                                    color="primary"
                                />
                            }
                            label="Active"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkstate.checkedClosed}
                                    onChange={handleChange}
                                    name="checkedClosed"
                                    color="primary"
                                />
                            }
                            label="Closed"
                        />
                    </div>
                    <div className={classes.dialogBtn}>
                        <CreateBtn type="submit" color="primary" onClick={handleReset}>Reset</CreateBtn>
                        <CreateBtn type="submit" color="primary" onClick={handleSave}>Save</CreateBtn>
                    </div>


                </Dialog>
                <Button variant="outlined" className={classes.jobBtn} color="primary" disabled={loading} onClick={() => {
                    jobCreate();
                }}>
                    <img src={createLogo} alt="" />
                    Post a free Job
                </Button>
            </div>
            {/* <h1>This is job section</h1> */}
            <JobTable FilterStatus={filter} />

        </>
    );
}
