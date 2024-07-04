import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { updateTx, updateTxTemplate } from '../transaction/api';
import { updateJournalEntry } from "../journalEntry/api";


function DialogBillNo(props) {
    const {
        open,
        handleClose,
        txNos,
        tx,
        setTx,
        type,
        maxNo,
        setMaxNo,
        walletId,
        setLoadingBool
    } = props;
    console.log(txNos);
    const [newBillNo, setNewBillNo] = useState();
    const [defaultCounter, setDefaultCounter] = useState();
    const [check, setCheck] = useState(false);
    const [checkCounter, setCheckCounter] = useState(false);

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

        console.log(newBillNo);
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
        } else if (type === "Jornal Entry") {

            tx.journalEntryNo = newBillNo;
            await updateJournalEntry({
                _id: tx._id,
                journalEntryNo: newBillNo,
                defaultCounter: defaultCounter,
                editCounter: true,
                walletId: walletId
            })

        }
        setTx(tx);
        handleClose();

        setLoadingBool(false)
    }

    console.log(maxNo)

    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit {type} No</DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column' }} >

                    <TextField
                        autoFocus
                        label={`${type} No`}
                        type="number"
                        value={newBillNo}
                        onChange={(event) => { setValue(event.target.value) }}
                        style={{ width: "250px" }}
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
                        style={{ width: "250px" }}
                    />
                    {checkCounter ? (<p style={{ color: 'red' }} >The number should be bigger then {maxNo - 1}</p>) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cancel
                    </Button>

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


                </DialogActions>
            </Dialog>
        </>
    )
}
export default DialogBillNo;