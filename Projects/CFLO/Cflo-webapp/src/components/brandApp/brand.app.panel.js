import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Button from "@material-ui/core/Button";
import baseStyle from '../styled/base/index';
import Api from '../../helpers/Api';
import CreateBtn from "../styled/actionBtns/create.btn";
import { LinearProgress } from '@material-ui/core';
import BrandAppCard from './brand.app.card';
import AppsIcon from '@material-ui/icons/Apps';
import LogoSvg from "../../Assets/appstore.svg";
import { createBrandApp, getBrandApp } from './apiCall';
import BuildIcon from '@material-ui/icons/Build';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LessText from '../styled/CommonComponents/LessText';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        marginLeft: '1rem',
        width: '16rem',
        maxWidth: '16rem',
        minWidth: '16rem',
        display: 'flex',
        padding: '1rem',
        flexDirection: 'column',
        height: '14rem',
        marginTop: '1rem',
        textAlign: 'center',
        position: 'relative',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    topRow: {
        marginBottom: '1rem',
    },
    title: {
        marginLeft: '7px',
        fontWeight: '700'
    },
    ...baseStyle,
    box: {
        margin: '0.5rem 0',
        padding: '0.5rem'
    },
    svgSize: {
        display: "flex",
        height: "35px",
        width: "35px",
    },
    developCont: {
        display: "flex",
        alignItems: 'center',
        padding: "5px",
        backgroundColor: "yellow",
        color: "black",
        width: "90px",
        fontSize: "10px",
        fontWeight: "600"
    },
    mainCont: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'column',
    },
    rowStyle: {
        width: "100%",
        display: "flex",
        alignItems: 'center',
        marginBottom: "5px"
    },
    dialogRow: {
        width: "280px",
        display: "flex",
        alignItems: 'center',
        marginBottom: "5px"
    },
    appTitle: {
        width: "103px",
        textAlign: "left",
        marginLeft: "7px"
    },
    displayFlex: {
        display: "flex",
        alignItems: 'center',
    },
    bottomLabel: {
        position: "absolute",
        bottom: "5px",
        left: "93px",
        fontSize: "13px",
        color: theme.palette.primary.main,
        fontWeight: "510",
        cursor: "pointer",
    }
}));

