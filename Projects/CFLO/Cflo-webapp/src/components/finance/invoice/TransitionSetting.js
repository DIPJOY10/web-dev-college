import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import BusinessIcon from "@material-ui/icons/Business";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import TextField from '@material-ui/core/TextField';
import {
    CircularProgress,
    Divider,
    IconButton,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from "@material-ui/core/Drawer";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PrintIcon from '@material-ui/icons/Print';
import { updateTx, updateTxTemplate, projectUpdateForTx, orgUpdateForTx, userUpdateForTx, walletUpdateForTx } from "../transaction/api";
import FileUploadButton from "../../file/Uploader/FileUploadButton";


const useStyles = makeStyles({
    settingCont: {
        width: "350px",
        height: "100vh"
    },
    settingHeader: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px 20px"
    },
    heading: {
        fontSize: "17px",
        fontWeight: "550"
    },
    iconPosition: {
        marginRight: "6px",
        position: "relative",
        top: "6px"
    },
    actionCont: {
        marginTop: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addrssCont: {
        width: "100%",
        padding: "10px",
        border: "1px solid #E1E2E5",
        marginBottom: "20px"
    },
    displayFlex: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

});

function TransitionSetting(props) {
    const {
        txNos,
        tx,
        setTx,
        type,
        maxNo,
        setMaxNo,
        walletId,
        setLoadingBool
    } = props;
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { createdFileIds } = useSelector((state) => state.file);
    const [openDrawer, setOpenDrawer] = useState(false)
    const [isLogoUpload, setIsLogoUpload] = useState(false)

    const [newBillNo, setNewBillNo] = useState();
    const [defaultCounter, setDefaultCounter] = useState();
    const [check, setCheck] = useState(false);
    const [checkCounter, setCheckCounter] = useState(false);

    const [bFCompanyName, setBFCompanyName] = useState("");
    const [bFCompanyNo, setBFCompanyNo] = useState("");
    const [mail, setMail] = useState("");
    const [note, setNote] = useState("");
    const [bFStreetAdd, setBFStreetAdd] = useState("");
    const [bFCity, setBFCity] = useState("");
    const [bFState, setBFState] = useState("");
    const [bFZipCode, setBFZipCode] = useState("");
    const [bFCountry, setBFCountry] = useState("");
    const [bFPhoneNo, setBFPhoneNo] = useState("");

    const [bTCompanyName, setBTCompanyName] = useState("");
    const [bTStreetAdd, setBTStreetAdd] = useState("");
    const [bTCity, setBTCity] = useState("");
    const [bTState, setBTState] = useState("");
    const [bTZipCode, setBTZipCode] = useState("");
    const [bTCountry, setBTCountry] = useState("");
    const [bTPhoneNo, setBTPhoneNo] = useState("");

    useEffect(() => {
        setBFCompanyName(tx?.firstParty?.parent?.displayName || "")
        setBFCompanyNo(tx?.firstParty?.parent?.companyNo || "")
        setBFStreetAdd(tx?.firstParty?.parent?.address?.streetAddress || "")
        setBFCity(tx?.firstParty?.parent?.address?.city || "")
        setBFState(tx?.firstParty?.parent?.address?.region || "")
        setBFZipCode(tx?.firstParty?.parent?.address?.zip || "")
        setBFCountry(tx?.firstParty?.parent?.address?.country || "")
        setBFPhoneNo(tx?.firstParty?.parent?.phone || "")
        setMail(tx?.firstParty?.parent?.email || "")
        setNote(tx?.firstPartyWallet?.note || "")

        setBTCompanyName(tx?.secondParty?.parent?.displayName || "")
        setBTStreetAdd(tx?.secondParty?.parent?.address?.streetAddress || "")
        setBTCity(tx?.secondParty?.parent?.address?.city || "")
        setBTState(tx?.secondParty?.parent?.address?.region || "")
        setBTZipCode(tx?.secondParty?.parent?.address?.zip || "")
        setBTCountry(tx?.secondParty?.parent?.address?.country || "")
        setBTPhoneNo(tx?.secondParty?.parent?.phone || "")
    }, [tx])


    function handleDrawerToggle() {
        setOpenDrawer(!openDrawer);
    }

    const setValue = (value) => {
        setCheck(false);
        txNos.map((txBill) => {
            if (txBill == value) {
                setCheck(true);
                return;
            }
        })
        if (value > maxNo) {
            setMaxNo(value)
            if (defaultCounter < value) {
                setCheckCounter(true);
            }
        }
        setNewBillNo(value);
    }

    const setDefaultCounterValue = (value) => {
        setCheckCounter(false);
        if (value < maxNo) {
            setCheckCounter(true);
        }
        setDefaultCounter(value);
    }



    const onSubmit = async () => {
        setLoadingBool(true)
        if (type === "Bill") {
            tx.billNo = newBillNo;
            await updateTx({
                billNo: newBillNo,
                _id: tx._id,
                type: type,
                defaultCounter: { billCounter: defaultCounter },
                editCounter: true,
                walletId: walletId
            })
        } else if (type === "Invoice") {
            tx.invNo = newBillNo;
            await updateTx({
                invNo: newBillNo,
                _id: tx._id,
                type: type,
                defaultCounter: { invoiceCounter: defaultCounter },
                editCounter: true,
                walletId: walletId
            })
        } else if (type === "InvoiceTemplate") {
            tx.invNo = newBillNo;
            await updateTxTemplate({
                invNo: newBillNo,
                _id: tx._id,
                type: "Invoice",
                defaultCounter: { templateInvCounter: defaultCounter },
                editCounter: true,
                walletId: walletId
            })
        } else if (type === "BillTemplate") {
            tx.invNo = newBillNo;
            await updateTxTemplate({
                billNo: newBillNo,
                _id: tx._id,
                type: "Bill",
                defaultCounter: { templateBillCounter: defaultCounter },
                editCounter: true,
                walletId: walletId
            })
        }

        setTx(tx);
        setDefaultCounter()
        setNewBillNo()
        setLoadingBool(false)
    }

    console.log(createdFileIds)


    useEffect(() => {
        if (createdFileIds.length > 0 && isLogoUpload) {
            uploadImg(createdFileIds)
        }
    }, [createdFileIds])


    const uploadImg = async (type) => {

        console.log("createdFileIds", createdFileIds)

        console.log(type)
        await walletUpdateForTx({
            walletId: tx?.firstPartyWallet?._id,
            printLogo: createdFileIds[0]
        })
            .then((data) => {
                let printLogo = data.printLogo
                const newTx = tx;
                newTx.firstPartyWallet.printLogo = printLogo

                setTx(newTx)

                console.log(data)
            })
            .catch((err) => {
                console.log(err);
            })

        dispatch({ type: "FileUploadReset" });
        setIsLogoUpload(false)
    }

    const checkAndUpdate = async () => {
        setLoadingBool(true)

        if (tx?.firstParty?.parent?.displayName !== bFCompanyName ||
            tx?.firstParty?.parent?.companyNo !== bFCompanyNo ||
            tx?.firstParty?.parent?.address?.streetAddress !== bFStreetAdd ||
            tx?.firstParty?.parent?.address?.city !== bFCity ||
            tx?.firstParty?.parent?.address?.region !== bFState ||
            tx?.firstParty?.parent?.address?.zip !== bFZipCode ||
            tx?.firstParty?.parent?.address?.country !== bFCountry ||
            tx?.firstParty?.parent?.phone !== bFPhoneNo ||
            tx?.firstParty?.parent?.email !== mail
        ) {
            if (tx?.firstParty?.parentModelName === "Project") {
                await projectUpdateForTx({
                    _id: tx?.firstParty?.parent?._id,
                    displayName: bFCompanyName,
                    companyNo: bFCompanyNo,
                    phone: bFPhoneNo,
                    email: mail,
                    address: {
                        streetAddress: bFStreetAdd,
                        city: bFCity,
                        region: bFState,
                        zip: bFZipCode,
                        country: bFCountry,
                        line1: bFStreetAdd,
                        postal_code: bFZipCode,
                        state: bFState,
                    }
                })
                    .then((data) => {
                        console.log(data)
                        const updatedTx = tx;
                        updatedTx.firstParty.parent = data

                        setTx(updatedTx)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else if (tx?.firstParty?.parentModelName === "Organization") {
                await orgUpdateForTx({
                    _id: tx?.firstParty?.parent?._id,
                    displayName: bFCompanyName,
                    companyNo: bFCompanyNo,
                    phone: bFPhoneNo,
                    email: mail,
                    address: {
                        streetAddress: bFStreetAdd,
                        city: bFCity,
                        region: bFState,
                        zip: bFZipCode,
                        country: bFCountry,
                        line1: bFStreetAdd,
                        postal_code: bFZipCode,
                        state: bFState,
                    }
                })
                    .then((data) => {
                        console.log(data)
                        const updatedTx = tx;
                        updatedTx.firstParty.parent = data

                        setTx(updatedTx)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else if (tx?.firstParty?.parentModelName === "User") {
                await userUpdateForTx({
                    _id: tx?.firstParty?.parent?._id,
                    displayName: bFCompanyName,
                    companyNo: bFCompanyNo,
                    phone: bFPhoneNo,
                    email: mail,
                    address: {
                        streetAddress: bFStreetAdd,
                        city: bFCity,
                        region: bFState,
                        zip: bFZipCode,
                        country: bFCountry,
                        line1: bFStreetAdd,
                        postal_code: bFZipCode,
                        state: bFState,
                    }
                })
                    .then((data) => {
                        console.log(data)
                        const updatedTx = tx;
                        updatedTx.firstParty.parent = data

                        setTx(updatedTx)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }

        if (tx?.secondParty?.parent?.displayName !== bTCompanyName ||
            tx?.secondParty?.parent?.address?.streetAddress !== bTStreetAdd ||
            tx?.secondParty?.parent?.address?.city !== bTCity ||
            tx?.secondParty?.parent?.address?.region !== bTState ||
            tx?.secondParty?.parent?.address?.zip !== bTZipCode ||
            tx?.secondParty?.parent?.address?.country !== bTCountry
        ) {
            if (tx?.secondParty?.parentModelName === "Pal") {

            }
        }

        if (tx?.firstPartyWallet?.note !== note) {
            await walletUpdateForTx({
                walletId: tx?.firstPartyWallet?._id,
                note: note
            })
                .then((data) => {
                    const newTx = tx;
                    newTx.firstPartyWallet.note = note

                    setTx(newTx)

                    console.log(data)
                })
                .catch((err) => {
                    console.log(err);
                })
        }

        setLoadingBool(false)
    }








    return (
        <>
            <IconButton
                onClick={() => { setOpenDrawer(true) }}
                style={{ marginRight: "10px", color: theme.palette.primary.main }}
            >
                <SettingsIcon />
            </IconButton>

            <Drawer
                variant="temporary"
                anchor={"right"}
                open={openDrawer}
                onClose={handleDrawerToggle}
                classes={{
                    paper: classes.settingCont,
                }}
                ModalProps={{
                    keepMounted: true
                }}
            >
                <div>
                    <div className={classes.settingHeader} >
                        <Typography style={{
                            fontSize: "20px",
                            fontWeight: "550"
                        }} >Settings</Typography>
                        <IconButton
                            onClick={() => {
                                setOpenDrawer(false)
                            }}
                            style={{ fontSize: "30px", fontWeight: "600", color: theme.palette.primary.main }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}><EditIcon className={classes.iconPosition} /> Invoice No</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{ width: '100%' }} >
                                <TextField
                                    autoFocus
                                    label={`${type} No`}
                                    type="number"
                                    value={newBillNo}
                                    onChange={(event) => { setValue(event.target.value) }}
                                    style={{ width: "100%" }}
                                />
                                <div style={{ marginBottom: "20px" }} >
                                    {check ? (<p style={{ color: 'red' }} >{type} No Already Exist</p>) : null}
                                </div>
                                <TextField
                                    autoFocus
                                    label={`Default ${type} Counter`}
                                    type="number"
                                    value={defaultCounter}
                                    onChange={(event) => { setDefaultCounterValue(event.target.value) }}
                                    style={{ width: "100%" }}
                                />
                                {checkCounter ? (<p style={{ color: 'red' }} >The number should be bigger then {maxNo - 1}</p>) : null}

                                <div className={classes.actionCont} >
                                    <div></div>
                                    {!check && !checkCounter && defaultCounter && newBillNo ?
                                        (
                                            <Button onClick={onSubmit} variant="contained" color="primary">
                                                Save
                                            </Button>
                                        )
                                        :
                                        (
                                            <Button variant="contained" color="primary" disabled >
                                                Save
                                            </Button>
                                        )
                                    }
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}><PrintIcon className={classes.iconPosition} /> Print</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <Typography style={{ fontSize: "15px", fontWeight: "550" }} >Invoice Logo</Typography>
                                <div
                                    className={classes.addrssCont}
                                    style={{
                                        marginBottom: "20px",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className={classes.displayFlex} >
                                        <Typography>Upload Logo</Typography>
                                        <span onClick={() => { setIsLogoUpload(true) }} >
                                            <FileUploadButton
                                                parentType='Message'
                                                used={false}
                                                parentId={null}
                                            />
                                        </span>
                                    </div>

                                    <img
                                        src={tx?.firstPartyWallet?.printLogo?.url}
                                        style={{
                                            height: "90px",
                                            width: "auto",
                                            marginLeft: "30px"
                                        }}
                                    />

                                </div>

                                <TextField
                                    id="standard-basic"
                                    label="Company Name"
                                    size="small"
                                    style={{ width: "100%", marginBottom: "15px" }}
                                    value={bFCompanyName}
                                    onChange={(e) => { setBFCompanyName(e.target.value) }}
                                />

                                <TextField
                                    id="standard-basic"
                                    label="Company Number"
                                    size="small"
                                    style={{ width: "100%", marginBottom: "15px" }}
                                    value={bFCompanyNo}
                                    onChange={(e) => { setBFCompanyNo(e.target.value) }}
                                />

                                <Typography style={{ fontSize: "15px", fontWeight: "550" }} >Bill From</Typography>
                                <div className={classes.addrssCont} >
                                    <TextField
                                        id="standard-basic"
                                        label="Street Address"
                                        size="small"
                                        style={{ width: "100%" }}
                                        value={bFStreetAdd}
                                        onChange={(e) => { setBFStreetAdd(e.target.value) }}
                                    />
                                    <div className={classes.displayFlex} >
                                        <TextField
                                            id="standard-basic"
                                            label="City"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bFCity}
                                            onChange={(e) => { setBFCity(e.target.value) }}
                                        />
                                        <TextField
                                            id="standard-basic"
                                            label="State"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bFState}
                                            onChange={(e) => { setBFState(e.target.value) }}
                                        />
                                    </div>
                                    <div className={classes.displayFlex} >
                                        <TextField
                                            id="standard-basic"
                                            label="ZIP Code"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bFZipCode}
                                            onChange={(e) => { setBFZipCode(e.target.value) }}
                                        />
                                        <TextField
                                            id="standard-basic"
                                            label="Country"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bFCountry}
                                            onChange={(e) => { setBFCountry(e.target.value) }}
                                        />
                                    </div>
                                    <TextField
                                        id="standard-basic"
                                        label="Phone No"
                                        size="small"
                                        style={{ width: "100%" }}
                                        value={bFPhoneNo}
                                        onChange={(e) => { setBFPhoneNo(e.target.value) }}
                                    />
                                </div>

                                <Typography style={{ fontSize: "15px", fontWeight: "550" }} >Bill To</Typography>
                                <div className={classes.addrssCont} >
                                    <TextField
                                        id="standard-basic"
                                        label="Company Name"
                                        size="small"
                                        style={{ width: "100%" }}
                                        value={bTCompanyName}
                                        onChange={(e) => { setBTCompanyName(e.target.value) }}
                                        disabled={tx?.secondParty?.parentModelName === "Pal" ? false : true}
                                    />

                                    <TextField
                                        id="standard-basic"
                                        label="Street Address"
                                        size="small"
                                        style={{ width: "100%" }}
                                        value={bTStreetAdd}
                                        onChange={(e) => { setBTStreetAdd(e.target.value) }}
                                        disabled={tx?.secondParty?.parentModelName === "Pal" ? false : true}
                                    />
                                    <div className={classes.displayFlex} >
                                        <TextField
                                            id="standard-basic"
                                            label="City"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bTCity}
                                            onChange={(e) => { setBTCity(e.target.value) }}
                                            disabled={tx?.secondParty?.parentModelName === "Pal" ? false : true}
                                        />
                                        <TextField
                                            id="standard-basic"
                                            label="State"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bTState}
                                            onChange={(e) => { setBTState(e.target.value) }}
                                            disabled={tx?.secondParty?.parentModelName === "Pal" ? false : true}
                                        />
                                    </div>
                                    <div className={classes.displayFlex} >
                                        <TextField
                                            id="standard-basic"
                                            label="ZIP Code"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bTZipCode}
                                            onChange={(e) => { setBTZipCode(e.target.value) }}
                                            disabled={tx?.secondParty?.parentModelName === "Pal" ? false : true}
                                        />
                                        <TextField
                                            id="standard-basic"
                                            label="Country"
                                            size="small"
                                            style={{ width: "47%" }}
                                            value={bTCountry}
                                            onChange={(e) => { setBTCountry(e.target.value) }}
                                            disabled={tx?.secondParty?.parentModelName === "Pal" ? false : true}
                                        />
                                    </div>
                                    <TextField
                                        id="standard-basic"
                                        label="Phone No"
                                        size="small"
                                        style={{ width: "100%" }}
                                        value={bTPhoneNo}
                                        onChange={(e) => { setBTPhoneNo(e.target.value) }}
                                        disabled={tx?.secondParty?.parentModelName === "Pal" ? false : true}
                                    />
                                </div>

                                <Typography style={{ fontSize: "15px", fontWeight: "550" }} >Note</Typography>
                                <div className={classes.addrssCont} >
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Note"
                                        multiline
                                        rows={4}
                                        defaultValue="Default Value"
                                        variant="outlined"
                                        style={{ width: "100%" }}
                                        value={note}
                                        onChange={(e) => { setNote(e.target.value) }}
                                    />
                                </div>

                                <Typography style={{ fontSize: "15px", fontWeight: "550" }} >Contact Mail</Typography>
                                <div className={classes.addrssCont} >
                                    <TextField
                                        id="standard-basic"
                                        label="Mail Id"
                                        size="small"
                                        style={{ width: "100%" }}
                                        value={mail}
                                        onChange={(e) => { setMail(e.target.value) }}
                                    />
                                </div>


                                <div className={classes.displayFlex} >
                                    <div></div>
                                    <Button
                                        onClick={() => { checkAndUpdate() }}
                                        variant="contained"
                                        color="primary">
                                        Save
                                    </Button>
                                </div>

                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </Drawer>
        </>
    );
}

export default TransitionSetting;
