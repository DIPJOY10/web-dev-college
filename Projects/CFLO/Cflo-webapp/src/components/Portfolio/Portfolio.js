import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core";
import { useMediaQuery, ButtonBase, TextField, InputAdornment, IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useHistory, useLocation } from "react-router-dom";
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import AddIcon from "@material-ui/icons/Add";
import CreatePortfolioDialog from "./PortfolioDialog/Create.Portfolio.Dialog";
import PortfolioTable from "./PortfolioTable";
import { getPortfolioByProfile } from "./apiCall";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        paddingBottom: "10px",
        "& > *": {
            margin: theme.spacing(1),
        },
        [theme.breakpoints.down('md')]: {
            marginTop: "0px",
        },
    },
    tableCont: {
        display: "flex",
        marginBottom: "0px",
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        marginTop: "65px",
        [theme.breakpoints.down('sm')]: {
            paddingTop: "14px",
        }
    },
    createBtn: {
        position: "absolute",
        top: "-56px",
        right: "3px",
        [theme.breakpoints.down('xs')]: {
            right: "-8px",
        }
    },
    headerCont: {
        width: "98%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px",
        marginBottom: "2px",
        marginTop: "2px",
    },
    KeyboardBackspaceIconSty: {
        fontSize: "35px",
        [theme.breakpoints.down('md')]: {
            marginLeft: "-20px",
            fontSize: "1.7rem",
        },
    },
    displayFlex: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    searchTextBox: {
        width: "60%",
        padding: "14px",
        position: "absolute",
        top: "-70px",
        left: "50px",
        [theme.breakpoints.down('xs')]: {
            position: "absolute",
            top: "-70px",
            left: "50px",
            width: "55%",
            paddingLeft: "3px"
        },
    },
    reqNotification: {
        position: "absolute",
        top: "-64px",
        left: "-7px",
        [theme.breakpoints.down('xs')]: {
            left: "-7px",
            top: "-64px",
        }
    },
    notificationNo: {
        position: "absolute",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        top: "10px",
        left: "32px",
        backgroundColor: theme.palette.primary.main,
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px"
    },
    headerBar: {
        width: "100%",
        height: "60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "-3px",
        marginBottom: "15px",
        [theme.breakpoints.down('sm')]: {
            marginTop: "-80px",
        }
    },
    leftSideBar: {
        marginLeft: "10px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
    },
    backIcon: {
        fontSize: "35px",
        opacity: "0.8",
        cursor: "pointer",
    },
    barTitle: {
        marginLeft: "15px",
        fontSize: "23px",
        fontWeight: "510"
    },
    rightSideBar: {
        marginRight: "10px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
    },
}));

export default function Portfolio() {
    const theme = useTheme();
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const { auth, project, team: teamReducer } = useSelector((state) => state);
    const { user, userProfile } = auth;
    let { invitations: allInvitations } = useSelector((state) => state.team);
    const { teamIds, sortedProjectTeamIds, teamDictionary } = teamReducer;
    const userId = user?._id;

    const [searchQuery, setSearchQuery] = useState("");
    const [rows, setRows] = React.useState([]);
    const [stateChange, setStateChange] = useState(false);
    const [filteredRows, setFilteredRows] = useState([]);
    const [showInvitation, setShowInvitation] = useState(false);
    const [accessablePortfolios, setAccessablePortfolios] = useState([]);
    const [numberOfInvt, setNumberOfInvt] = useState(0)

    const matches = useMediaQuery("(max-width:1300px)");
    const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));


    useEffect(() => {
        getAccessablePortfolios()
    }, [])

    const getAccessablePortfolios = async () => {
        await getPortfolioByProfile({ profileId: auth?.user?.profile })
            .then((portfolios) => {
                let restructuredPortfolios = [];

                portfolios && portfolios.length > 0 && portfolios.map((portfolio) => {
                    let userRoles = portfolio?.accessWithRole
                    let role = ""

                    userRoles && userRoles.length > 0 && userRoles.map((userRole) => {
                        if (userRole?.user?._id === user?.profile) {
                            role = userRole?.role
                        }
                    })

                    const newObj = {
                        ...portfolio,
                        userRole: role
                    }

                    restructuredPortfolios.push(newObj)
                })


                setAccessablePortfolios(restructuredPortfolios)
                setFilteredRows(restructuredPortfolios)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const addNewlyCreatedPortfolio = async (newPortfolio) => {
        setStateChange(true)
        let updatedPortfolios = accessablePortfolios || []
        let userRoles = newPortfolio?.accessWithRole
        let role = ""

        userRoles && userRoles.length > 0 && userRoles.map((userRole) => {
            if (userRole?.user?._id === user?.profile) {
                role = userRole?.role
            }
        })

        const newObj = {
            ...newPortfolio,
            userRole: role
        }

        updatedPortfolios.push(newObj)
        setAccessablePortfolios(updatedPortfolios)
        setFilteredRows(updatedPortfolios)
        setStateChange(false)
    }


    console.log(accessablePortfolios)
    console.log(filteredRows)

    const onPortfolioNameChange = async (value) => {
        setSearchQuery(value)
        if (value) {
            let filteredPortfolios = []
            filteredRows.map((portfolio) => {
                let name = portfolio?.name || portfolio?.nickName
                const patt = new RegExp(value, "i");
                const res = patt.test(name);
                if (res) {
                    filteredPortfolios.push(portfolio)
                }
            });

            setAccessablePortfolios(filteredPortfolios)
        } else {
            setAccessablePortfolios(filteredRows)
        }
    }





    return (
        <div className={classes.root}>
            <div className={classes.tableCont} style={showInvitation ? { marginTop: "0px", } : { marginTop: "65px" }} >
                {showInvitation ? (<>
                    <div className={classes.headerBar} >
                        <div className={classes.leftSideBar} >
                            <KeyboardBackspaceIcon
                                onClick={() => {
                                    setShowInvitation(false)
                                }}
                                className={classes.backIcon}
                            />
                            <Typography
                                className={classes.barTitle}
                            >
                                Invitations
                            </Typography>
                        </div>
                        <div className={classes.rightSideBar} >
                        </div>
                    </div>

                    {/* <UserInvites
                        type={"Organization"}
                        addCreatedOne={addCreatedOne}
                    /> */}
                </>) : (<>
                    {/* <Tooltip
                        className={classes.reqNotification}
                        title="Invitations"
                        placement="top"
                        onClick={() => { setShowInvitation(true) }}
                    >
                        <IconButton>
                            <NotificationsNoneIcon style={{ color: theme.palette.primary.main, fontSize: "35px" }} />
                            <div className={classes.notificationNo} >{numberOfInvt}</div>
                        </IconButton>
                    </Tooltip> */}
                    <TextField
                        placeholder="Search By Name"
                        type="text"
                        variant="outlined"
                        size="small"
                        onChange={(e) => onPortfolioNameChange(e.target.value)}
                        value={searchQuery}
                        className={classes.searchTextBox}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />

                    <div className={classes.createBtn} >
                        <CreatePortfolioDialog
                            addNewlyCreatedPortfolio={addNewlyCreatedPortfolio}
                            walletId={user.wallet}
                        />
                    </div>

                    <PortfolioTable
                        accessablePortfolios={accessablePortfolios}
                    />
                </>)}
            </div>
        </div>
    );
}
