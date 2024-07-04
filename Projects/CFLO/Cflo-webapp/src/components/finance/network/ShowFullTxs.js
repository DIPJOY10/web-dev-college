import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import { useParams, useHistory } from 'react-router-dom';
import { getRelationWithType } from './api';
import CommonView from './CommonView';
import RelatedTxs from './RelatedTxs';
import { getRelatedTxs } from './api';
const _ = require("lodash");




const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        paddingTop: '50px',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    relationCard: {
        width: "30%",
        height: "100px",
        border: "1px solid #E1E2E5",
        marginBottom: "10px"
    },
    barCont: {
        width: "100%",
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
    returnBtn: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: "20px"
    },
    relatedTxCont: {
        width: '100%',
    },
    titalCont: {
        display: 'flex',
    }
}));
export default function ShowFullTxs(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();

    const {

    } = useSelector((state) => state);

    const {
        root, returnBtn, relatedTxCont, titalCont, barCont
    } = classes;

    const { walletId, secondPartyWallet, option } = useParams();

    const [allRelatedTxs, setAllRelatedTxs] = useState([]);
    const [relatedInvoiceTxs, setRelatedInvoiceTxs] = useState([]);
    const [relatedBillTxs, setRelatedBillTxs] = useState([]);
    const [relatedPaymentTxs, setRelatedPaymentTxs] = useState([]);

    const [allTxsEmptyIn, setAllTxsEmptyIn] = useState(false)
    const [invoiceTxsEmptyIn, setInvoiceTxsEmptyIn] = useState(false)
    const [billTxsEmptyIn, setBillTxsEmptyIn] = useState(false)
    const [paymentTxsEmptyIn, setPaymentTxsEmptyIn] = useState(false)


    useEffect(() => {
        getRelatedTxs({
            secondPartyWallet,
            firstPartyWallet: walletId,
            count: 0
        })
            .then((txs) => {
                if (txs?.allTxs?.length === 0) {
                    setAllTxsEmptyIn(true)
                } else {
                    setAllRelatedTxs(txs?.allTxs)
                }

                if (txs?.invoiceTxs?.length === 0) {
                    setInvoiceTxsEmptyIn(true)
                } else {
                    setRelatedInvoiceTxs(txs?.invoiceTxs)
                }

                if (txs?.billTxs?.length === 0) {
                    setBillTxsEmptyIn(true)
                } else {
                    setRelatedBillTxs(txs?.billTxs)
                }

                if (txs?.paymentTxs?.length === 0) {
                    setPaymentTxsEmptyIn(true)
                } else {
                    setRelatedPaymentTxs(txs?.paymentTxs)
                }

            })
            .catch((err) => {
                console.log(err);
            })

    }, [])

    const goBack = () => {
        const goBackUrl = `/admin/${walletId}/network/${option}`
        console.log(goBackUrl)
        history.push(goBackUrl);
    }


    return (
        <div className={root}>
            <div className={barCont} >
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
                            <Typography style={{ fontSize: "20px", marginLeft: "20px" }}>Transactions</Typography>
                        )
                    ]}
                />
            </div>
            <div className={relatedTxCont} >
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
                />
            </div>
        </div>
    );
}
