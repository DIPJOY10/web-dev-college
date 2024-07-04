import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '../../styled/SearchAndAdd/AddDialog';
import PalForm from '../../AddMember/newPalForm';



const useStyles = makeStyles((theme) => ({
    secondPartyHeaderCont : {
      display : "flex",
      justifyContent : "space-between",
      padding : "4px 10px"
    }
}));

export default function CreatePal(props) {
    const {
        tx, setTx, updateApi, walletId, findOrAddRel, handleClose
    } = props;
    const classes = useStyles();
    const { secondPartyHeaderCont } = classes
    const {
        bglen, bottomAct, addCustomerCont
    } = classes;

    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);



    const newOnSelect = async (profile) => {
        console.log(profile)

        const value = {
            profileId: profile?._id,
            displayName: profile?.parent?.displayName,
            displayPicture: profile?.parent?.displayPicture,
            profile: profile,
            email: profile?.parent?.email,
            wallet: profile?.parent?.wallet
        }

        console.log(value)

        if (profile) {

            console.log(value)

            await updateApi({
                _id: tx?._id,
                secondParty: value?.profile?._id,
                secondPartyWallet: value?.wallet?._id
            })

            const newTx = {
                ...tx,
                secondParty: value?.profile,
                secondPartyWallet: value?.wallet
            }

            findOrAddRel(value?.profile)

            setTx(newTx)
            handleClose()
            setOpen(false)
        }
    };


    return (
        <>
            <div className={secondPartyHeaderCont} >
                <div></div>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <AddIcon />
                    create new
                </Button>
            </div>


            <Dialog
                open={open}
                setOpen={setOpen}
                loading={loading}
                form={<PalForm
                    text={text}
                    setOpen={setOpen}
                    onSelect={newOnSelect}
                    loading={loading}
                    setLoading={setLoading}
                />}
            />
        </>
    );
}
