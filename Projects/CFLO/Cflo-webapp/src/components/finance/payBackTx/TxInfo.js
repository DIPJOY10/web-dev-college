import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import Collapse from "@material-ui/core/Collapse";
import Avatar from '@material-ui/core/Avatar';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';


const useStyles = makeStyles((theme) => ({
    txInfoCont : {
        width: "350px",
        minHeight: "320px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
        borderRadius: "10px",
        backgroundColor: "white",
        [theme.breakpoints.down('sm')]: {
            width : "330px"
        },
    },
    amountSt : {
        fontSize: "35px",
        fontWeight: "bold",
        marginTop: "30px",
        marginLeft: "20px",
        color: "#79C3F0"
    },
    dueDateSt : {
        fontSize: "11px",
        marginLeft: "20px",
        marginBottom: "30px"
    },
    tblCont: {
        width: "90%",
        marginTop: "20px",
        marginLeft: "20px"
    },
    thSt: {
        textAlign: "left",
        paddingLeft: "20px",
        paddingBottom: "5px"
    },
    tdSt: {
        paddingBottom: "5px"
    },
    viewM: {
        borderTop: "1px solid #79C3F0",
        height: "35px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: '#79C3F0',
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "60px"
      },
      contPics: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "25px"
      },
      avatarSiz: {
        width: theme.spacing(7),
        height: theme.spacing(7),
      },
}));

export default function TxInfo(props) {

    const DateNow = new Date()
    const classes = useStyles();
    const history = useHistory();
    const { txId } = useParams();
    const { myTx } = props;
    const { 
        txInfoCont,
        amountSt,
        dueDateSt,
        tdSt,
        thSt,
        viewM,
        contPics,
        avatarSiz,
        tblCont,
     } = classes;

     const [checked, setChecked] = useState(false);
     const [tx, setTx] = useState(null);
     const [finalAmount, setFinalAmount] = useState(0);

     useEffect(()=>{
         setTx(myTx);

         let am
         const d2 = moment(myTx?.dueDate).format("YYYY-M-D")
         const d1 = moment().format("YYYY-M-D")
       
         if(d2>d1){
           am = myTx?.finalAmount || 0 
         }else {
           am = myTx?.finalAmount || 0 + myTx?.lateFeeAmount
         }
     
         setFinalAmount(am)

     },[txId, myTx])

    


    return (
        <div className={txInfoCont} >
            <Typography className={amountSt} >
                <NumberFormat
                    value={finalAmount}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                />
            </Typography>
            <Typography className={dueDateSt} >Due {moment(tx?.dueDate).format("MMMM Do YYYY")}</Typography>
            <table className={tblCont} >
                <tr>
                    <td className={tdSt} >To</td>
                    <th className={thSt} >{tx?.type === "Payment" || tx?.type === "Bill"  ?  tx?.firstParty?.parent?.displayName : tx?.secondParty?.parent?.displayName}</th>
                </tr>
                <tr>
                    <td className={tdSt} >From</td>
                    <th className={thSt} >{tx?.type === "Payment" || tx?.type === "Bill"  ?  tx?.secondParty?.parent?.displayName : tx?.firstParty?.parent?.displayName}</th>
                </tr>
                <tr>
                    <td className={tdSt} >Memo</td>
                    <th className={thSt} >{tx?.memo}</th>
                </tr>
            </table>
            {!checked ? <div className={viewM} onClick={() => setChecked(!checked)} >View More</div> : null}
            <Collapse in={checked} >
                <div className={contPics} >
                    <Avatar className={avatarSiz} src={tx?.type === "Payment" || tx?.type === "Bill"  ? tx?.firstParty?.parent?.displayPicture?.thumbUrl : tx?.secondParty?.parent?.displayPicture?.thumbUrl} alt="from" />
                    <TrendingFlatIcon style={{ color: "#79C3F0", fontSize: 60, marginLeft: "10px", marginRight: "10px" }} />
                    <Avatar className={avatarSiz} src={tx?.type === "Payment" || tx?.type === "Bill"  ? tx?.secondParty?.parent?.displayPicture?.thumbUrl : tx?.firstParty?.parent?.displayPicture?.thumbUrl} alt="to" />
                </div>
                <table className={tblCont} >
                    <tr>
                        <td className={tdSt} >Currency</td>
                        <th className={thSt} >{tx?.currency}</th>
                    </tr>
                    <tr>
                        <td className={tdSt} >Main Amount</td>
                        <th className={thSt} >
                            <NumberFormat
                                value={tx?.finalAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                            />
                        </th>
                    </tr>
                    <tr>
                        <td className={tdSt} >Late Fees</td>
                        <th className={thSt} >
                            <NumberFormat
                                value={tx?.lateFeeAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                            />
                        </th>
                    </tr>
                </table>
                <Typography style={{ marginLeft: "20px", fontWeight: "bold", marginTop: "15px" }}>Expense Details :-</Typography>
                <table className={tblCont} >
                    <tr>
                        <th style={{ textAlign: 'left' }} >Name</th>
                        <th style={{ textAlign: 'right' }} >Quantity</th>
                        <th style={{ textAlign: 'right' }} >Rate</th>
                        <th style={{ textAlign: 'right' }} >Total</th>
                    </tr>
                    {tx?.billList?.items?.map((item) => (
                        <tr>
                            <td style={{ textAlign: 'left' }} >{item?.name}</td>
                            <td style={{ textAlign: 'right' }} >
                                <NumberFormat
                                    value={item?.qTy}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={''}
                                />
                            </td>
                            <td style={{ textAlign: 'right' }} >
                                <NumberFormat
                                    value={item?.rate}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            </td>
                            <td style={{ textAlign: 'right' }} >
                                <NumberFormat
                                    value={item?.qTy * item?.rate}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            </td>
                        </tr>
                    ))}
                </table>
                <table className={tblCont} >
                    <tr>
                        <td className={tdSt} >Tax</td>
                        <th className={thSt} >{tx?.billList?.tax?.type === '$' ? (
                            <NumberFormat
                                value={tx?.billList?.tax?.amount}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                            />
                        ) : (<>{tx?.billList?.tax?.percent}%</>)}
                        </th>
                    </tr>
                    <tr>
                        <td className={tdSt} >Discount</td>
                        <th className={thSt} >{tx?.billList?.discount?.type === '$' ? (
                            <NumberFormat
                                value={tx?.billList?.discount?.amount}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                            />
                        ) : (<>{tx?.billList?.discount?.percent}%</>)}
                        </th>
                    </tr>
                </table>
                <div className={viewM} onClick={() => setChecked(!checked)} >View Less</div>
            </Collapse>
        </div>
    );
}
