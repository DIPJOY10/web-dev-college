import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {
    getAccessableProjectsAndOrgs,
    getDwollaBankAccountByProject,
    getAllDwollaBankAccounts,
    getDwollaAccountByUrl
} from '../payBackTx/api';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';



const useStyles = makeStyles((theme) => ({
    spaceBetween: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        position: "relative",
        left: "-20px",
        top: "-10px"
    },
    selectAcc: {
        minHeight: "50px",
        width: "100%",
        padding: "10px",
        paddingBottom: "0px",
        display: "flex",
        justifyContent: "space-between",
    },
    headerCont: {
        border: "1px solid #E1E2E5",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
    },
    accountListCont: {
        width: "100%",
        height: "230px",
        border: "1px solid #E1E2E5",
        overflow: "auto",
    },
    accountTypeCont: {
        display: 'flex',
        borderBottom: "1px solid #E1E2E5"
    },
    listItem: {
        borderBottom: "1px solid #E1E2E5",
        cursor: "pointer",
        backgroundColor: "rgb(242, 242, 242)"
    },
    accountTypeOptWithBorder: {
        fontSize: "13px",
        opacity: "0.6",
        marginLeft: "10px",
        borderBottom: "3px solid #33aff7",
        position: "relative",
        bottom: "-2px",
        paddingLeft: "3px",
        paddingRight: "3px",
        cursor: "pointer"
    },
    accountTypeOpt: {
        fontSize: "13px",
        opacity: "0.6",
        marginLeft: "10px",
        position: "relative",
        bottom: "-2px",
        paddingLeft: "3px",
        paddingRight: "3px",
        cursor: "pointer"
    },
    searchCont: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px"
    },
    searchRoot: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "90%",
    },
    searchInput: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    searchIconButton: {
        padding: 10,
    },
    payBtnCont: {
        width: "100%",
        minHeight: "40px",
        border: "1px solid #E1E2E5",
        borderBottomLeftRadius: "5px",
        borderBottomRightRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "0px",
        paddingRight: "15px",
    },
    createBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    dialogCont: {
        height: "250px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "column",
    },
    logoSty: {
        height: "30px",
        width: "auto"
    },
    logoAndDetailsCont: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    noteCont: {
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingBottom: "15px",
    }
}));

