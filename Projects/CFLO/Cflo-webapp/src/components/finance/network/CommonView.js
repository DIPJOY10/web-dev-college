import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import { useParams, useHistory } from 'react-router-dom';
import { getRelatedTxs } from './api';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Api from '../../../helpers/Api';
import TxTable from '../expenses/transactions';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import RelatedTxs from './RelatedTxs';
import PayDialog from '../../profile/PayDialog';
const _ = require("lodash");



const useStyles = makeStyles((theme) => ({
    root: {
        height: "calc(100vh - 225px)",
        overflowY: "auto",
        display: 'flex',
        width: '100%',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
           flexDirection: 'column',
        }
    },
    relationCard: {
        width: "30%",
        height: "100px",
        border: "1px solid #E1E2E5",
        marginBottom: "10px",
        padding: "10px",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
         }
    },
    relationAvtNameCont: {
        display: "flex",
        alignItems: "center",
    },
    setContFlex: {
        marginTop: "5px",
        display: "flex",
        justifyContent: "space-between",
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
    },
    showRelatedTxs: {
        minWidth: "700px"
    }
}));
export default function CommonView(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        root, row, col, relationCard, relationAvtNameCont, setContFlex, showRelatedTxs
    } = classes;

    const {
        networks, option
    } = props;

    const { walletId } = useParams();

    const [networksArr, setNetworksArr] = useState([]);
    const [allRelatedTxs, setAllRelatedTxs] = useState([]);
    const [relatedInvoiceTxs, setRelatedInvoiceTxs] = useState([]);
    const [relatedBillTxs, setRelatedBillTxs] = useState([]);
    const [relatedPaymentTxs, setRelatedPaymentTxs] = useState([]);

    const [txBoxOpen, setTxBoxOpen] = useState(false);
    const [secondPartyWalletUS, setSecondPartyWalletUS] = useState()
    const [ownProfile, setOwnProfile] = useState(false);

    const [allTxsEmptyIn, setAllTxsEmptyIn] = useState(false)
    const [invoiceTxsEmptyIn, setInvoiceTxsEmptyIn] = useState(false)
    const [billTxsEmptyIn, setBillTxsEmptyIn] = useState(false)
    const [paymentTxsEmptyIn, setPaymentTxsEmptyIn] = useState(false)


    const showTx = async (secondPartyWallet) => {

        setTxBoxOpen(true);

        setSecondPartyWalletUS(secondPartyWallet?._id)
        console.log(secondPartyWallet)

        await getRelatedTxs({
            secondPartyWallet : secondPartyWallet?._id ,
            firstPartyWallet: walletId,
            count: 5
        })
            .then((txs) => {

                console.log(txs)

                if (txs?.allTxs?.length === 0) {
                    setAllTxsEmptyIn(true)
                    setAllRelatedTxs([])
                } else {
                    setAllTxsEmptyIn(false)
                    setAllRelatedTxs(txs?.allTxs)
                }

                if (txs?.invoiceTxs?.length === 0) {
                    setInvoiceTxsEmptyIn(true)
                    setRelatedInvoiceTxs([])
                } else {
                    setInvoiceTxsEmptyIn(false)
                    setRelatedInvoiceTxs(txs?.invoiceTxs)
                }

                if (txs?.billTxs?.length === 0) {
                    setBillTxsEmptyIn(true)
                    setRelatedBillTxs([])
                } else {
                    setBillTxsEmptyIn(false)
                    setRelatedBillTxs(txs?.billTxs)
                }

                if (txs?.paymentTxs?.length === 0) {
                    setPaymentTxsEmptyIn(true)
                    setRelatedPaymentTxs([])
                } else {
                    setPaymentTxsEmptyIn(false)
                    setRelatedPaymentTxs(txs?.paymentTxs)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleCloseTxBox = () => {
        setAllTxsEmptyIn(false)
        setAllRelatedTxs([])
        setInvoiceTxsEmptyIn(false)
        setRelatedInvoiceTxs([])
        setBillTxsEmptyIn(false)
        setRelatedBillTxs([])
        setPaymentTxsEmptyIn(false)
        setRelatedPaymentTxs([])

        setTxBoxOpen(false);

    };

    const seeFullTx = (secondPartyWallet) => {
        console.log(secondPartyWallet)
        const goUrl = `/admin/${walletId}/related/tx/${secondPartyWallet }/${option}`
        history.push(goUrl);
    }

    const seeRelationAnalysis = (secondPartyWallet) => {
        console.log(secondPartyWallet)
        const goUrl = `/admin/${walletId}/relation/analysis/${secondPartyWallet?._id}/${option}`
        history.push(goUrl);
    }

    useEffect(() => {
        setNetworksArr(networks)
    }, [networks, walletId])



    return (
        <div className={root}>
            {networksArr.map((network, index) => (
                <div className={relationCard} key={index} >
                    <div className={relationAvtNameCont} >
                        <Avatar style={{ cursor: "pointer" }} onClick={() => { seeRelationAnalysis(network?.profile?.parent?.wallet) }} alt="Remy Sharp" src={network?.profile?.parent?.displayPicture?.thumbUrl} />
                        <div style={{ marginLeft: "15px" }} >
                            <Typography onClick={() => { seeRelationAnalysis(network?.profile?.parent?.wallet) }} style={{ cursor: "pointer" }} >{network?.profile?.parent?.displayName}</Typography>
                            <Typography onClick={() => { seeRelationAnalysis(network?.profile?.parent?.wallet) }} style={{ fontSize: "12px", opacity: "0.6", cursor: "pointer" }}>{network?.profile?.parent?.email}</Typography>
                        </div>
                    </div>
                    <div className={setContFlex} >
                        <div></div>
                        <div>
                            <Tooltip onClick={() => { showTx(network?.profile?.parent?.wallet) }} style={{ marginRight: "10px" }} title="Mutual Transactions" placement="top">
                                <ButtonBase>
                                    <SwapHorizontalCircleIcon style={{ fontSize: "35px", color: "#50AFEF" }} />
                                </ButtonBase>
                            </Tooltip>
                            <Tooltip style={{ marginRight: "10px" }} title="Send Money" placement="top">
                                <ButtonBase>
                                    <PayDialog
                                        profile={network?.profile}
                                        onSearch={true}
                                        ownProfile={ownProfile}
                                        atNetwork={true}
                                        walletId={walletId}
                                    />
                                </ButtonBase>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            ))}
            <Dialog
                open={txBoxOpen}
                onClose={handleCloseTxBox}
                maxWidth={"lg"}
            >
                <DialogContent >
                    <RelatedTxs
                        allRelatedTxs={allRelatedTxs}
                        relatedInvoiceTxs={relatedInvoiceTxs}
                        relatedBillTxs={relatedBillTxs}
                        relatedPaymentTxs={relatedPaymentTxs}
                        allTxsEmptyIn={allTxsEmptyIn}
                        invoiceTxsEmptyIn={invoiceTxsEmptyIn}
                        billTxsEmptyIn={billTxsEmptyIn}
                        paymentTxsEmptyIn={paymentTxsEmptyIn}
                        walletId={walletId}
                        txCount={5}
                    />
                </DialogContent>


                <DialogActions>
                    <Button onClick={() => { seeFullTx(secondPartyWalletUS) }} color="primary" autoFocus>
                        See All Transactions
                    </Button>
                    <Button onClick={handleCloseTxBox} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}
