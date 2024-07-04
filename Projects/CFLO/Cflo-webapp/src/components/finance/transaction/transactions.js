import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory, useParams } from "react-router-dom";
import MyNavBar from '../../styled/CommonComponents/MyNavBar';
import AllTransitions from '../allTxCom/AllTransactions';
import { getPlaidTxsAndAccounts } from '../allTxCom/api';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Nodata from "../../../Assets/noData_T.png"

const useStyles = makeStyles((theme) => ({
  progressCont: {
    width: '100%',
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankCardCont: {
    width: "100%",
    overflowX: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  accountCard: {
    minWidth: "270px",
    height: "160px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
    borderRadius: "10px",
    margin: "15px",
    cursor: "pointer",
  },
  uperCardPartAcc: {
    height: "70%",
    backgroundColor: "gray",
    color: "white",
    padding: "7px"
  },
  uperCardPartAccSelected: {
    height: "70%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    padding: "7px"
  },
  lowerCardPart: {
    height: "30%",
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "7px",
    paddingRight: "15px",
  },
  accRow: {
    display: "flex",
    justifyContent: "space-between"
  },
  imgCont: {
    display: "flex",
    flexDirection: "column",
  }
}));

export default function Transactions(props) {
  const {

  } = props;
  const classes = useStyles();
  const {
    progressCont, bankCardCont, accountCard, uperCardPartAccSelected,
    uperCardPartAcc, accRow, lowerCardPart
  } = classes;

  const { walletId } = useParams();
  const [show, setShow] = useState("allTx")
  const [txAndAccountData, setTxAndAccountData] = useState();
  const [accountNo, setAccountNo] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPlaidTxsAndAccounts(walletId)
      .then((data) => {
        console.log(data)
        setTxAndAccountData(data);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [walletId])



  return (
    <div className={classes.root}>
      {txAndAccountData?.length > 0 ? (
        <>
          <MyNavBar
            title={"Bank Transactions"}
            show={show}
            setShow={setShow}
            walletId={walletId}
            Component={null}
            isMenu={true}
            options={[]}
          />
          {txAndAccountData ?
            <div className={bankCardCont} >
              {txAndAccountData.map((account, inx) => (
                <div className={accountCard} onClick={() => setAccountNo(inx)}>
                  <div className={inx == accountNo ? uperCardPartAccSelected : uperCardPartAcc} >
                    <div className={accRow} >
                      <div style={{ fontSize: "20px" }} >{account?.account?.subtype}</div>
                      <div><AccountBalanceIcon style={{ fontSize: "15px" }} /> {inx == accountNo ? <EditIcon style={{ fontSize: "15px" }} /> : null} </div>
                    </div>
                    <div className={accRow} style={{ marginTop: "20px" }}>
                      <div style={{ fontSize: "25px" }} >${account?.account?.balances?.available}</div>
                      <div></div>
                    </div>
                    <div className={accRow} >
                      <div style={{ fontSize: "15px" }} >BANK BALANCE</div>
                      <div style={{ fontSize: "10px" }} >Updated moments ago</div>
                    </div>
                  </div>
                  <div className={lowerCardPart} >
                    <div style={{ paddingTop: "5px" }}>$490<br />IN CONTRACTFLO</div>
                    <div style={inx == accountNo ? { fontSize: "30px", color: "#EE8B0D" } : { fontSize: "30px" }} >{account?.txs?.length}</div>
                  </div>
                </div>
              ))}
            </div>
            : null}
          <AllTransitions
            data={txAndAccountData[accountNo]}
          />
        </>
      ) : <div className={progressCont} >
        {loading ? (<>
          <CircularProgress />
        </>) : (<div className={classes.imgCont} >
          <img src={Nodata} alt={"no data found"} />
          <h2
            style={{ fontSize: "16px", fontWeight: "500", opacity: "0.8", textAlign: "center" }}
          >No Bank Account Connected!</h2>
        </div>)}
      </div>}
    </div>
  );
}
