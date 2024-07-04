import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    pmTitle: {
        textAlign: 'center',
        fontSize: '20px',
        color: '#79C3F0',
        margin: "5px"
    },
    onlyText: {
        fontSize: "11px",
        opacity: "0.6",
        marginTop: "10px"
    },
    DButtonCont: {
        marginTop: "20px",
        textAlign: "center",
        marginBottom: "20px"
    },
    SButtonCont: {
        marginTop: "20px",
        textAlign: "center",
    },
}));

export default function PaymentMethods(props) {

    const DateNow = new Date()
    const classes = useStyles();
    const history = useHistory();
    const { txId } = useParams();
    const { 
        tx, 
        OnStripeAccountSelect, 
        dwollaAccUrl, 
        stripeAccId, 
        OnDwollaAccountSelect, 
        OnStripeCardSelect 
    } = props;
    const {
        pmTitle,
        onlyText,
        SButtonCont,
        DButtonCont,
    } = classes;


    return (
        <div>
            <Typography className={pmTitle} >Payment Methods</Typography>
            <div>
                <div className={SButtonCont} >
                    {stripeAccId ?
                        <>
                            <Button onClick={() => OnStripeCardSelect()} variant="outlined" color="primary" >
                                <Typography style={{ fontSize: '20px' }} >CARD</Typography>
                            </Button>
                            <p className={onlyText} >If you want to pay through card useing STRIPE, you have to pay 3% extra</p>
                        </>
                        :
                        <div className={onlyText}  >
                            Sorry!! the <b>Card Payment Method</b> is not available, so to use the card payment method
                            tell <b>{tx?.firstParty?.parent?.displayName}</b> to create the stripe Account.
                        </div>
                    }
                </div>


                {/* {stripeAccId ?
                <div className={SButtonCont} >
                  <Button onClick={() => OnStripeAccountSelect()} variant="outlined" color="primary" >
                    <Typography style={{ fontSize: '20px' }} >BANK ACCOUNT</Typography>
                  </Button>
                  <p style={{ fontSize: "11px", opacity: "0.6", marginTop: "10px" }} >If you want to pay through account details useing STRIPE, It may takes 2-3 days to send to amount</p>
                </div>
                : null} */}


                <div className={DButtonCont} >
                    {dwollaAccUrl ?
                        <>
                            <Button onClick={() => OnDwollaAccountSelect()} variant="outlined" color="primary" >
                                <Typography style={{ fontSize: '20px' }} >BANK ACCOUNT</Typography>
                            </Button>
                            <p className={onlyText}  >If you want to pay with your account, It may takes 2-3 days to send to amount</p>
                        </>
                        :
                        <div className={onlyText}  >
                            Sorry!! the bank account payment method is not available, so to use the <b>ACH payment method</b>
                            tell <b>{tx?.firstParty?.parent?.displayName}</b> to create the Dwolla Account and also to add a bank account
                            with the dwolla account.
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}