export default function DwollaAccountOptions(props) {

    const DateNow = new Date()
    const classes = useStyles();
    const history = useHistory();
    const { txId } = useParams();


    const {
        setSelectedDwollaAcc,
        selectedDwollaAcc,
        onBankAccountSelect,
        userprofile,
        walletId,
        user,
        tx,
        dwollaLogo
    } = props;

    const {
        selectAcc,
        accountListCont,
        accountTypeCont,
        listItem,
        accountTypeOptWithBorder,
        accountTypeOpt,
        searchCont,
        searchRoot,
        searchInput,
        searchIconButton,
        payBtnCont,
        createBtn,
        logoSty,
        logoAndDetailsCont,
        noteCont,
        headerCont
    } = classes;


    const [projectDwollaBankAccounts, setProjectDwollaBankAccounts] = useState([])
    const [accountType, setAccountType] = useState("personal");
    const [allAccessAbleProject, setAllAccessAbleProject] = useState([])
    const [searchedProject, setSearchedProject] = useState([])
    const [searchedOrg, setSearchedOrg] = useState([])

    const [personalDwollaBankAccounts, setPersonalDwollaBankAccounts] = useState([])
    const [allAccessAbleOrganization, setAllAccessAbleOrganization] = useState([])
    const [orgDwollaBankAccounts, setOrgDwollaBankAccounts] = useState([])

    const [searchTextProject, setSearchTextProject] = useState("")
    const [searchTextOrg, setSearchTextOrg] = useState("")
    const [showDetails, setShowDetails] = useState(false)


    const searchProjectAcc = async (data) => {
        setSearchTextProject(data)

        if (data.length > 2) {
            let resultProjects = []
            const lowerSearch = data.toLowerCase();
            allAccessAbleProject.map((project) => {
                const lowerProjectName = project.parent.displayName.toLowerCase();
                if (lowerProjectName.includes(lowerSearch)) {
                    resultProjects.push(project);
                }
            })
            setSearchedProject(resultProjects)
        }
    }


    const searchOrgAcc = async (data) => {
        setSearchTextOrg(data)

        if (data.length > 2) {
            let resultOrgs = []
            const lowerSearch = data.toLowerCase();
            allAccessAbleOrganization.map((org) => {
                const lowerOrgName = org.parent.displayName.toLowerCase();
                if (lowerOrgName.includes(lowerSearch)) {
                    resultOrgs.push(org);
                }
            })
            setSearchedOrg(resultOrgs)
        }
    }

    const getBankByProject = async (walletId) => {
        const resultProjectsWallets = [walletId]

        await getDwollaBankAccountByProject({ walletIds: resultProjectsWallets })
            .then((data) => {
                console.log(data)
                setProjectDwollaBankAccounts(data)
            })
            .catch((error) => {
                console.log(error)
            })
        setSearchedProject([])
    }


    const getBankByOrg = async (walletId) => {
        const resultOrgWallets = [walletId]

        await getDwollaBankAccountByProject({ walletIds: resultOrgWallets })
            .then((data) => {
                console.log(data)
                setOrgDwollaBankAccounts(data)
            })
            .catch((error) => {
                console.log(error)
            })
        setSearchedOrg([])
    }



    useEffect(() => {
        getAllDwollaBankAccounts({
            userWalletId: user?.wallet
        })
            .then((data) => {
                setPersonalDwollaBankAccounts(data.accounts)
                if (tx?.dwollaConfig?.receiverDwollaBankAcc) {
                    const url = tx?.dwollaConfig?.receiverDwollaBankAcc
                    getDwollaAccountByUrl({ url })
                        .then((account) => {
                            setSelectedDwollaAcc(account)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                } else {
                    setSelectedDwollaAcc(data?.defaultDwollaAcc)
                }
            })
            .catch(err => {
                console.log(err)
            })

        if (user) {
            getAccessableProjectsAndOrgs({
                userProfileId: userprofile
            })
                .then((allProjectsAndOrg) => {
                    setAllAccessAbleProject(allProjectsAndOrg?.accessableProjects)
                    setAllAccessAbleOrganization(allProjectsAndOrg?.accessableOrgs)
                    console.log(allProjectsAndOrg)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [])


    return (
        <>
            <div className={headerCont} >
                <div className={selectAcc} >
                    <div>
                        <Typography style={{ fontSize: "14px", color: "#51AFEE" }}>Selected Stripe Account</Typography>
                        <Typography style={{ fontSize: "15px", color: "green" }}>{selectedDwollaAcc?.name}</Typography>
                    </div>
                    {dwollaLogo &&
                        <div className={logoAndDetailsCont} >
                            <img className={logoSty} src={dwollaLogo} alt={"dwollaLogo"} />
                            {showDetails ? (
                                <Button style={{ padding: "0px" }} onClick={() => { setShowDetails(false); }} ><ArrowDropUpIcon style={{ fontSize: "30px" }} /></Button>
                            ) : (
                                <Button style={{ padding: "0px" }} onClick={() => { setShowDetails(true); }} ><ArrowDropDownIcon style={{ fontSize: "30px" }} /></Button>
                            )}
                        </div>
                    }
                </div>
                {showDetails &&
                    <div className={noteCont} >
                        <span style={{ color: "red" }} >*</span>Note : If you want to accept payment via Bank Account of your customer
                        you have to select a dwolla account which will accept the payment.
                        Otherwise the payment will be accepted by you default dwolla account
                    </div>
                }
            </div>





            <div className={accountListCont} >
                <div className={accountTypeCont} >
                    <Typography className={accountType === 'personal' ? accountTypeOptWithBorder : accountTypeOpt} onClick={() => { setAccountType("personal") }}  >Personal</Typography>
                    <Typography className={accountType === 'organization' ? accountTypeOptWithBorder : accountTypeOpt} onClick={() => { setAccountType("organization") }}  >Organization</Typography>
                    <Typography className={accountType === 'project' ? accountTypeOptWithBorder : accountTypeOpt} onClick={() => { setAccountType('project') }}  >Project</Typography>
                </div>
                {accountType === 'personal' ?
                    <List>
                        {personalDwollaBankAccounts && personalDwollaBankAccounts.map((dwollaBankAccount) => (
                            <ListItem className={listItem} onClick={() => { onBankAccountSelect(dwollaBankAccount) }} >
                                <ListItemText primary={dwollaBankAccount?.bankName} secondary={dwollaBankAccount?.name} />
                            </ListItem>
                        ))}
                    </List>
                    : null}
                {accountType === 'organization' ?
                    <>
                        <div className={searchCont} >
                            <Paper component="form" className={searchRoot}>
                                <InputBase
                                    value={searchTextOrg}
                                    className={searchInput}
                                    placeholder="Enter Organization Name"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                    onChange={(e) => searchOrgAcc(e.target.value)}
                                />
                                <IconButton type="submit" className={searchIconButton} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </div>

                        {searchedOrg.length > 0 ? <Typography style={{ fontSize: "13px", opacity: "0.6" }} >Select Organization</Typography> : null}
                        <List>
                            {searchedOrg && searchedOrg.map((org) => (
                                <ListItem className={listItem} onClick={() => { getBankByOrg(org?.wallet) }} >
                                    <ListItemText primary={org?.parent?.displayName} />
                                </ListItem>
                            ))}
                        </List>

                        {orgDwollaBankAccounts.length > 0 ? <Typography style={{ fontSize: "13px", opacity: "0.6" }} >Select Bank Account</Typography> : null}
                        <List>
                            {orgDwollaBankAccounts && orgDwollaBankAccounts.map((dwollaBankAccount) => (
                                <ListItem className={listItem} onClick={() => { onBankAccountSelect(dwollaBankAccount) }} >
                                    <ListItemText primary={dwollaBankAccount?.bankName} secondary={dwollaBankAccount?.name} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                    : null}



                {accountType === 'project' ?
                    <>
                        <div className={searchCont} >
                            <Paper component="form" className={searchRoot}>
                                <InputBase
                                    value={searchTextProject}
                                    className={searchInput}
                                    placeholder="Enter Project Name"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                    onChange={(e) => searchProjectAcc(e.target.value)}
                                />
                                <IconButton type="submit" className={searchIconButton} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </div>

                        {searchedProject.length > 0 ? <Typography style={{ fontSize: "13px", opacity: "0.6" }} >Select Projects</Typography> : null}
                        <List>
                            {searchedProject && searchedProject.map((project) => (
                                <ListItem className={listItem} onClick={() => { getBankByProject(project?.wallet) }} >
                                    <ListItemText primary={project?.parent?.displayName} />
                                </ListItem>
                            ))}
                        </List>

                        {projectDwollaBankAccounts.length > 0 ? <Typography style={{ fontSize: "13px", opacity: "0.6" }} >Select Bank Account</Typography> : null}
                        <List>
                            {projectDwollaBankAccounts && projectDwollaBankAccounts.map((dwollaBankAccount) => (
                                <ListItem className={listItem} onClick={() => { onBankAccountSelect(dwollaBankAccount) }} >
                                    <ListItemText primary={dwollaBankAccount?.bankName} secondary={dwollaBankAccount?.name} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                    : null}
            </div>
            {/* <div className={payBtnCont} >
                <div></div>
                <div>
                    <Button variant="outlined" color="primary" className={createBtn} >
                        <AddIcon style={{ fontSize: "30px", marginRight: "5px" }} /> Add New
                    </Button>
                </div>
            </div> */}
        </>
    );
}
