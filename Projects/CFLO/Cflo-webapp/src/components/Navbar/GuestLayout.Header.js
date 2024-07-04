import React, { useState } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LogoPrimary from "../../Assets/LogoPrimary.svg"
import { handleGoogleLogin } from "../auth/auth.utils";
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    imgStyle: {
        width: "40px",
        height: "auto",
        cursor: "pointer",
    },
    navbar: {
        width: "100%",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        padding: "0px 25px",
        [theme.breakpoints.down('xs')]: {
            padding: "0px 5px",
        }
    },
    logoCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    mainComponentCont: {
        width: "100%",
        height: "calc(100vh - 50px)",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#F5F7FA"
    },
    actionText: {
        color: theme.palette.primary.main,
        fontSize: "16px",
        fontWeight: "500",
        marginRight: "25px",
        cursor: "pointer",
        [theme.breakpoints.down('xs')]: {
            marginRight: "10px",
            fontSize: "14px",
        }
    },
    titleStyle: {
        color: theme.palette.primary.main,
        fontSize: "20px",
        fontWeight: "510",
    }
}));


const GuestLayoutHeader = (props) => {
    const { height } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const history = useHistory();

    return (
        <div className={classes.navbar} style={height ? { height: height } : {}} >
            <div className={classes.logoCont} >
                <img
                    className={classes.imgStyle}
                    src={LogoPrimary}
                    onClick={() => { history.push("/") }}
                />
                <p className={classes.titleStyle} >ContractFlo</p>
            </div>
            <div className={classes.logoCont} >
                {user ? (<>
                    <Avatar src={user?.displayPicture?.url} />
                </>) : (<>
                    <div
                        className={classes.actionText}
                        onClick={() => { handleGoogleLogin(dispatch) }}
                    >Sign In</div>
                    <div
                        className={classes.actionText}
                        onClick={() => { handleGoogleLogin(dispatch) }}
                    >Sign Up</div>
                </>)}
            </div>
        </div>
    );
};

export default GuestLayoutHeader;