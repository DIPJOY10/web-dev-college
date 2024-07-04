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
    getWallet,
    getPlaidBankAccounts,
    createDwollaCustomerForPal,
    getDwollaCustomerForPalAndAnonymousUser,
    getDwollaBankAccount
} from './api';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddDwollaBank from '../dwolla/add.dwolla.bank'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';


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
        border: "1px solid #E1E2E5",
        minHeight: "50px",
        width: "100%",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        padding: "10px",
    },
    accountListCont: {
        width: "100%",
        height: "230px",
        borderLeft: "1px solid #E1E2E5",
        borderRight: "1px solid #E1E2E5",
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
    }
}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function DwollaBankPayment(props) {

    const DateNow = new Date()
    const classes = useStyles();
    const history = useHistory();
    const { txId } = useParams();
    const {
        onBack, selectedDwollaAcc, personalDwollaBankAccounts, onBankAccountSelect,
        pay, userprofile, walletId, user, tx, setPersonalDwollaBankAccounts
    } = props;
    const {
        spaceBetween, selectAcc, accountListCont, accountTypeCont, listItem,
        accountTypeOptWithBorder, accountTypeOpt, searchCont, searchRoot,
        searchInput, searchIconButton, payBtnCont, createBtn, dialogCont
    } = classes;
    const [projectDwollaBankAccounts, setProjectDwollaBankAccounts] = useState([])
    const [accountType, setAccountType] = useState("personal");
    const [allAccessAbleProject, setAllAccessAbleProject] = useState([])
    const [searchedProject, setSearchedProject] = useState([])
    const [searchedOrg, setSearchedOrg] = useState([])

    const [allAccessAbleOrganization, setAllAccessAbleOrganization] = useState([])
    const [orgDwollaBankAccounts, setOrgDwollaBankAccounts] = useState([])


    const [searchTextProject, setSearchTextProject] = useState("")
    const [searchTextOrg, setSearchTextOrg] = useState("")



    const [wallet, setWallet] = useState(null)
    const [dwollaCustomer, setDwollaCustomer] = useState(null)
    const [plaidBankAccounts, setPlaidBankAccounts] = useState(null)

    const [open, setOpen] = React.useState(false);
    const [openErr, setOpenErr] = React.useState(false);

    const fullName = tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstParty?.parent?.displayName : tx?.secondParty?.parent?.displayName
    const fNamev = fullName.substring(0, fullName.indexOf(' '));
    const lNamev = fullName.substring(fullName.indexOf(' ') + 1);

    const [fName, setFName] = useState(fNamev)
    const [lName, setLName] = useState(lNamev)
    const [email, setEmail] = useState( tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstParty?.parent?.email : tx?.secondParty?.parent?.email)
    const [errMsg, setErrMsg] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenErr = () => {
        setOpenErr(true);
    };

    const handleCloseErr = () => {
        setOpenErr(false);
    };

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

            getWallet({ wallet: walletId, type: "User" })
                .then((wallet) => {

                    getPlaidBankAccounts({ walletId })
                        .then((accounts) => {

                            setPlaidBankAccounts(accounts)

                        })
                        .catch((err) => {
                            console.log(err)
                        })

                    console.log(wallet)

                    const newWallet = {
                        ...wallet,
                        dwollaCustomer: wallet?.dwollaCustomer?._id
                    }

                    setWallet(newWallet)
                    setDwollaCustomer(wallet?.dwollaCustomer)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {

            getDwollaCustomerForPalAndAnonymousUser({
                walletId: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstPartyWallet?._id : tx?.secondPartyWallet?._id,
                txId: tx._id
            })
                .then((wallet) => {
                    getDwollaBankAccount({
                        walletId: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstPartyWallet?._id : tx?.secondPartyWallet?._id,
                        dwollaCustomerId: wallet?.dwollaCustomer?._id
                    })
                        .then((dwollaBankAccount) => {

                            console.log(dwollaBankAccount)

                            setPersonalDwollaBankAccounts(dwollaBankAccount)

                        })

                    console.log(wallet)

                    const newWallet = {
                        ...wallet,
                        dwollaCustomer: wallet?.dwollaCustomer?._id
                    }

                    setWallet(newWallet)
                    setDwollaCustomer(wallet?.dwollaCustomer)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [])


    const onCreateDwollaAccount = () => {
        createDwollaCustomerForPal({
            fName: fName,
            lName: lName,
            email: email,
            walletId: tx?.type === "Payment" || tx?.type === "Bill" ? tx?.firstPartyWallet?._id : tx?.secondPartyWallet?._id,
            txId: tx._id
        })
            .then((wallet) => {

                console.log(wallet);

                if (wallet?.status === 200) {

                    console.log(wallet.data)
                    const newWallet = {
                        ...wallet?.data,
                        dwollaCustomer: wallet?.data?.dwollaCustomer?._id
                    }
                    setWallet(newWallet)
                    setDwollaCustomer(wallet?.data?.dwollaCustomer)

                } else {
                    console.log(wallet?.data)
                    setErrMsg(wallet.data.message)
                    setOpenErr(true)
                }
                handleClose()
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return (
        <>
            <div className={spaceBetween} >
                <ArrowBackIcon onClick={() => onBack()} style={{ cursor: "pointer" }} />
                <div></div>
            </div>
            <div className={selectAcc} >
                <Typography style={{ fontSize: "17px", color: "green" }}>{selectedDwollaAcc?.bankName}</Typography>
                <Typography style={{ fontSize: "15px", color: "green" }}>{selectedDwollaAcc?.name}</Typography>
            </div>
            <div className={accountListCont} >
                <Typography style={{ color: "#79C3F0", fontSize: "14px" }} >Select Bank Account</Typography>
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
            <div className={payBtnCont} >
                <div>
                    {user ?
                        (wallet && dwollaCustomer ?
                            <AddDwollaBank
                                wallet={wallet}
                                plaidBankAccounts={plaidBankAccounts}
                                dwollaCustomer={dwollaCustomer}
                                paymentPage={true}
                                txId={txId}
                            />
                            : null)
                        : (
                            wallet && dwollaCustomer ?
                                <AddDwollaBank
                                    wallet={wallet}
                                    plaidBankAccounts={plaidBankAccounts}
                                    dwollaCustomer={dwollaCustomer}
                                    paymentPage={true}
                                    txId={txId}
                                />
                                :
                                <div>
                                    <Button onClick={handleClickOpen} variant="outlined" color="primary" className={createBtn} >
                                        <PersonAddIcon style={{ fontSize: "30px", marginRight: "5px" }} /> Create Account
                                    </Button>
                                </div>

                        )}
                </div>
                {selectedDwollaAcc ?
                    <Button onClick={() => pay()} variant="contained" color="primary" style={{ height: "30px" }} >Pay</Button>
                    :
                    <Button variant="contained" color="primary" style={{ height: "30px" }} disabled>Pay</Button>
                }
            </div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Dwolla Account</DialogTitle>
                <DialogContent className={dialogCont} >
                    <TextField
                        id="outlined-password-input"
                        label="First Name"
                        autoComplete="current-password"
                        variant="outlined"
                        value={fName}
                        onChange={(e) => setFName(e.target.value)}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Last Name"
                        autoComplete="current-password"
                        variant="outlined"
                        value={lName}
                        onChange={(e) => setLName(e.target.value)}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Mail ID"
                        autoComplete="current-password"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onCreateDwollaAccount} color="primary">
                        Next
                    </Button>
                </DialogActions>
            </Dialog>



            <Dialog
                open={openErr}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseErr}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title" style={{ color: 'red' }} >{errMsg}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseErr} color="primary">
                        ok
                    </Button>
                </DialogActions>
            </Dialog>




        </>
    );
}
