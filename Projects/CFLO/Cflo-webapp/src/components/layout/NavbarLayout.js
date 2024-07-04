import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import LogoPrimary from "../../Assets/LogoPrimary.svg"
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from '@material-ui/icons/Close';
import config from '../../config/index'

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
    },
    imgStyle: {
        width: "40px",
        height: "auto",
        cursor: "pointer",
    },
    navbar: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 10px",
    },
    logoCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleStyle: {
        color: theme.palette.primary.main,
        fontSize: "20px",
        fontWeight: "510",
    },
    mainComponentCont: {
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#FFFFFF",
    },
    contactUsStyle: {
        textDecoration: "none",
        width: "93px",
        color: "#fff",
        textTransform: "capitalize",
        [theme.breakpoints.down("xs")]: {
            marginTop: "6px"
        }
    },
    optionBtn: {
        fontSize: "17px",
        padding: "5px 20px",
        cursor: "pointer",
        marginRight: "20px",
        fontWeight: "500",
        color: "black",
        textDecoration: "none"
    },
    drawerPaper: {
        width: "100vw",
        height: "45vh",
        paddingTop: "20px",
        display: "flex",
        alignItems: "center",
        color: "#2E73F8",
        flexDirection: "column",
        [theme.breakpoints.down("xs")]: {
            paddingTop: "10px",
        },
    },
    logoInDrawerAndClose: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%"
    },
    logoInDrawer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    navDrawerBtn: {
        padding: "10px",
        fontSize: "17px",
        marginRight: "20px",
        color: "black",
        textDecoration: "none",
        [theme.breakpoints.down("sm")]: {
            margin: "5px 0px",
        },
    },
    navDrawerBtnBordered: {
        padding: "15px 10px",
        fontSize: "17px",
        marginRight: "20px",
        borderBottom: "3px solid #2E73F8",
        color: "black",
        textDecoration: "none",
        [theme.breakpoints.down("sm")]: {
            margin: "5px 0px",
        },
    },
    menuLogo: {
        marginLeft: "15px",
        cursor: "pointer",
    },
    imgAvatar: {
        width: "35px",
        height: "35px",
        borderRadius: "50%"
    }
}));

export default function NavbarLayout(props) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const dispatch = useDispatch();
    const { navHeight, bodyComponent, currentSection } = props
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const { auth } = useSelector((state) => state);
    const user = auth?.user

    const [openDraw, setOpenDraw] = useState(false)

    function handleDrawerToggle() {
        setOpenDraw(!openDraw);
    }

    return (
        <div className={classes.root}>
            <div className={classes.navbar} style={{ height: navHeight }} >
                <div className={classes.logoCont} >
                    <img
                        className={classes.imgStyle}
                        src={LogoPrimary}
                        onClick={() => { history.push("/") }}
                    />
                    <p className={classes.titleStyle} >ContractFlo</p>
                </div>
                {isSmall ? (
                    <MenuIcon onClick={() => { setOpenDraw(true) }} className={classes.menuLogo} />
                ) : (
                    <div className={classes.logoCont} >
                        <div
                            className={classes.optionBtn}
                            style={currentSection === "home" ? { color: theme.palette.primary.main } : {}}
                            onClick={() => { history.push("/") }}
                        >Home</div>
                        <div
                            className={classes.optionBtn}
                            style={currentSection === "investmentAnalysis" ? { color: theme.palette.primary.main } : {}}
                            onClick={() => { history.push("/investment/analysis/new") }}
                        >Investment Analysis</div>
                        <div
                            className={classes.optionBtn}
                            style={currentSection === "blogs" ? { color: theme.palette.primary.main } : {}}
                            onClick={() => { history.push("/blogs") }}
                        >Blogs</div>
                        <a
                            className={classes.optionBtn}
                            target="_blank"
                            href={`mailto:${config?.landingPageMailID}`}
                        >Contact Us</a>
                        {user ? (
                            <img
                                src={user?.displayPicture?.url}
                                className={classes.imgAvatar}
                            />
                        ) : (
                            <Button
                                className={classes.contactUsStyle}
                                variant="contained"
                                color="primary"
                                style={{ padding: "6px", boxShadow: "none" }}
                                onClick={() => { history.push("/") }}
                            >
                                Login
                            </Button>
                        )}
                    </div>
                )}
                <Drawer
                    variant="temporary"
                    anchor={"right"}
                    open={openDraw}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    ModalProps={{
                        keepMounted: true
                    }}
                >
                    <div className={classes.logoInDrawerAndClose} style={{ marginBottom: "20px" }} >
                        <div className={classes.logoInDrawer} >
                            <img src={LogoPrimary} className={classes.imgStyle} />
                            <Typography className={classes.titleStyle}>ContractFlo</Typography>
                        </div>
                        <CloseIcon
                            onClick={() => { setOpenDraw(false) }}
                            style={{ fontSize: "25px", cursor: "pointer" }}
                        />
                    </div>

                    {user && (
                        <img
                            src={user?.displayPicture?.url}
                            className={classes.imgAvatar}
                        />
                    )}

                    <ButtonBase
                        className={classes.navDrawerBtn}
                        onClick={() => { history.push("/investment/analysis/new") }}
                        style={currentSection === "investmentAnalysis" ? { color: theme.palette.primary.main } : {}}
                    >
                        Investment Analysis
                    </ButtonBase>
                    <ButtonBase
                        className={currentSection === "networkPage" ? classes.navDrawerBtnBordered : classes.navDrawerBtn}
                        onClick={() => { history.push("/blogs") }}
                        style={currentSection === "blogs" ? { color: theme.palette.primary.main } : {}}
                    >
                        Blogs
                    </ButtonBase>
                    <a
                        className={classes.navDrawerBtn}
                        target="_blank"
                        href={`mailto:${config?.landingPageMailID}`}
                    >
                        Contact Us
                    </a>
                    {user ? null : (
                        <Button
                            className={classes.contactUsStyle}
                            variant="contained"
                            color="primary"
                            style={{ padding: "6px", boxShadow: "none" }}
                            onClick={() => { history.push("/") }}
                        >
                            Login
                        </Button>
                    )}
                </Drawer>
            </div>
            <div className={classes.mainComponentCont} style={{ height: `calc( 100% - ${navHeight} )` }} >
                {bodyComponent}
            </div>
        </div>
    );
}