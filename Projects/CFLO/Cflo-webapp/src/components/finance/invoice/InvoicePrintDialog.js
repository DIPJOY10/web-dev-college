import React, { useState, useEffect, useRef } from "react";
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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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
import { updateTx, updateTxTemplate } from "../transaction/api";
import ReactToPrint from 'react-to-print';
import useTotalBlocks from "../BillList/total.hook";



const useStyles = makeStyles((theme) => ({
    paper: {
        minWidth: "70vw",
        [theme.breakpoints.down('md')]: {
            minWidth: '98vw'
        },
    },
    titleCont: {
        borderBottom: "1px solid #E1E2E5"
    },
    actionCont: {
        borderTop: "1px solid #E1E2E5"
    },
    dialogCont: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "50px 0px"
    },
    pdfCont: {
        width: "800px",
        padding: "8px 15px",
        paddingLeft: "25px",
    },
    logoCont: {
        fontSize: "35px",
        fontWeight: "700",
        color: theme.palette.primary.main
    },
    compName: {
        fontSize: "17px",
        fontWeight: "550",
    },
    invoiceDataCont: {
        width: "100%",
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "45px"
    },
    contLeft: {
        width: "65%",
        height: "100%",
        backgroundColor: theme.palette.primary.main,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
        paddingLeft: "15px",
        "& p": {
            fontSize: "23px",
            fontWeight: "550"
        }
    },
    contRight: {
        width: "35%",
        height: "100%",
        backgroundColor: "#4d4c4c",
        color: "white",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "column",
        paddingLeft: "15px",
        "& p": {
            fontSize: "15px"
        }
    },
    allAddressCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "45px"
    },
    addressCont: {
        width: "42%"
    },
    addHeader: {
        borderBottom: "2px solid black",
        fontSize: "16px",
        fontWeight: "550"
    },
    tableCont: {
        width: "100%",
        border: "1px solid black",
        borderCollapse: "collapse",
        marginTop: "40px"
    },
    headerRow: {
        backgroundColor: "#4d4c4c",
        color: "white",
        height: "30px"
    },
    header_title: {
        padding: "0px",
        height: "25px",
        padding: "0px",
        fontSize: "15px",
        fontWeight: "400"
    },
    displayFlex: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "-1px"
    },
    noteCont: {
        width: "70%",
        padding: '10px',
        border: "1px solid #E1E2E5",
    },
}));

