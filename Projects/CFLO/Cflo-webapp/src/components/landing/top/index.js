import React, { useEffect, useRef, useState } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import LogoPrimary from "../../../Assets/LogoPrimary.svg";
import Drawer from "@material-ui/core/Drawer";
import Button from '@material-ui/core/Button';
import ButtonBase from "@material-ui/core/ButtonBase";
import { useMediaQuery } from "@material-ui/core";
import LandingPageImage from "../../../Assets/illustration.svg";
import CloseIcon from '@material-ui/icons/Close';
import AuthBox from "../../auth/AuthBox";
import config from '../../../config/index'

const useStyles = makeStyles((theme) => ({
    row: {
        maxWidth: "100%",
        margin: "0 auto",
        display: "flex",
        marginBottom: "25px",
        alignItems: "center",
        justifyContent: "space-between",
    },
    topRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "white",
        color: "#2E73F8",
        padding: "20px 30px",
        [theme.breakpoints.down("sm")]: {
            padding: "10px 15px",
            paddingBottom: "0px"
        },
    },
    topRowAsNav: {
        position: "fixed",
        zIndex: "1000",
        top: "0px",
        left: "0px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "white",
        color: "#2E73F8",
        padding: "0px 30px",
        boxShadow: "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px",
        [theme.breakpoints.down("sm")]: {
            padding: "10px 15px",
        },
    },
    totalLogoCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoStyle: {
        height: "3rem",
    },
    logoTextSize: {
        marginLeft: "10px",
        fontSize: "1.5rem",
        fontWeight: "500",
        color: "#2196F3",
        [theme.breakpoints.down("sm")]: {

        },
    },
    navOptionCont: {
        width: "540px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            justifyContent: "flex-end",
        },
    },
    navBtnText: {
        color: "#000000",
        fontSize: "16px",
        fontWeight: "400"
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
        [theme.breakpoints.down("sm")]: {
            margin: "5px 0px",
        },
    },
    menuLogo: {
        marginLeft: "15px",
        cursor: "pointer",
    },
    drawerPaper: {
        width: "50vw",
        height: "60vh",
        paddingTop: "20px",
        display: "flex",
        alignItems: "center",
        color: "#2E73F8",
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {
            width: "100vw",
        },
    },
    logoInDrawer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoInDrawerAndClose: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%"
    },
    temp: {
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "15px",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginTop: "50px"
        },
    },
    authCont: {
        width: "35%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        [theme.breakpoints.down("md")]: {
            width: "43%",
        },
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },
    contactUsStyle: {
        textDecoration: "none",
        width: "93px",
        color: "#fff",
        textTransform: "capitalize"
    },
    landingImgStyle: {
        width: "100%",
        height: "auto",
        marginTop: "20px",
        [theme.breakpoints.down("sm")]: {
            marginTop: "0px",
        },
    },
    headingLanding: {
        fontWeight: "500",
        fontSize: "32px",
        lineHeight: "120%",
        display: "flex",
        color: "#455A64",
        textAlign: "center",
        margin: "0 auto",
        [theme.breakpoints.down("sm")]: {
            fontSize: "27px",
        },
    },
    landingImgCont: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    missTop: {
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    }
}));

