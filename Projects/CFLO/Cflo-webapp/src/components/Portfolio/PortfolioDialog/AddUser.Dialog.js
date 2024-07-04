import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { Typography } from "@material-ui/core";
import { createManyAccessRoles, editPortfolio } from "../apiCall";
import UserWithRoleComponent from "../../styled/CommonComponents/UserWithRoleComponent";


const roles = ["Admin", "Owner", "Editor", "Viewer"]

const useStyles = makeStyles((theme) => ({
    headerTitle: {
        fontSize: "20px",
        fontWeight: "550",
    },
    dialogCont: {
        width: "600px"
    },
}));

export default function AddUserDialog(props) {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { teamId } = useParams();
    const {
        existingUsers, portfolioData, setPortfolioData
    } = props;
    const DateNow = new Date();
    const { auth } = useSelector((state) => state);

    const [open, setOpen] = useState(false);
    const [usersWithAccess, setUsersWithAccess] = useState([]);
    const [accessableUsersWithRole, setAccessableUsersWithRole] = useState([]);
    const [multiInputBool, setmultiInputBool] = useState(false)
    const [name, setName] = useState("")


    useEffect(() => {
        setUsersWithAccess(existingUsers)
    }, [existingUsers])



    const handleClose = () => {
        setOpen(false);
    };

    const removeAccessableUsers = (id) => {
        setmultiInputBool(!multiInputBool)
        const filteredUserArr = usersWithAccess.filter(user => user?._id !== id);
        setUsersWithAccess(filteredUserArr)

        let newUserAccessRoleArr = []
        accessableUsersWithRole.map((userRole) => {
            if (userRole?.user?._id !== id) {
                newUserAccessRoleArr.push(userRole)
            }
        })
        setAccessableUsersWithRole(newUserAccessRoleArr)
        setmultiInputBool(!multiInputBool)
    }

    const updateAccessableUsersWithRole = (value, index) => {
        setmultiInputBool(!multiInputBool)
        let inputDataArr = accessableUsersWithRole;
        let editObj = {
            ...accessableUsersWithRole[index],
            role: value,
        }
        inputDataArr[index] = editObj;
        setAccessableUsersWithRole(inputDataArr)
        setmultiInputBool(!multiInputBool)
    }

    const addNewAccessableUsers = (newAccessRoleObj) => {
        const accessableUserWithRoleObj = {
            user: newAccessRoleObj?.user,
            role: newAccessRoleObj?.role
        }
        let newAccessableUsersWithRoleArr = [...accessableUsersWithRole, accessableUserWithRoleObj]
        setAccessableUsersWithRole(newAccessableUsersWithRoleArr);
    }

    const onClickAddUserToPortfolio = async () => {
        let allAccessRole = []
        let allAccessRoleIds = []
        let userProfileIds = []

        portfolioData?.accessWithRole.length > 0 && portfolioData.accessWithRole.map((userRole) => {
            allAccessRoleIds.push(userRole?._id)
        })

        usersWithAccess.length > 0 && usersWithAccess.map((userProfile) => {
            userProfileIds.push(userProfile?._id)
        })

        accessableUsersWithRole.map((userRole) => {
            const obj = {
                user: userRole?.user?._id,
                role: userRole?.role,
                parentId: portfolioData?._id,
                parentModelName: "Portfolio",
                creator: auth?.user?.profile
            }

            allAccessRole.push(obj)
        })

        await createManyAccessRoles({ allAccessRole })
            .then(async (accesRoleIds) => {
                if (accesRoleIds.length > 0) {
                    await editPortfolio({
                        _id: portfolioData?._id,
                        access: userProfileIds,
                        accessWithRole: [...allAccessRoleIds, ...accesRoleIds],
                    }).then(async (data) => {
                        setPortfolioData(data)
                    })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            })
            .catch((err) => {
                console.log(err)
            })
        handleClose()
    }






    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => { setOpen(true) }}
            >
                <AddIcon /> New User
            </Button>

            <Dialog scroll={'paper'} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" open={open}>
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                    style={{ padding: "8px 24px" }}
                >
                    <Typography className={classes.headerTitle} >Add New User</Typography>
                </DialogTitle>
                <DialogContent dividers={true} className={classes.dialogCont} >
                    <>
                        <div style={{ width: '100%', opacity: '0.5', marginTop: "20px" }} >
                            <Typography>Participants</Typography>
                        </div>
                        <UserWithRoleComponent
                            userArr={usersWithAccess}
                            setUserArr={setUsersWithAccess}
                            userRoleArr={accessableUsersWithRole}
                            setUserRoleArr={setAccessableUsersWithRole}
                            roles={roles}
                            defaultType={"Viewer"}
                            userProfile={auth?.user?.profile}
                            walletId={auth?.user?.wallet}
                            relationType={"Customer"}
                            userOp={true}
                            projectOp={false}
                            orgOp={false}
                            removeUserRole={removeAccessableUsers}
                            updateRoleOfUserRole={updateAccessableUsersWithRole}
                            addUserRole={addNewAccessableUsers}
                        />
                    </>
                </DialogContent>
                <DialogActions
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Button autoFocus onClick={handleClose} color="primary">
                        Close
                    </Button>
                    {accessableUsersWithRole.length > 0 ? (
                        <Button autoFocus onClick={() => { onClickAddUserToPortfolio() }} color="primary">
                            Add
                        </Button>
                    ) : (
                        <Button autoFocus color="primary" disabled>
                            Add
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