export default function AppPanel(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();
    const {
        profileId
    } = props;

    

    const {
        auth
    } = useSelector((state) => state);
    const user = auth?.user;
    const {
        root, row, col, title, box
    } = classes;

    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(false)
    const [openAllApps, setOpenAllApps] = useState(false)
    const [anyMyApp, setAnyMyApp] = useState(false)

    const handleClose = () => {
        setOpenAllApps(false)
    }

    const createBrandAppApiHit = async () => {
        await createBrandApp({
            user: user._id,
            ownerShip: profileId
        })
            .then((data) => {
                const goUrl = `brand/app/create/order/${data?._id}`
                history.push(goUrl)
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const getApps = async () => {
        console.log("profileId", profileId)
        setLoading(true)
        await getBrandApp({ profileId })
            .then((data) => {
                let allApps = []
                data.length > 0 && data.map((singleApp) => {
                    const accessRole = singleApp.accessRole
                    let curRole = "User"
                    accessRole.map((accessWithRole) => {
                        if (accessWithRole?.user?._id === profileId) {
                            curRole = accessWithRole?.role
                        }
                    })

                    if (curRole === "Owner") {
                        setAnyMyApp(true)
                    }

                    if (curRole === "Owner" || curRole === "Admin") {
                        const newObj = {
                            ...singleApp,
                            curRole: curRole,
                        }
                        allApps.push(newObj)
                    }
                })
                console.log(allApps)
                setApps(allApps)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (profileId) {
            getApps()
        }
    }, [profileId])


    return (
        <Paper
            outlined
            square
            className={classes.root}
        >
            <div>
                <div className={clsx(classes.row, classes.topRow)} style={{ justifyContent: 'space-between' }} >
                    <div style={{ display: 'flex', alignItems: 'center' }} >
                        <img className={classes.svgSize} src={LogoSvg} />
                        <Typography className={classes.title}>
                            Order App
                        </Typography>
                    </div>
                    {apps.length > 0 && !anyMyApp ? (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ height: "35px" }}
                            onClick={() => {
                                createBrandAppApiHit();
                            }}
                        >
                            + New
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    {loading && <LinearProgress loading={loading} />}
                </div>
            </div>
            <>
                {loading ?
                    <></>
                    :
                    <div className={classes.mainCont} >
                        {apps.length > 0 ?
                            <>
                                {apps.slice(0, 3).map((app) => (
                                    <div
                                        className={classes.rowStyle}
                                        onClick={() => {
                                            if (app) {
                                                const goUrl = `brand/app/create/order/${app?._id}`
                                                history.push(goUrl)
                                            }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className={classes.displayFlex} >
                                            <>{
                                                app?.displayPicture ? (
                                                    <img
                                                        style={{ maxWidth: "25px", height: "25px" }}
                                                        src={app?.displayPicture?.url}
                                                        alt={"Logo"}
                                                    />
                                                ) : (
                                                    <AppsIcon
                                                        style={{
                                                            color: theme.palette.primary.main,
                                                            fontSize: "25px"
                                                        }}
                                                    />
                                                )
                                            }</>
                                            <div className={classes.appTitle} >
                                                <p style={{
                                                    fontSize: "13px",
                                                    fontWeight: "520"
                                                }} >
                                                    <LessText
                                                        limit={9}
                                                        string={app?.name || "App Name"}
                                                    />
                                                </p>
                                                <p style={{
                                                    fontSize: "10px",
                                                    fontWeight: "520",
                                                    border: "1px solid #E1E2E5",
                                                    width: "40px",
                                                    textAlign: "center",
                                                    borderRadius: "8px",
                                                }} >{app?.curRole || "App Name"}</p>
                                            </div>

                                        </div>
                                        <div className={classes.developCont} >
                                            {app?.paid ? (
                                                <><BuildIcon style={{ color: "black", fontSize: "20px" }} /> Development</>
                                            ) : (
                                                <><ShoppingCartIcon style={{ color: "black", fontSize: "20px" }} /> Incomplete</>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                            :
                            <Typography variant="body2" component="p" >
                                Order your tenant management app now, and get started building your brand
                            </Typography>}
                        {apps.length > 0 ? (
                            <></>
                        ) : (
                            <CreateBtn
                                onClick={() => {
                                    createBrandAppApiHit();
                                }}
                            >
                                Order Now
                            </CreateBtn>
                        )}
                    </div>
                }
            </>
            <Typography
                className={classes.bottomLabel}
                onClick={() => {
                    setOpenAllApps(true)
                }}
            >
                {apps && apps.length > 3 ? (<>more{`(+${apps.length - 3})`}</>) : (<></>)}
            </Typography>









            <Dialog
                open={openAllApps}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle onClose={handleClose}>All Apps</DialogTitle>
                <DialogContent dividers>
                    {apps.map((app) => (
                        <div
                            className={classes.rowStyle}
                            onClick={() => {
                                if (app) {
                                    const goUrl = `brand/app/create/order/${app?._id}`
                                    history.push(goUrl)
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={classes.displayFlex} >
                                <>{
                                    app?.displayPicture ? (
                                        <img
                                            style={{ maxWidth: "25px", height: "25px" }}
                                            src={app?.displayPicture?.url}
                                            alt={"Logo"}
                                        />
                                    ) : (
                                        <AppsIcon
                                            style={{
                                                color: theme.palette.primary.main,
                                                fontSize: "25px"
                                            }}
                                        />
                                    )
                                }</>
                                <div className={classes.appTitle} >
                                    <p style={{
                                        fontSize: "13px",
                                        fontWeight: "520"
                                    }} >
                                        <LessText
                                            limit={9}
                                            string={app?.name || "App Name"}
                                        />
                                    </p>
                                    <p style={{
                                        fontSize: "10px",
                                        fontWeight: "520",
                                        border: "1px solid #E1E2E5",
                                        width: "40px",
                                        textAlign: "center",
                                        borderRadius: "8px",
                                    }} >{app?.curRole || "App Name"}</p>
                                </div>

                            </div>
                            <div className={classes.developCont} >
                                {app?.paid ? (
                                    <><BuildIcon style={{ color: "black", fontSize: "20px" }} /> Development</>
                                ) : (
                                    <><ShoppingCartIcon style={{ color: "black", fontSize: "20px" }} /> Incomplete</>
                                )}
                            </div>
                        </div>
                    ))}

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            handleClose()
                        }}
                    >
                        close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
