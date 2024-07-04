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
import DialogBillNo from './DialogBillNo';
import { getTxByWallet, constrcutArrayOfBillNo } from '../transaction/api';
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import useTotalBlocks from '../BillList/total.hook';
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
    billEditBody: {
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
    paperMemoContMin: {
        width: "90%",
        marginTop: "20px",
        padding: "10px 10px"
    },
    grandTotalCont: {
        width: "24rem",
        [theme.breakpoints.down('md')]: {
            marginTop: "30px",
            width: "96%",
        },
    },
    taxDiscountAndTotalCont: {
        width: "99%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        marginTop: "50px",
    },
    journalEntryCont : {
        widht: "100%",
        border: "1px solid #E1E2E5",
        padding: "30px 20px",
        marginTop: "50px",
        marginBottom: "50px"
    },
    chartAccountTitle : {
        fontSize: "18px",
        fontWeight: "550",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
    }
}));

export default function BillOtherSettingsView(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const {
        tx, setTx, updateApi, walletId, setPageLevel,
    } = props;
    const {
        col, billEditBody, nextIcon,
        showSecondPartyInfoCont, showSecondPartyImgCont, showSecondPartyCont,
        paperSty, mainCont, topCont, productAndCategory, itemCont, qtyAndRate,
        txAndQty, rateAndTotal, taxAndTotal, bottomCont, displayFlex,
        paperMemoContMin, grandTotalCont, taxDiscountAndTotalCont, journalEntryCont,
        chartAccountTitle
    } = classes;

    const { SubTotalView } =
        useTotalBlocks({
            tx,
            updateApi
        });

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
                        <Typography style={{ fontSize: "20px", fontWeight: "550", marginLeft: "20px" }}>
                            {walletId === tx?.firstPartyWallet._id ? (<>Expense</>) : (<>Receipt</>)}
                            #{tx?.billNo}
                        </Typography>
                    )
                ]}
            />

            <div className={billEditBody} >
                <div style={{ width: "95%" }} >


                    <Paper className={showSecondPartyCont} square variant={"outlined"} >
                        <div className={showSecondPartyImgCont} >
                            <Avatar alt="ProfilePic" src={walletId === tx?.firstPartyWallet._id ? tx?.secondParty?.parent?.displayPicture?.thumbUrl : tx?.firstParty?.parent?.displayPicture?.thumbUrl} />
                        </div>
                        <div className={showSecondPartyInfoCont} >
                            <Typography style={{ fontSize: "16px", fontWeight: "550" }} >{walletId === tx?.firstPartyWallet._id ? tx?.secondParty?.parent?.displayName : tx?.firstParty?.parent?.displayName}</Typography>
                            <Typography style={{ fontSize: "13px", opacity: "0.6" }} >{walletId === tx?.firstPartyWallet._id ? tx?.secondParty?.parent?.email : tx?.firstParty?.parent?.email}</Typography>
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
                                                <div className={displayFlex} >
                                                    <Typography style={{ opacity: "0.6" }} >Product/Services</Typography>
                                                    <Typography>{item?.name}</Typography>
                                                </div>
                                            </div>
                                            <div className={itemCont} style={{ marginTop: "-5px", width: "49%" }} >
                                                <div className={displayFlex} >
                                                    <Typography style={{ opacity: "0.6" }} >Category</Typography>
                                                    <Typography>{item?.chartAccount?.name}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={qtyAndRate} >
                                            <div className={txAndQty} >
                                                <div className={displayFlex} >
                                                    <Typography style={{ opacity: "0.6" }} >Qty</Typography>
                                                    <Typography>{item?.qTy}</Typography>
                                                </div>
                                            </div>
                                            <div className={rateAndTotal} >
                                                <div className={displayFlex} >
                                                    <Typography style={{ opacity: "0.6" }} >Rate</Typography>
                                                    <Typography>{item?.rate}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={taxAndTotal} >
                                            <div className={txAndQty}  >
                                                <div className={displayFlex} >
                                                    <Typography style={{ opacity: "0.6" }} >Tax</Typography>
                                                    <Typography>{item?.tax ? <><CheckIcon style={{ color: "green" }} /></> : <><CloseIcon style={{ color: "red" }} /></>}</Typography>
                                                </div>
                                            </div>
                                            <div className={rateAndTotal} >
                                                <div className={displayFlex} >
                                                    <Typography style={{ opacity: "0.6" }} >Total</Typography>
                                                    <Typography>{item?.rate * item?.qTy}</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={bottomCont} >
                                        <div className={displayFlex} >
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
                        </div>
                        <div className={grandTotalCont} >
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell style={{ padding: "4px 4px", paddingLeft: "8px", fontSize: "16px", fontWeight: "550" }} align="left" >Sub Total</TableCell>
                                            <TableCell align="right">{SubTotalView}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>


                    <div>
                        {walletId === tx?.firstPartyWallet._id ? (
                            <div>
                                <div className={journalEntryCont} >
                                    <div className={chartAccountTitle} >
                                        <span style={{ marginRight: "10px" }} >
                                            <AccountBalanceIcon style={{ color: '#4CACEF', fontSize: "25px" }} />
                                        </span>
                                        The Chart Account where the amount added after the payment done
                                    </div>
                                    <Typography>{tx?.BankChartAccount?.name}</Typography>
                                </div>
                            </div>
                        ) : (
                            <div className={journalEntryCont} >
                                <div className={chartAccountTitle} >
                                    <span style={{ marginRight: "10px" }} >
                                        <AccountBalanceIcon style={{ color: '#4CACEF', fontSize: "25px" }} />
                                    </span>
                                    Current Status Of The Receipt
                                </div>
                                <Typography>{tx?.status}</Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
