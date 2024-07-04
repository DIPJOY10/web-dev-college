import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Api from "../../helpers/Api";
import CreateButton from '../styled/actionBtns/create.btn';
import AddIcon from "@material-ui/icons/Add";

export default function SelectTemplate(props) {
    const history = useHistory();
    const { user, userProfile } = useSelector((state) => state.auth);
    const {
        templateIds, templateDictionary, profile
    } = props;

    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const createApi = async (templateId) => {
        const template = templateDictionary[templateId];
        const issueShared = template?.issueShared || []
        const profileId = profile?._id
        const userProfileId = user?.profile
        const sharedSet = new Set([...issueShared, profileId, userProfileId])

        let issueObject = {
            user: user._id,
            template: templateId,
            profile: profile?._id,
            shared: Array.from(sharedSet)
        }

        const res = await Api.post("issue/create", issueObject);
        const data = res?.data;
        const issueId = data?._id;
        const path = '/issue/edit/' + issueId;
        history.push(path);

    }

    return (
        <>
            <CreateButton
                style={{ flexBasis: "20%" }}
                startIcon={<AddIcon />}
                onClick={() => {
                    setOpen(true);
                }}
            >
                Issue
            </CreateButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Select Template"}</DialogTitle>
                <List component="nav">
                    {templateIds.map(templateId => {
                        const template = templateDictionary[templateId];
                        return (
                            <ListItem button onClick={() => {
                                createApi(templateId)
                            }}>
                                <ListItemText primary={template?.title} />
                            </ListItem>
                        )
                    })}
                </List>

            </Dialog>
        </>
    );
}