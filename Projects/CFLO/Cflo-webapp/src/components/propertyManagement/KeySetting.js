import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import EditIcon from "@material-ui/icons/Edit";
import LessText from '../styled/CommonComponents/LessText';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    updateRentalRelationUnit,
    updateManyAccessRole,
    getProjectIdCode,
    updateProject
} from "./apiCall";
import TextField from '@material-ui/core/TextField';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: "#ffffff",
        padding: "20px"
    },
    subAddressCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
    },
    inputCont: {
        width: "100%",
        border: "1px solid #E1E2E5",
        padding: "15px 10px",
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function KeySettings(props) {
    const history = useHistory();
    const classes = useStyles();
    const { teamId } = useParams();

    const {
        currentRentalUnit, setCurrentRentalUnit, team,
        setRentalUnitSettingPage, setLoadingBool, setTeam,
        setUnitPage
    } = props;

    let oldPropertyId = team?.parent?.projectIdCode || null
    let tenantPassword = currentRentalUnit?.tenantPassword || ""

    const [propertyId, setPropertyId] = useState(oldPropertyId);
    const [unitPassword, setUnitPassword] = useState(tenantPassword);
    const [stateChange, setStateChange] = useState(false);
    const [editId, setEditId] = useState(false);
    const [alreadyExist, setAlreadyExist] = useState(false)
    const [alertBool, setAlertBool] = useState(false)
    const [alertBox, setAlertBox] = useState(false)

    const handleCloseAlert = () => {
        setPropertyId(oldPropertyId)
        setAlertBox(false)
        setAlertBool(false)
        setAlreadyExist(false)
        setAlertBox(false)
    }

    const addNewProjectId = async () => {
        let oldProjectIdCode = team?.parent?.projectIdCode
        if (oldProjectIdCode !== propertyId) {
            await getProjectIdCode({ projectIdCode: propertyId })
                .then(async (data) => {
                    console.log(data)
                    if (data.length > 0) {
                        setAlreadyExist(true)
                        setAlertBox(true)
                        setPropertyId(oldPropertyId)
                    } else {
                        setAlertBool(true)
                        setAlertBox(true)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const finalProjectIdCodeUpdate = async () => {
        await updateProject({
            _id: team?.parent?._id,
            projectIdCode: propertyId
        })
            .then((data) => {
                let oldProject = team?.parent
                let newProject = {
                    ...oldProject,
                    projectIdCode: propertyId
                }

                let newTeam = {
                    ...team,
                    parent: newProject
                }

                setTeam(newTeam)
                setAlertBool(false)
                setAlreadyExist(false)
                setAlertBox(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const updateKeys = async () => {
        setStateChange(!stateChange)
        setLoadingBool(true)

        await updateRentalRelationUnit({
            rentalRelation: {
                _id: currentRentalUnit?._id,
                tenantPassword: unitPassword
            }
        })
            .then(async (data) => {
                setCurrentRentalUnit(data)
                console.log(data)

                let accessRoleIds = []

                data?.chatWithRole?.length > 0 && data.chatWithRole.map((accessRole) => {
                    accessRoleIds.push(accessRole?._id)
                })

                data?.shareTicketsWithRole?.length > 0 && data.shareTicketsWithRole.map((accessRole) => {
                    accessRoleIds.push(accessRole?._id)
                })

                data?.shareDocsWithRole?.length > 0 && data.shareDocsWithRole.map((accessRole) => {
                    accessRoleIds.push(accessRole?._id)
                })

                await updateManyAccessRole({
                    accessRoleIds,
                    parentId: data?._id
                })
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                setStateChange(!stateChange)
            })
            .catch((err) => {
                console.log(err);
            })
        setLoadingBool(false)
        setUnitPage("unitRowPage")
    }


    return (
        <div className={classes.root}>
            <div style={{ width: '100%', opacity: '0.7', marginBottom: "10px" }} >
                <Typography>Tenant Login Credentials</Typography>
            </div>
            <div className={classes.inputCont}>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }} >
                    <TextField
                        id="outlined-basic"
                        label="Property Id"
                        variant="outlined"
                        style={{ width: "85%" }}
                        size="small"
                        value={propertyId}
                        onChange={(e) => { setPropertyId(e.target.value); }}
                        disabled={!editId}
                    />

                    {editId ? (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={() => {
                                setEditId(false)
                                addNewProjectId()
                            }}
                        >
                            save
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => {
                                setEditId(true)
                            }}
                        >
                            Edit
                        </Button>
                    )}

                    <Dialog
                        open={alertBox}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseAlert}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title" style={{ color: 'red' }} >Alert!!!</DialogTitle>
                        <DialogContent dividers={true} >
                            {alreadyExist && <div style={{ color: "red" }} >The Project Id Code is already exist, Try again!</div>}
                            {alertBool && <div>Your action will change the id code of the project, And because of that
                                all Tenants will lose their access of their tenant website</div>}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAlert} color="primary">
                                cancel
                            </Button>
                            {alreadyExist &&
                                (
                                    <Button onClick={handleCloseAlert} color="primary">
                                        ok
                                    </Button>
                                )}
                            {alertBool &&
                                (
                                    <Button onClick={finalProjectIdCodeUpdate} color="primary">
                                        proceed
                                    </Button>
                                )}
                        </DialogActions>
                    </Dialog>

                </div>
                <div style={{ marginBottom: " 15px" }} >
                    {editId && (<div><span style={{ color: "red" }} >*</span>If you change the <span style={{ color: "red" }} >Property Id</span>, make sure all tenants in property get the same PropertyId. Unit Password will be unique for a tenant</div>)}
                </div>
                <TextField
                    id="outlined-basic"
                    label="Unit Password"
                    variant="outlined"
                    style={{ width: "100%" }}
                    size="small"
                    value={unitPassword}
                    onChange={(e) => { setUnitPassword(e.target.value); }}
                />
            </div>
            <div className={classes.subAddressCont} style={{ marginTop: "40px" }} >
                <div></div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "30px" }}
                        startIcon={<ChevronLeftIcon />}
                        onClick={() => {
                            setRentalUnitSettingPage("payment")
                        }}
                    >
                        previous
                    </Button>
                    {propertyId && unitPassword?.length > 5 ? (<>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: "30px" }}
                            startIcon={<DoneAllIcon />}
                            onClick={() => { updateKeys() }}
                        >
                            Submit
                        </Button>
                    </>) : (<>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: "30px" }}
                            startIcon={<DoneAllIcon />}
                            disabled
                        >
                            Submit
                        </Button>
                    </>)}
                </div>
            </div>
            <div>
                <span style={{ color: "red" }} >*</span>To submit the unit the property should have <span style={{ color: "red" }} >Property Id</span>, and <span style={{ color: "red" }} >unitPassword</span> should have minimum 6 characters(number/letter)
            </div>
        </div>
    );
}
