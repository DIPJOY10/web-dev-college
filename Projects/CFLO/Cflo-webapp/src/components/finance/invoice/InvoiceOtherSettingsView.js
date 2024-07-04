import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import TopBar from '../newactivity/topbar';
import { useDebounce } from 'react-use';
import { useGetTx } from '../hooks';
import { DescriptionInput, NewInputBase } from '../styles';
import TxSecondParty from '../transaction/secondParty';
import BillListEdit from '../BillList/bill.list.edit';
import TxBillListEdit from '../transaction/tx.bill.list.edit';
import TxLateFee from '../transaction/lateFee';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import DialogBillNo from '../bill/DialogBillNo';
import { constrcutArrayOfBillNo, getTxByWallet } from '../transaction/api';
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import useTotalBlocks from '../BillList/total.hook';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import configObject from '../../../config';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';



const useStyles = makeStyles((theme) => ({
    root: {


    },

    top: {
        marginTop: '2rem',
        marginBottom: '1rem',
    },

    row: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },

    col: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: "50px"
    },

    alignCenter: {
        alignItems: 'center',
    },

    justifyCenter: {
        justifyContent: 'center',
    },

    datePicker: {
        width: 150,
    },
    invoiceEditBody: {
        marginTop: "40px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    nextIcon: {
        transform: 'rotate(180deg)',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: "20px",
        fontWeight: "550",
        marginLeft: "20px",
        [theme.breakpoints.down('sm')]: {
            fontSize: "15px",
            fontWeight: "510",
            marginLeft: "0px",
        },
    },
    showSecondPartyInfoCont: {
        width: "80%",
    },
    showSecondPartyImgCont: {
        width: "15%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    showSecondPartyCont: {
        width: "320px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 10px"
    },
    paperSty: {
        marginTop: "30px",
        display: "flex",
        width: "99%",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "10px",
        paddingTop: "10px",
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            justifyContent: "center",
        },
    },
    mainCont: {
        width: "100%",
    },
    topCont: {
        display: "flex",
        margin: "5px",
        justifyContent: "space-around",
        width: "100%",
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    productAndCategory: {
        display: "flex",
        width: "33%",
        justifyContent: "space-around",
        marginBottom: "10px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            justifyContent: "space-between",
        },
    },
    itemCont: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('md')]: {
            display: "block",
        },
    },
    qtyAndRate: {
        display: "flex",
        width: "33%",
        justifyContent: "space-around",
        marginBottom: "10px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            justifyContent: "space-between",
        },
    },
    txAndQty: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "33%",
        [theme.breakpoints.down('md')]: {
            width: "49%",
        },
        [theme.breakpoints.down('sm')]: {
            width: "30%",
        },
    },
    rateAndTotal: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "65%",
        [theme.breakpoints.down('md')]: {
            width: "49%",
        },
        [theme.breakpoints.down('sm')]: {
            width: "68%",
        },
    },
    bottomCont: {
        marginLeft: " 10px"
    },
    taxAndTotal: {
        display: "flex",
        width: "33%",
        justifyContent: "space-around",
        marginBottom: "10px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            justifyContent: "space-between",
        },
    },
    paperContMin: {
        width: "320px",
        marginTop: "20px",
        padding: "10px 10px"
    },
    paperMemoContMin: {
        width: "90%",
        marginTop: "20px",
        padding: "10px 10px"
    },
    taxAndDiscountCont: {
        display: "flex",
        width: "300px",
        justifyContent: "space-between",
        padding: "10px 10px",
        marginBottom: "10px"
    },
    grandTotalCont: {
        width: "24rem",
        [theme.breakpoints.down('md')]: {
            marginTop: "30px",
            width: "96%",
        },
    },
    cellStyle: {
        padding: "10px 8px",
        opacity: "0.6",
        [theme.breakpoints.down('sm')]: {
            padding: "7px 4px",
        },
    },
    taxDiscountAndTotalCont: {
        width: "99%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        marginTop: "50px",
        [theme.breakpoints.down('md')]: {
            flexDirection : "column",
        },
    },
    journalEntryCont: {
        widht: "100%",
        border: "1px solid #E1E2E5",
        padding: "30px 20px",
        marginTop: "50px",
        marginBottom: "50px"
    },
    chartAccountTitle: {
        fontSize: "18px",
        fontWeight: "550",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
    },
}));