function InvoicePrintDialog(props) {
    const {
        openPrint, setOpenPrint, tx, updateApi
    } = props;
    const componentRef = useRef();
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const [openDialog, setOpenDialog] = useState(false)

    const { SubTotalView, TaxView, DiscountView, GrandTotalView } =
        useTotalBlocks({
            tx,
            updateApi
        });

    useEffect(() => {
        setOpenDialog(openPrint)
    }, [openPrint])

    const handleClose = () => {
        setOpenDialog(false)
        setOpenPrint(false)
    }

    const getPageMargins = () => {
        return `@page { margin: 10px 5px 30px 5px !important; }`;
    };

    return (
        <Dialog
            open={openDialog}
            classes={{ paper: classes.paper }}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle className={classes.titleCont} >{`Print`}</DialogTitle>
            <DialogContent className={classes.dialogCont} >
                <div className={classes.pdfCont} ref={componentRef} >
                    <style>{getPageMargins()}</style>
                    <div>
                        <p className={classes.logoCont} >
                            {tx?.firstPartyWallet?.printLogo?.url ? (
                                <img
                                    src={tx?.firstPartyWallet?.printLogo?.url}
                                    style={{
                                        height: "70px",
                                        width: "auto"
                                    }}
                                />
                            ) : (
                                <i>LOGO</i>
                            )}
                        </p>
                        <p className={classes.compName} style={{ marginTop: "-7px" }} >{tx?.firstParty?.parent?.displayName || "Company Name"}</p>
                        <p style={{ fontSize: "14px", fontWeight: "510" }} >Company No : {tx?.firstParty?.parent?.companyNo || "XX-XXXXX"}</p>
                    </div>

                    <div className={classes.invoiceDataCont} >
                        <div className={classes.contLeft} >
                            <p>INVOICE NO : </p>
                            <p>#{tx?.invNo}</p>
                        </div>
                        <div className={classes.contRight} >
                            <p>Date : {new Date(tx?.createdAt).getMonth() + 1 + "/" + new Date(tx?.createdAt).getDate() + "/" + new Date(tx?.createdAt).getFullYear()}</p>
                            <p>Due Date : <span style={{ fontSize: "16px", fontWeight: "550" }} >{new Date(tx?.dueDate).getMonth() + 1 + "/" + new Date(tx?.dueDate).getDate() + "/" + new Date(tx?.dueDate).getFullYear()}</span></p>
                            <p>Term : {tx?.term?.name}</p>
                        </div>
                    </div>

                    <div className={classes.allAddressCont} >
                        <div className={classes.addressCont} >
                            <p className={classes.addHeader} >Bill From:</p>
                            <p>{tx?.firstParty?.parent?.displayName || "Company Name"}</p>
                            <p>{tx?.firstParty?.parent?.address?.streetAddress || "Street Address"}</p>
                            <p>{tx?.firstParty?.parent?.address?.city || "City"}{" "}
                                {tx?.firstParty?.parent?.address?.region || "State"}{" "}
                                {tx?.firstParty?.parent?.address?.zip || "ZIP Code"}
                            </p>
                            <p>{tx?.firstParty?.parent?.address?.country || "Country"}</p>
                            <p>T:{" "}{tx?.firstParty?.parent?.phone}</p>
                        </div>
                        <div className={classes.addressCont} >
                            <p className={classes.addHeader} >Bill To:</p>
                            <p>{tx?.secondParty?.parent?.displayName || "Company Name"}</p>
                            <p>{tx?.secondParty?.parent?.address?.streetAddress || "Street Address"}</p>
                            <p>{tx?.secondParty?.parent?.address?.city || "City"}{" "}
                                {tx?.secondParty?.parent?.address?.region || "State"}{" "}
                                {tx?.secondParty?.parent?.address?.zip || "ZIP Code"}
                            </p>
                            <p>{tx?.secondParty?.parent?.address?.country || "Country"}</p>
                            <p>T:{" "}{tx?.secondParty?.parent?.phone}</p>
                        </div>
                    </div>

                    <table className={classes.tableCont} >
                        <tr
                            className={classes.headerRow}
                            style={{
                                border: "1px solid black",
                                borderCollapse: "collapse"
                            }}
                        >
                            <th className={classes.header_title} style={{ width: "40px" }}  >#</th>
                            <th className={classes.header_title} style={{ width: "100px" }} >Item Name</th>
                            <th className={classes.header_title} style={{ width: "140px" }} >Description</th>
                            <th className={classes.header_title} style={{ width: "60px" }} >Qty</th>
                            <th className={classes.header_title} style={{ width: "80px" }} >Unit Price</th>
                            <th className={classes.header_title} style={{ width: "90px" }} >Total</th>
                        </tr>
                        {tx && tx?.billList?.items && tx?.billList?.items.length > 0 && tx?.billList?.items.map((item, i) => (
                            <tr style={{
                                height: "30px",
                                border: "1px solid black",
                                borderCollapse: "collapse"
                            }} >
                                <td style={{
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{i + 1}</td>
                                <td style={{
                                    textAlign: "left",
                                    paddingLeft: "5px",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{item?.name}</td>
                                <td style={{
                                    textAlign: "left",
                                    paddingLeft: "5px",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{item?.description}</td>
                                <td style={{
                                    textAlign: "right",
                                    paddingRight: "5px",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{item?.qTy}</td>
                                <td style={{
                                    textAlign: "right",
                                    paddingRight: "5px",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >${item?.rate}</td>
                                <td style={{
                                    textAlign: "right",
                                    paddingRight: "5px",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >

                                    ${parseInt(item?.qTy) * parseInt(item?.rate)}

                                    {item?.tax ? (<span style={{ fontSize: "14px", fontWeight: "550"}}  >{"(T)"}</span>) : null}
                                </td>
                            </tr>
                        ))}
                    </table>


                    {/* total related details */}

                    <div className={classes.displayFlex} >
                        <div></div>
                        <table
                            style={{
                                width: "250px",
                                border: "1px solid black",
                                borderCollapse: "collapse",
                            }}
                        >
                            <tr style={{
                                height: "30px",
                                border: "1px solid black",
                                borderCollapse: "collapse",
                                    fontSize: "12px"
                            }} >
                                <td style={{
                                    width: "119px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    backgroundColor: "#4d4c4c",
                                    color: "white",
                                    fontSize: "12px"
                                }} >SUBTOTAL</td>
                                <td style={{
                                    width: "134px",
                                    textAlign: "right",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{SubTotalView}</td>
                            </tr>
                        </table>
                    </div>

                    <div className={classes.displayFlex} >
                        <div></div>
                        <table
                            style={{
                                width: "250px",
                                border: "1px solid black",
                                borderCollapse: "collapse",
                            }}
                        >
                            <tr style={{
                                height: "30px",
                                border: "1px solid black",
                                borderCollapse: "collapse"
                            }} >
                                <td style={{
                                    width: "210px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    backgroundColor: "#4d4c4c",
                                    color: "white",
                                    fontSize: "12px"
                                }} >DISCOUNT RATE</td>
                                <td style={{
                                    width: "89px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >
                                    {tx?.billList?.tax?.type === "%" ? (
                                        <>{tx?.billList?.tax?.percent}%</>
                                    ) : (
                                        <>${tx?.billList?.tax?.amount}</>
                                    )}
                                </td>
                                <td style={{
                                    width: "119px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    backgroundColor: "#4d4c4c",
                                    color: "white",
                                    fontSize: "12px"
                                }} >DISCOUNT</td>
                                <td style={{
                                    width: "134px",
                                    textAlign: "right",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{DiscountView}</td>
                            </tr>
                        </table>
                    </div>

                    <div className={classes.displayFlex} >
                        <div></div>
                        <table
                            style={{
                                width: "250px",
                                border: "1px solid black",
                                borderCollapse: "collapse",
                            }}
                        >
                            <tr style={{
                                height: "30px",
                                border: "1px solid black",
                                borderCollapse: "collapse"
                            }} >
                                <td style={{
                                    width: "210px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    backgroundColor: "#4d4c4c",
                                    color: "white",
                                    fontSize: "12px"
                                }} >TAX RATE</td>
                                <td style={{
                                    width: "89px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >
                                    {tx?.billList?.discount?.type === "%" ? (
                                        <>{tx?.billList?.discount?.percent}%</>
                                    ) : (
                                        <>${tx?.billList?.discount?.amount}</>
                                    )}
                                </td>
                                <td style={{
                                    width: "119px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    backgroundColor: "#4d4c4c",
                                    color: "white",
                                    fontSize: "12px"
                                }} >TAX</td>
                                <td style={{
                                    width: "134px",
                                    textAlign: "right",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{TaxView}</td>
                            </tr>
                        </table>
                    </div>


                    <div className={classes.displayFlex} >
                        <div></div>
                        <table
                            style={{
                                width: "250px",
                                border: "1px solid black",
                                borderCollapse: "collapse",
                            }}
                        >
                            <tr style={{
                                height: "30px",
                                border: "1px solid black",
                                borderCollapse: "collapse"
                            }} >
                                <td style={{
                                    width: "119px",
                                    textAlign: "center",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    backgroundColor: "#4d4c4c",
                                    color: "white",
                                    fontSize: "12px"
                                }} >GRAND TOTAL</td>
                                <td style={{
                                    width: "134px",
                                    textAlign: "right",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    fontSize: "12px"
                                }} >{GrandTotalView}</td>
                            </tr>
                        </table>
                    </div>

                    <p style={{ fontSize: "14px", fontWeight: "400" }} >Memo</p>
                    <div className={classes.noteCont} >
                        {tx?.memo}
                    </div>

                    <p style={{ fontSize: "14px", fontWeight: "400" }} >Note</p>
                    <div className={classes.noteCont} >
                        {tx?.firstPartyWallet?.note}
                    </div>

                    <div style={{ marginTop: "50px" }} >
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: "30px",
                                fontWeight: "700"
                            }}
                        >Thank You For Your Business!</p>
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: "13px",
                                fontWeight: "400"
                            }}
                        >If you have questions about your order, you can email us at{" "}
                            <a
                                target="_blank"
                                href={`mailto:${tx?.firstParty?.parent?.email}`}
                            >
                                {tx?.firstParty?.parent?.email}
                            </a>
                        </p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions className={classes.actionCont} >
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                <ReactToPrint
                    trigger={() => (
                        <Button color="primary" autoFocus>
                            Print
                        </Button>
                    )}
                    content={() => componentRef.current}
                />
            </DialogActions>
        </Dialog>
    );
}

export default InvoicePrintDialog;
