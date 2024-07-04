import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import LessText from '../styled/CommonComponents/LessText';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    updateRentalRelationUnit,
    accessRoleUpdate,
    createAccessRole
} from "./apiCall";
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import UserWithRoleComponent from '../styled/CommonComponents/UserWithRoleComponent';

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
}));

const roles = ["Admin", "Owner", "Editor", "Viewer"]

export default function DocumentsSetting(props) {
    const history = useHistory();
    const classes = useStyles();
    const { teamId } = useParams();
    const date = new Date();
    const {
        currentRentalUnit, setCurrentRentalUnit, team,
        setRentalUnitSettingPage, setLoadingBool
    } = props;
    const { auth } = useSelector((state) => state);
    const [stateChange, setStateChange] = useState(false);
    const [docShareWith, setDocShareWith] = useState([]);
    const [docShareWithRole, setDocShareWithRole] = useState([]);

    console.log(currentRentalUnit)

    useEffect(() => {
        setDocShareWith(currentRentalUnit?.shareDocs)
        setDocShareWithRole(currentRentalUnit?.shareDocsWithRole)
    }, [currentRentalUnit?.shareDocs, currentRentalUnit?.shareDocsWithRole])


    const addNewAccessUser = async (newAccessRoleObj) => {
        setStateChange(!stateChange)
        setLoadingBool(true)

        await createAccessRole({
            user: newAccessRoleObj?.user?._id,
            role: newAccessRoleObj?.role,
            creator: auth?.user?.profile?._id,
            rentalId: currentRentalUnit?._id
        })
            .then(async (data) => {
                let newAccessRoleWithId = {
                    user: newAccessRoleObj?.user,
                    role: newAccessRoleObj?.role,
                    _id: data?._id
                }

                let newAccessableUsersWithRoleArr = [...docShareWithRole, newAccessRoleWithId]
                setDocShareWithRole(newAccessableUsersWithRoleArr);

                let userAccessRoleIds = []
                let userAccessIds = []

                newAccessableUsersWithRoleArr.map((userRole) => {
                    userAccessRoleIds.push(userRole._id)
                    userAccessIds.push(userRole?.user?._id)
                })

                await updateRentalRelationUnit({
                    rentalRelation: {
                        _id: currentRentalUnit?._id,
                        shareDocs: userAccessIds,
                        shareDocsWithRole: userAccessRoleIds
                    }
                })
                    .then((data) => {
                        setCurrentRentalUnit(data)
                        setStateChange(!stateChange)
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                setStateChange(!stateChange)
                setLoadingBool(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    //remove user
    const removeAccessRoleUser = async (removedUserId, newUserRoleArr) => {
        if (removedUserId && newUserRoleArr.length > 0) {
            setStateChange(!stateChange)

            await accessRoleUpdate({
                _id: removedUserId,
                deleted: true,
                deletedAt: date
            })
                .then(async (data) => {
                    let userAccessRoleIds = []
                    let userAccessIds = []

                    newUserRoleArr.map((userRole) => {
                        userAccessRoleIds.push(userRole?._id)
                        userAccessIds.push(userRole?.user?._id)
                    })

                    await updateRentalRelationUnit({
                        rentalRelation: {
                            _id: currentRentalUnit?._id,
                            shareDocs: userAccessIds,
                            shareDocsWithRole: userAccessRoleIds
                        }
                    })
                        .then((data) => {
                            setCurrentRentalUnit(data)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    setStateChange(!stateChange)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const removeUserRole = async (id) => {
        setLoadingBool(true)

        const filteredUserArr = docShareWith.filter(user => user?._id !== id);
        setDocShareWith(filteredUserArr)

        let newUserAccessRoleArr = []
        let removedUserRole
        docShareWithRole.map((userRole) => {
            if (userRole?.user?._id !== id) {
                newUserAccessRoleArr.push(userRole)
            } else {
                removedUserRole = userRole
            }
        })
        setDocShareWithRole(newUserAccessRoleArr)
        await removeAccessRoleUser(removedUserRole?._id, newUserAccessRoleArr)

        setLoadingBool(false)
    }

    //update user's role
    const updateRoleOfAccessUser = async (accessRoleObj) => {
        if (accessRoleObj) {
            setStateChange(!stateChange)
            await accessRoleUpdate({
                _id: accessRoleObj?._id,
                role: accessRoleObj?.role
            })
                .then((data) => {
                    let updatedRentalRelation = {
                        ...currentRentalUnit,
                        shareDocsWithRole: docShareWithRole
                    }
                    setCurrentRentalUnit(updatedRentalRelation)
                })
                .catch((err) => {
                    console.log(err)
                })
            setStateChange(!stateChange)
        }
    }

    const updateRoleOfUserRole = async (value, index) => {
        setLoadingBool(true)

        let inputDataArr = docShareWithRole;
        let editObj = {
            ...docShareWithRole[index],
            role: value,
        }
        inputDataArr[index] = editObj;
        setDocShareWithRole(inputDataArr)
        await updateRoleOfAccessUser(editObj)

        setLoadingBool(false)
    }

    //page change
    const goToNextStep = () => {
        setRentalUnitSettingPage("payment")
    }

    const goToPreviousStep = () => {
        setRentalUnitSettingPage("issues")
    }

    return (
        <div className={classes.root}>
            <UserWithRoleComponent
                userArr={docShareWith}
                setUserArr={setDocShareWith}
                userProfile={auth?.user?.profile}
                walletId={team?.wallet}
                relationType={"Customer"}
                userOp={true}
                projectOp={false}
                orgOp={true}
                defaultType={"Viewer"}
                userRoleArr={docShareWithRole}
                setUserRoleArr={setDocShareWithRole}
                roles={roles}
                addUserRole={addNewAccessUser}
                removeUserRole={removeUserRole}
                updateRoleOfUserRole={updateRoleOfUserRole}
            />

            <div className={classes.subAddressCont} style={{ marginTop: "40px" }} >
                <div></div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "30px" }}
                        startIcon={<ChevronLeftIcon />}
                        onClick={() => {
                            goToPreviousStep()
                        }}
                    >
                        previous
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "30px" }}
                        endIcon={<ChevronRightIcon />}
                        onClick={() => {
                            goToNextStep()
                        }}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