export default function InvoiceOtherSettingView(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const {
        tx, setTx, updateApi, walletId, setPageLevel
    } = props;
    const {
        col, invoiceEditBody, nextIcon, headerTitle,
        showSecondPartyInfoCont, showSecondPartyImgCont, showSecondPartyCont,
        paperSty, mainCont, topCont, productAndCategory, itemCont, qtyAndRate,
        txAndQty, rateAndTotal, taxAndTotal, bottomCont, paperContMin,
        paperMemoContMin, taxAndDiscountCont, grandTotalCont, cellStyle, taxDiscountAndTotalCont,
        journalEntryCont, chartAccountTitle
    } = classes;

    const { SubTotalView, TaxView, DiscountView, GrandTotalView } =
        useTotalBlocks({
            tx,
            updateApi
        });


    console.log(tx)

    const payNow = () => {
        const basicUrl = configObject?.BASE_URL;
        const goUrl = basicUrl + "payment/" + tx?._id
        window.open(goUrl);
    }





    return (
        <div className={col}>
            <CommonAppBar
                leftItems={[
                    (
                        <IconButton className={classes.iconButtonStyle} onClick={() => {
                            history.goBack()

                        }}>
                            <KeyboardBackspaceIcon style={{ fontSize: 30, color: theme.palette.primary }} />
                        </IconButton>
                    ),
                    (
                        <Typography className={headerTitle} >
                            {walletId === tx?.firstPartyWallet._id ? (<>Invoice</>) : (<>Bill</>)}
                            #{tx?.invNo}
                        </Typography>
                    )
                ]}
                rightItems={walletId !== tx?.firstPartyWallet._id && tx.status !== "Paid" && tx.status !== "Processing" && [
                    (
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<span className={nextIcon} ><KeyboardBackspaceIcon /></span>}
                            onClick={() => { payNow() }}
                        >
                            Pay Now
                        </Button>
                    )
                ]}
            />
            <div className={invoiceEditBody} >
                <div style={{ width: '95%' }} >

                    <Paper className={showSecondPartyCont} square variant={"outlined"} >
                        <div className={showSecondPartyImgCont} >
                            <Avatar alt="ProfilePic" src={walletId === tx?.firstPartyWallet._id ? tx?.secondParty?.parent?.displayPicture?.thumbUrl : tx?.firstParty?.parent?.displayPicture?.thumbUrl} />
                        </div>
                        <div className={showSecondPartyInfoCont} >
                            <Typography style={{ fontSize: "16px", fontWeight: "550" }} >{walletId === tx?.firstPartyWallet._id ? tx?.secondParty?.parent?.displayName : tx?.firstParty?.parent?.displayName}</Typography>
                            <Typography style={{ fontSize: "13px", opacity: "0.6" }} >{walletId === tx?.firstPartyWallet._id ? tx?.secondParty?.parent?.email : tx?.firstParty?.parent?.email}</Typography>
                        </div>
                    </Paper>

                    <Paper className={paperContMin} square variant={"outlined"} >
                        <Typography>Late Fees</Typography>
                        <div style={{ display: "flex" }} >
                            <Typography style={{ fontSize: "18px" }} >${tx?.lateFeeAmount}</Typography>
                            <Typography style={{ marginLeft: "10px", fontSize: "10px", opacity: "0.6", paddingTop: '8px' }} >Due {moment(tx?.dueDate).format("MMMM Do YYYY")}</Typography>
                        </div>
                    </Paper>

                    <Paper className={paperMemoContMin} square variant={"outlined"}  >
                        <Typography>Memo</Typography>
                        <Typography style={{ fontSize: "12px", opacity: "0.6" }} >{tx?.memo}</Typography>
                    </Paper>

                    <div>
                        {tx?.billList?.items.length > 0 && tx?.billList?.items.map((item) => (
                            <Paper className={paperSty} square variant={"outlined"} >
                                <div className={mainCont} >
                                    <div className={topCont} >
                                        <div className={productAndCategory} >
                                            <div className={itemCont} style={{ marginTop: "-5px", width: "49%" }} >
                                                <div>
                                                    <Typography style={{ opacity: "0.6" }} >Product/Services</Typography>
                                                    <Typography>{item?.name}</Typography>
                                                </div>
                                            </div>
                                            <div className={itemCont} style={{ marginTop: "-5px", width: "49%" }} >
                                                <div>
                                                    <Typography style={{ opacity: "0.6" }} >Category</Typography>
                                                    <Typography>{item?.chartAccount?.name}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={qtyAndRate} >
                                            <div className={txAndQty} >
                                                <div>
                                                    <Typography style={{ opacity: "0.6" }} >Qty</Typography>
                                                    <Typography>{item?.qTy}</Typography>
                                                </div>
                                            </div>
                                            <div className={rateAndTotal} >
                                                <div>
                                                    <Typography style={{ opacity: "0.6" }} >Rate</Typography>
                                                    <Typography>{item?.rate}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={taxAndTotal} >
                                            <div className={txAndQty}  >
                                                <div>
                                                    <Typography style={{ opacity: "0.6" }} >Tax</Typography>
                                                    <Typography>{item?.tax ? <><CheckIcon style={{ color: "green" }} /></> : <><CloseIcon style={{ color: "red" }} /></>}</Typography>
                                                </div>
                                            </div>
                                            <div className={rateAndTotal} >
                                                <div>
                                                    <Typography style={{ opacity: "0.6" }} >Total</Typography>
                                                    <Typography>{item?.rate * item?.qTy}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={bottomCont} >
                                        <div>
                                            <Typography style={{ opacity: "0.6" }} >Description</Typography>
                                            <Typography>{item?.description}</Typography>
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        ))}
                    </div>

                    <div className={taxDiscountAndTotalCont} >
                        <div>
                            {tx?.billList?.tax?.enabled && (
                                <Paper square variant={"outlined"} className={taxAndDiscountCont} >
                                    <Typography>Tax</Typography>
                                    <Typography>{tx?.billList?.tax?.type === "%" ? <>{tx?.billList?.tax?.percent}%</> : <>${tx?.billList?.tax?.amount}</>}</Typography>
                                </Paper>
                            )}
                            {tx?.billList?.discount?.enabled && (
                                <Paper square variant={"outlined"} className={taxAndDiscountCont} >
                                    <Typography>Discount</Typography>
                                    <Typography>{tx?.billList?.discount?.type === "%" ? <>{tx?.billList?.discount?.percent}%</> : <>${tx?.billList?.discount?.amount}</>}</Typography>
                                </Paper>
                            )}
                        </div>
                        <div className={grandTotalCont} >
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Sub Total</TableCell>
                                            <TableCell align="right">{SubTotalView}</TableCell>
                                        </TableRow>
                                        {tx?.type === "Bill" ? <></> : <>
                                            <TableRow>
                                                <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Tax</TableCell>
                                                <TableCell align="right">{TaxView}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Discount</TableCell>
                                                <TableCell align="right">{DiscountView}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Grand Total</TableCell>
                                                <TableCell align="right">{GrandTotalView}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={cellStyle} style={{ paddingLeft: "8px" }} align="left" >Late Fees</TableCell>
                                                <TableCell className={cellStyle} align="right">${tx?.lateFeeAmount}</TableCell>
                                            </TableRow>
                                        </>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    <div>
                        {walletId === tx?.firstPartyWallet._id ? (<div>
                            <div className={journalEntryCont} >
                                <div className={chartAccountTitle} >
                                    <span style={{ marginRight: "10px" }} >
                                        <AccountBalanceIcon style={{ color: '#4CACEF', fontSize: "25px" }} />
                                    </span>
                                    The category account where the amount was added after the payment completion
                                </div>
                                <Typography>{tx?.BankChartAccount?.name}</Typography>
                            </div>
                        </div>) : (
                            tx.status === "Paid" || tx.status === "Processing" ? (
                                <div className={journalEntryCont} >
                                    <div className={chartAccountTitle} >
                                        <span style={{ marginRight: "10px" }} >
                                            <AccountBalanceIcon style={{ color: '#4CACEF', fontSize: "25px" }} />
                                        </span>
                                        Current Status Of The Receipt
                                    </div>
                                    <Typography>{tx?.status}</Typography>
                                </div>
                            )  : (<div></div>)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

