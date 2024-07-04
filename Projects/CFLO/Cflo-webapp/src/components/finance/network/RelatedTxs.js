import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import { useParams, useHistory } from 'react-router-dom';
import { getRelationWithType } from './api';
import CommonView from './CommonView';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import TxTable from '../expenses/transactions';
import { FormatColorResetRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    }
}));
export default function RelatedTxs(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const {

    } = useSelector((state) => state);

    const {
        root,
    } = classes;
    //const { walletId } = useParams();

    const {
        allRelatedTxs,
        relatedInvoiceTxs,
        relatedBillTxs,
        relatedPaymentTxs,
        walletId,
        allTxsEmptyIn,
        invoiceTxsEmptyIn,
        billTxsEmptyIn,
        paymentTxsEmptyIn,
        txCount,
        withOutAllTx = false, 
        showFirst="all_transaction"
    } = props


    const [show, setShow] = useState(showFirst);

    const [allTxsEmpty, setAllTxsEmpty] = useState(false)
    const [invoiceTxsEmpty, setInvoiceTxsEmpty] = useState(false)
    const [billTxsEmpty, setBillTxsEmpty] = useState(false)
    const [paymentTxsEmpty, setPaymentTxsEmpty] = useState(false)

    const [allTxs, setAllTxs] = useState([])
    const [invoiceTxs, setInvoiceTxs] = useState([])
    const [billTxs, setBillTxs] = useState([])
    const [paymentTxs, setPaymentTxs] = useState([])




    useEffect(() => {
        setAllTxsEmpty(allTxsEmptyIn)
        setInvoiceTxsEmpty(invoiceTxsEmptyIn)
        setBillTxsEmpty(billTxsEmptyIn)
        setPaymentTxsEmpty(paymentTxsEmptyIn)


        setAllTxs(allRelatedTxs)
        setInvoiceTxs(relatedInvoiceTxs)
        setBillTxs(relatedBillTxs)
        setPaymentTxs(relatedPaymentTxs)

    }, [
        allRelatedTxs,
        relatedInvoiceTxs,
        relatedBillTxs,
        relatedPaymentTxs,
        allTxsEmptyIn,
        invoiceTxsEmptyIn,
        billTxsEmptyIn,
        paymentTxsEmptyIn,
    ])


    console.log(allRelatedTxs)
    console.log(relatedInvoiceTxs)
    console.log(relatedBillTxs)
    console.log(relatedPaymentTxs)
    console.log(allTxsEmptyIn)
    console.log(invoiceTxsEmptyIn)
    console.log(billTxsEmptyIn)
    console.log(paymentTxsEmptyIn)


    let withAllTxArr = [
        {
            value: "all_transaction",
            label: "All Transactions",
            Component: <TxTable
                txs={allTxs}
                walletId={walletId}
                txType={"invNo"}
                empty={allTxsEmpty}
                pathType={'/tx/'}
                txCount={txCount}
            />
        },
        {
            value: "invoice",
            label: "Invoice",
            Component: <TxTable
                txs={invoiceTxs}
                walletId={walletId}
                txType={"invNo"}
                empty={invoiceTxsEmpty}
                pathType={'/tx/'}
                txCount={txCount}
            />
        },
        {
            value: "bill",
            label: "Bill",
            Component: <TxTable
                txs={billTxs}
                walletId={walletId}
                txType={"billNo"}
                empty={billTxsEmpty}
                pathType={'/tx/'}
                txCount={txCount}
            />
        },
        {
            value: "payment",
            label: "Payment",
            Component: <TxTable
                txs={paymentTxs}
                walletId={walletId}
                txType={"No"}
                empty={paymentTxsEmpty}
                pathType={'/tx/'}
                txCount={txCount}
            />
        },
    ]

    let withOutAllTxArr = [
        {
            value: "invoice",
            label: "Invoice",
            Component: <TxTable
                txs={invoiceTxs}
                walletId={walletId}
                txType={"invNo"}
                empty={invoiceTxsEmpty}
                pathType={'/tx/'}
                txCount={txCount}
            />
        },
        {
            value: "bill",
            label: "Bill",
            Component: <TxTable
                txs={billTxs}
                walletId={walletId}
                txType={"billNo"}
                empty={billTxsEmpty}
                pathType={'/tx/'}
                txCount={txCount}
            />
        },
        {
            value: "payment",
            label: "Payment",
            Component: <TxTable
                txs={paymentTxs}
                walletId={walletId}
                txType={"No"}
                empty={paymentTxsEmpty}
                pathType={'/tx/'}
                txCount={txCount}
            />
        },
    ]



    return (
        <div className={root}>
            <MyNavBar
                title={""}
                show={show}
                setShow={setShow}
                walletId={walletId}
                Component={null}
                isMenu={false}
                options={withOutAllTx ? withOutAllTxArr : withAllTxArr}
            />
        </div>
    );
}
