import { Button, Checkbox, Dialog, DialogTitle, FormControlLabel, List, ListItem, Typography } from '@material-ui/core';
import React from 'react'
import CreateBtn from '../styled/actionBtns/create.btn';

export default function FilterDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [checkstate, setcheckState] = React.useState({
        checkedAll: true,
        checkedIncomplete: false,
        checkedReview_Pending: false,
        checkedRejected: false,
        checkedActive: false,
        checkedClosed: false
    });

    const handleChange = (event) => {
        setcheckState({ ...checkstate, [event.target.name]: event.target.checked });
    };
    return (
        <><Button color="primary" variant="outlined" onClick={() => { setOpen(true); }}>
            Filter
        </Button>
            <Dialog open={open} onClose={() => { setOpen(false); }}>
                <DialogTitle id="simple-dialog-title">Choose from below :</DialogTitle>
                <div style={{ padding: "10px", }}>
                    <List>
                        <ListItem>
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
                        </ListItem>
                        <ListItem>
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
                        </ListItem>
                        <ListItem>
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
                        </ListItem>
                        <ListItem>
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
                        </ListItem>
                        <ListItem>
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
                        </ListItem>
                        <ListItem>
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
                        </ListItem>
                    </List>
                    <CreateBtn color="primary" onClick={() => { setOpen(false); console.log(checkstate, "FilterState") }}>Save</CreateBtn>
                    {/* <Typography variant="body2">Dialog body</Typography> */}

                </div>


            </Dialog></>
    )
}