export default function Top(props) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const { pos, setLoadingBool } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCrossHomePage, setIsCrossHomePage] = useState(false);
    const [currentSection, setCurrentSection] = useState("homePage");
    const landingHomePageRef = useRef(null);

    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));
    const middleScreen = useMediaQuery(theme.breakpoints.down("md"));

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen);
    }

    const animate = () => {
        const current = window.scrollY
        const triggerPointStart = landingHomePageRef.current?.offsetTop + landingHomePageRef.current?.offsetHeight;

        if (current > triggerPointStart) {
            setIsCrossHomePage(true)
        }
        if (current < triggerPointStart) {
            setIsCrossHomePage(false)
        }

        const softwareEndPoint = pos.software.current?.offsetTop - 100
        const networkEndPoint = pos.network.current?.offsetTop - 100
        const servicesEndPoint = pos.services.current?.offsetTop - 100

        if (current > softwareEndPoint && current < networkEndPoint) {
            setCurrentSection("softwarePage")
        } else if (current > networkEndPoint && current < servicesEndPoint) {
            setCurrentSection("networkPage")
        } else if (current > servicesEndPoint) {
            setCurrentSection("servicesPage")
        } else {
            setCurrentSection("homePage")
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", animate, {
            passive: true,
        });
    }, []);

    const scrollTo = (ref) => {
        if (!ref) return;
        ref.current.scrollIntoView({
            top: ref.offsetTop,
            left: 0,
            behavior: "smooth",
        });
        setMobileOpen(false)
    };

    return (
        <div ref={landingHomePageRef} >
            <Box
                bgcolor="#2E73F8"
                flexDirection="column"
                flexGrow={1}
                display="flex"
                overflow="hidden"
                // height={isSmall ? (isExSmall ? "160vh" : "185vh") : "100vh"}
                maxWidth="100vw"
            >
                <div className={isCrossHomePage ? classes.topRowAsNav : classes.topRow}>
                    <div className={classes.totalLogoCont} >
                        <img src={LogoPrimary} className={classes.logoStyle} />
                        <Typography className={classes.logoTextSize}>ContractFlo</Typography>
                    </div>
                    <div className={classes.navOptionCont} >
                        {isSmall ? (
                            <MenuIcon onClick={() => { setMobileOpen(true) }} className={classes.menuLogo} />
                        ) : (
                            <>
                                <ButtonBase
                                    className={classes.navDrawerBtn}
                                    onClick={() => {
                                        history.push("/investment/analysis/new")
                                    }}
                                >
                                    <Typography className={classes.navBtnText}>Investment Analysis</Typography>
                                </ButtonBase>
                                <ButtonBase
                                    className={classes.navDrawerBtn}
                                    onClick={() => {
                                        history.push("/blogs")
                                    }}
                                >
                                    <Typography className={classes.navBtnText}>Blogs</Typography>
                                </ButtonBase>
                                <a
                                    className={classes.navDrawerBtn}
                                    target="_blank"
                                    href={`mailto:${config?.landingPageMailID}`}
                                >
                                    <Typography className={classes.navBtnText}>Contact Us</Typography>
                                </a>
                                <Button
                                    className={classes.contactUsStyle}
                                    variant="contained"
                                    color="primary"
                                    style={{ padding: "6px", boxShadow: "none" }}
                                    onClick={() => {
                                        scrollTo(landingHomePageRef);
                                    }}
                                >
                                    Login
                                </Button>
                            </>
                        )}
                    </div>
                    <Drawer
                        variant="temporary"
                        anchor={"right"}
                        open={mobileOpen}
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
                                <img src={LogoPrimary} className={classes.logoStyle} />
                                <Typography className={classes.logoTextSize}>ContractFlo</Typography>
                            </div>
                            <CloseIcon
                                onClick={() => { setMobileOpen(false) }}
                                style={{ fontSize: "25px", cursor: "pointer" }}
                            />
                        </div>
                        <ButtonBase
                            className={classes.navDrawerBtn}
                            onClick={() => {
                                history.push("/investment/analysis/new")
                            }}
                        >
                            Investment Analysis
                        </ButtonBase>
                        <ButtonBase
                            className={classes.navDrawerBtn}
                            onClick={() => {
                                history.push("/blogs")
                            }}
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
                    </Drawer>
                </div>
                <Box
                    bgcolor="#ffffff"
                    flexDirection={isSmall ? "column" : "row"}
                    display="flex"
                    maxWidth="100vw"
                    width={"100%"}
                    padding={middleScreen ? "0px 2rem" : "0px 5rem"}
                >
                    {isSmall ? (
                        <>
                            <div className={classes.temp}>
                                <div data-aos={"zoom-in-up"} data-aos-once={false} className={classes.landingImgCont} >
                                    <Typography className={classes.headingLanding}>Collaborative Workspace for Real Estate professionals</Typography>
                                    <img src={LandingPageImage} className={classes.landingImgStyle} />
                                </div>
                            </div>
                            <div data-aos={"zoom-in-down"} data-aos-once={false} >
                                <AuthBox
                                    setLoadingBool={setLoadingBool}
                                />
                            </div>
                        </>
                    ) : (
                        <div className={classes.row}>
                            <div data-aos={"zoom-in-down"} data-aos-once={false} className={classes.authCont}>
                                <AuthBox
                                    setLoadingBool={setLoadingBool}
                                />
                            </div>
                            <div className={classes.temp}>
                                <div data-aos={"zoom-in-up"} data-aos-once={false} className={classes.landingImgCont} >
                                    <Typography className={classes.headingLanding}>Collaborative Workspace for Real Estate professionals</Typography>
                                    <img src={LandingPageImage} className={classes.landingImgStyle} />
                                </div>
                                <div className={classes.missTop} >
                                </div>
                            </div>
                        </div>
                    )}
                </Box>
            </Box>
        </div>
    );
}