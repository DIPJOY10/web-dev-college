import React, { useEffect, useState } from 'react';
import Api from "../../helpers/Api";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ImportTemplateDialog() {

	const [projectTeams, setProjectTeams] = useState([]);
	const [adminProfileIds, setAdminProfileIds] = useState([]);
	const [orgTeams, setOrgTeams] = useState([]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const getBasicData = async () => {
        const res = await Api.post("shared/getBasicData", {
            userProfileId: user?.profile,
        });

        if (res?.data) {
            const data = res?.data;
            const adminProfileIdsRes = res.data.adminProfileIds;
            const orgTeamRes = data.orgTeams;
            const projectTeamRes = data.projectTeams;

            setAdminProfileIds(adminProfileIdsRes);
            setOrgTeams(orgTeamRes);
            setProjectTeams(projectTeamRes);
        }
    };

    useEffect(() => {
		getBasicData();
	}, []);

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open alert dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous location data to
                    Google, even when no apps are running.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Disagree
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}