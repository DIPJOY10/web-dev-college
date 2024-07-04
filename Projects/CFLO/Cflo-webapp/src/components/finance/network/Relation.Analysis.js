import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import { useParams, useHistory } from 'react-router-dom';
import { getRelatedTxs, getTxAnalysisData } from './api';
import CommonView from './CommonView';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import RelatedTxs from './RelatedTxs';
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import moment from 'moment'
import CommonAppBar from '../../styled/CommonComponents/Commont.AppBar';
import useMediaQuery from "@material-ui/core/useMediaQuery";
const _ = require("lodash");



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingTop: "70px",
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    }
  },
  returnBtn: {
    width: '100%',
  },
  titalCont: {
    display: 'flex',
  },
  fatSide: {
    width: "70%",
    display: 'flex',
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
      width: "98%",
    }
  },
  headerStatic: {
    width: "95%",
    display: 'flex',
    marginTop: "20px",
    justifyContent: "space-between",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
  },
  dataBox: {
    width: "20%",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    [theme.breakpoints.down('md')]: {
      width: "25%",
    }
  },
  boxValue: {
    fontWeight: "600",
    fontSize: "40px",
    [theme.breakpoints.down('md')]: {
      fontSize: "16px",
    }
  },
  boxTital: {
    fontSize: "14px",
    opacity: "0.6",
  },
  slimSide: {
    width: "30%",
    display: 'flex',
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
      width: "98%",
    }
  },
  tableCont: {
    width: "90%",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  txsCont: {
    maxWidth: "95%",
    height: "530px",
    marginTop: "40px",
    overflow: "auto",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
      height: "430px"
    }
  },
  graphCont: {
    width: "100%",
    height: "520px"
  },
  pieCont: {
    width: "90%",
    height: "230px",
    marginTop: "25px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
  }
}));
export default function RelationAnalysis(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {

  } = useSelector((state) => state);

  const {
    root, returnBtn, titalCont, headerStatic, fatSide, slimSide, dataBox, boxTital, boxValue,
    tableCont, txsCont, graphCont, pieCont
  } = classes;

  const { walletId, option, secondPartyWallet } = useParams();

  const [totalInvoiceAmountFP, setTotalInvoiceAmountFP] = useState(0)
  const [paidInvoiceAmountFP, setPaidInvoiceAmountFP] = useState(0)
  const [contInvoiceFP, setContInvoiceFP] = useState(0)
  const [txsInvoiceFP, setTxsInvoiceFP] = useState([])
  const [invoiceTxsEmptyInFP, setInvoiceTxsEmptyInFP] = useState(false)

  const [totalBillAmountFP, setTotalBillAmountFP] = useState(0)
  const [paidBillAmountFP, setPaidBillAmountFP] = useState(0)
  const [contBillFP, setContBillFP] = useState(0)
  const [txsBillFP, setTxsBillFP] = useState([])
  const [billTxsEmptyInFP, setBillTxsEmptyInFP] = useState(false)

  const [totalPaymentAmountFP, setTotalPaymentAmountFP] = useState(0)
  const [paidPaymentAmountFP, setPaidPaymentAmountFP] = useState(0)
  const [contPaymentFP, setContPaymentFP] = useState(0)
  const [txsPaymentFP, setTxsPaymentFP] = useState([])
  const [paymentTxsEmptyInFP, setPaymentTxsEmptyInFP] = useState(false)





  const [totalInvoiceAmountSP, setTotalInvoiceAmountSP] = useState(0)
  const [paidInvoiceAmountSP, setPaidInvoiceAmountSP] = useState(0)
  const [contInvoiceSP, setContInvoiceSP] = useState(0)
  const [txsInvoiceSP, setTxsInvoiceSP] = useState([])
  const [invoiceTxsEmptyInSP, setInvoiceTxsEmptyInSP] = useState(false)

  const [totalBillAmountSP, setTotalBillAmountSP] = useState(0)
  const [paidBillAmountSP, setPaidBillAmountSP] = useState(0)
  const [contBillSP, setContBillSP] = useState(0)
  const [txsBillSP, setTxsBillSP] = useState([])
  const [billTxsEmptyInSP, setBillTxsEmptyInSP] = useState(false)

  const [totalPaymentAmountSP, setTotalPaymentAmountSP] = useState(0)
  const [paidPaymentAmountSP, setPaidPaymentAmountSP] = useState(0)
  const [contPaymentSP, setContPaymentSP] = useState(0)
  const [txsPaymentSP, setTxsPaymentSP] = useState([])
  const [paymentTxsEmptyInSP, setPaymentTxsEmptyInSP] = useState(false)

  const [show, setShow] = useState("created");

  const [barGph, setBarGph] = useState([])


  useEffect(() => {
    getTxAnalysisData({
      firstPartyWalletId: walletId,
      secondPartyWalletId: secondPartyWallet
    })
      .then((data) => {
        constructGraph(data?.allTxs)

        data.firstPartyTotalAmount.map((fpData) => {

          if (fpData?._id === "Payment") {
            setTotalPaymentAmountFP(fpData?.totalAmount)
            setPaidPaymentAmountFP(fpData?.totalPaidAmount)
            setContPaymentFP(fpData?.count)

            if (fpData?.txs?.length === 0) {
              setPaymentTxsEmptyInFP(true)
              setTxsPaymentFP([])
            } else {
              setPaymentTxsEmptyInFP(false)
              setTxsPaymentFP(fpData?.txs)
            }

          } else if (fpData?._id === "Bill") {
            setTotalBillAmountFP(fpData?.totalAmount)
            setPaidBillAmountFP(fpData?.totalPaidAmount)
            setContBillFP(fpData?.count)

            if (fpData?.txs?.length === 0) {
              setBillTxsEmptyInFP(true)
              setTxsBillFP([])
            } else {
              setBillTxsEmptyInFP(false)
              setTxsBillFP(fpData?.txs)
            }

          } else if (fpData?._id === "Invoice") {
            setTotalInvoiceAmountFP(fpData?.totalAmount)
            setPaidInvoiceAmountFP(fpData?.totalPaidAmount)
            setContInvoiceFP(fpData?.count)

            if (fpData?.txs?.length === 0) {
              setInvoiceTxsEmptyInFP(true)
              setTxsInvoiceFP([])
            } else {
              setInvoiceTxsEmptyInFP(false)
              setTxsInvoiceFP(fpData?.txs)
            }
          }
        })


        data.secondPartyTotalAmount.map((spData) => {

          if (spData?._id === "Payment") {
            setTotalPaymentAmountSP(spData?.totalAmount)
            setPaidPaymentAmountSP(spData?.totalPaidAmount)
            setContPaymentSP(spData?.count)


            if (spData?.txs?.length === 0) {
              setInvoiceTxsEmptyInSP(true)
              setTxsPaymentSP([])
            } else {
              setPaymentTxsEmptyInSP(false)
              setTxsPaymentSP(spData?.txs)
            }

          } else if (spData?._id === "Bill") {
            setTotalBillAmountSP(spData?.totalAmount)
            setPaidBillAmountSP(spData?.totalPaidAmount)
            setContBillSP(spData?.count)

            if (spData?.txs?.length === 0) {
              setBillTxsEmptyInSP(true)
              setTxsBillSP([])
              console.log("empty")
            } else {
              setBillTxsEmptyInSP(false)
              setTxsBillSP(spData?.txs)
            }

          } else if (spData?._id === "Invoice") {
            setTotalInvoiceAmountSP(spData?.totalAmount)
            setPaidInvoiceAmountSP(spData?.totalPaidAmount)
            setContInvoiceSP(spData?.count)

            if (spData?.txs?.length === 0) {
              setInvoiceTxsEmptyInSP(true)
              setTxsInvoiceSP(spData?.txs)
            } else {
              setInvoiceTxsEmptyInSP(false)
              setTxsInvoiceSP(spData?.txs)
            }

          }
        })
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })

  }, [])


  const constructGraph = (data) => {

    const gphArr = []

    let grouped = _.groupBy(data, function (d) {
      return moment(d?.createdAt).format("MMM Do YY");
    })

    console.log(data)

    for (const key in grouped) {

      let totalS = 0;
      let totalR = 0;

      grouped[key].map((group) => {
        if ((group?.firstPartyWallet === walletId && group?.secondPartyWallet === secondPartyWallet && group?.type === "Invoice")
          || (group?.firstPartyWallet === secondPartyWallet && group?.secondPartyWallet === walletId && (group?.type === "Bill" || group?.type === "Payment"))
        ) {
          totalR = totalR + group?.amountPaid || 0
        }


        if ((group?.firstPartyWallet === secondPartyWallet && group?.secondPartyWallet === walletId && group?.type === "Invoice")
          || (group?.firstPartyWallet === walletId && group?.secondPartyWallet === secondPartyWallet && (group?.type === "Bill" || group?.type === "Payment"))
        ) {
          totalS = totalS + group?.amountPaid || 0
        }
      })

      const newGpObj = {
        date: key,
        received: totalR,
        sent: totalS
      }
      gphArr.push(newGpObj)

    }
    console.log(gphArr)
    setBarGph(gphArr)
  }

  const goBack = () => {
    const goBackUrl = `/admin/${walletId}/network/${option}`
    console.log(goBackUrl)
    history.push(goBackUrl);
  }



  const data01 = [
    { name: "Created Invoice", value: contInvoiceFP, fill: '#9cc4f7' },
    { name: "Received Invoice", value: contInvoiceSP, fill: "#fc0000" },
    { name: "Received Payment", value: contPaymentSP, fill: "#8d62f9" },
    { name: "Created Payment", value: contPaymentFP, fill: "#fc7c78" },
    { name: "Created Bill", value: contBillFP, fill: "#fc4143" },
    { name: "Received Bill", value: contBillSP, fill: "#46A8F1" },
  ];

  const getFormatedData = (data) => {
    let formatedData = new Intl.NumberFormat('en-GB', { notation: "compact", compactDisplay: "short" }).format(data);
    return formatedData;
  }


  const viewSize = useMediaQuery("(max-width:600px)");

  console.log(viewSize)

  return (
    <div className={root}>
      <div className={returnBtn} >
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
              <Typography style={{ fontSize: "20px", marginLeft: "20px" }}>Transaction Analysis</Typography>
            )
          ]}
        />
      </div>

      <div className={fatSide} >
        <div className={headerStatic} >
          <div className={dataBox} >
            <Typography className={boxTital} >Total Received</Typography>
            <Typography className={boxValue} >${getFormatedData(paidInvoiceAmountFP + paidBillAmountSP + paidPaymentAmountSP)}</Typography>

          </div>
          <div className={dataBox} >
            <Typography className={boxTital} >Total Sent</Typography>
            <Typography className={boxValue} >${getFormatedData(paidBillAmountFP + paidPaymentAmountFP + paidInvoiceAmountSP)}</Typography>

          </div>
          <div className={dataBox} >
            <Typography className={boxTital} >Total Due Invoice</Typography>
            <Typography className={boxValue} >${getFormatedData(totalInvoiceAmountFP - paidInvoiceAmountFP)}</Typography>

          </div>
          <div className={dataBox} >
            <Typography className={boxTital} >Total Due Bill</Typography>
            <Typography className={boxValue} >${getFormatedData(totalInvoiceAmountSP - paidInvoiceAmountSP)}</Typography>
          </div>
        </div>


        <div className={txsCont} >

          <BarChart
            width={viewSize ? 350 : 800}
            height={viewSize ? 400 : 500}
            data={barGph}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
            <ReferenceLine y={0} stroke="#000" />

            <Brush dataKey="date" height={30} stroke="#8884d8" />
            <Bar dataKey="sent" fill="#8884d8" />
            <Bar dataKey="received" fill="#82ca9d" />

          </BarChart>

        </div>


      </div>
      <div className={slimSide} >
        <div className={tableCont} >
          <TableContainer component={Paper} style={{ width: "95%" }} >
            <Table className={classes.table} size="small" aria-label="caption table">
              <TableBody>

                <TableRow key={99}  >
                  <TableCell style={{ padding: "15px", fontSize: "17px", fontWeight: "600" }} align="left">Transactions Details</TableCell>
                </TableRow>

                <TableRow key={0}  >
                  <TableCell style={{ opacity: "0.6" }} align="center">Created Invoices</TableCell>
                  <TableCell style={{ opacity: "0.6" }} align="center">{contInvoiceFP}</TableCell>
                </TableRow>

                <TableRow key={1}>
                  <TableCell style={{ opacity: "0.6" }} align="center">Received Invoices</TableCell>
                  <TableCell style={{ opacity: "0.6" }} align="center">{contInvoiceSP}</TableCell>
                </TableRow>
                <TableRow key={2} style={{ borderTop: "1px solid black" }} >
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">Total Invoices</TableCell>
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">{contInvoiceFP + contInvoiceSP}</TableCell>
                </TableRow>


                <TableRow key={3}>
                  <TableCell style={{ opacity: "0.6" }} align="center">Created Bills</TableCell>
                  <TableCell style={{ opacity: "0.6" }} align="center">{contBillFP}</TableCell>
                </TableRow>

                <TableRow key={4}>
                  <TableCell style={{ opacity: "0.6" }} align="center">Received Bills</TableCell>
                  <TableCell style={{ opacity: "0.6" }} align="center">{contBillSP}</TableCell>
                </TableRow>
                <TableRow key={5} style={{ borderTop: "1px solid black" }} >
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">Total Bills</TableCell>
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">{contBillFP + contBillSP}</TableCell>
                </TableRow>


                <TableRow key={6}>
                  <TableCell style={{ opacity: "0.6" }} align="center">Created Payments</TableCell>
                  <TableCell style={{ opacity: "0.6" }} align="center">{contPaymentFP}</TableCell>
                </TableRow>

                <TableRow key={7}>
                  <TableCell style={{ opacity: "0.6" }} align="center">Received Payments</TableCell>
                  <TableCell style={{ opacity: "0.6" }} align="center">{contPaymentSP}</TableCell>
                </TableRow>
                <TableRow key={8} style={{ borderTop: "1px solid black" }} >
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">Total Payments</TableCell>
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">{contPaymentFP + contPaymentSP}</TableCell>
                </TableRow>


                <TableRow key={9} style={{ borderTop: "1px solid black" }} >
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">Total Transactions</TableCell>
                  <TableCell style={{ fontSize: "16px", fontWeight: "550" }} align="center">{contInvoiceFP + contBillFP + contPaymentFP + contInvoiceSP + contBillSP + contPaymentSP}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={pieCont} >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={data01}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ width: "100%" }} >

        <MyNavBar
          title={""}
          show={show}
          setShow={setShow}
          walletId={walletId}
          Component={null}
          isMenu={false}
          options={[
            {
              value: "created",
              label: "Created",
              Component: <RelatedTxs
                relatedInvoiceTxs={txsInvoiceFP}
                relatedBillTxs={txsBillFP}
                relatedPaymentTxs={txsPaymentFP}
                invoiceTxsEmptyIn={invoiceTxsEmptyInFP}
                billTxsEmptyIn={billTxsEmptyInFP}
                paymentTxsEmptyIn={paymentTxsEmptyInFP}
                walletId={walletId}
                withOutAllTx={true}
                showFirst={"invoice"}
              />
            },
            {
              value: "received",
              label: "Received",
              Component: <RelatedTxs
                relatedInvoiceTxs={txsInvoiceSP}
                relatedBillTxs={txsBillSP}
                relatedPaymentTxs={txsPaymentSP}
                invoiceTxsEmptyIn={invoiceTxsEmptyInSP}
                billTxsEmptyIn={billTxsEmptyInSP}
                paymentTxsEmptyIn={paymentTxsEmptyInSP}
                walletId={walletId}
                withOutAllTx={true}
                showFirst={"invoice"}
              />
            }
          ]}
        />








      </div>


    </div>
  );
}
