import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  navBar: {
    flex: 1,
    display: "flex",
    flexDirection: 'row',
    marginTop: "30px",
    marginLeft: "20px",
    marginRight: "20px",
    borderBottom: "2px solid #E3E5E8",
    maxHeight: "40px",
    width: "max-content",
  },
  navOption: {
    marginLeft: "25px",
    fontSize: "16px",
    padding: "10px",
    paddingBottom: "35px",
    cursor: "pointer",
    position: "relative",
    top: "-8px",
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
    },
  },
  bottomStyle: {
    marginLeft: "25px",
    fontSize: "16px",
    padding: "10px",
    paddingBottom: "35px",
    cursor: "pointer",
    position: "relative",
    top: "-9px",
    borderBottom: "4px solid #58C5D2",
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
    },
  },
  topbar: {
    height: '5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    top: 0,
    right: 0,
  },
  addNewBtn: {
    height: '2rem',
    width: '8rem',
    marginRight: '4rem',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#00c853',
    color: 'white',
    borderRadius: '1rem',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: "30px",
  },
  navMainTitle: {
    marginLeft: "20px",
    marginTop: "23px",
    [theme.breakpoints.down('md')]: {
      marginTop: "10px",
    },
  },
  bankCardCont: {
    width: "80%",
    overflowX: 'auto',
    display: 'flex',
    alignItems: 'center',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      borderRadius: "2px"
    }
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
  myNavBarCont: {
    width: "100%",
  },
  barCont: {
    maxWidth: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    '&::-webkit-scrollbar': {
      display: 'none'
    },
  },
  menuAndTitleCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "15px",
  },
  menuStyle: {
    marginRight: "10px",
    display: "none",
    [theme.breakpoints.down('md')]: {
      display: "block",
    },
  }
}));



export default function MyNavBar(props) {
  const {
    show,
    setShow,
    title,
    options,
    Component,
    walletId,
    txAndAccountData,
    isMenu = true
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles();
  const {
    navBar, myNavBarCont, accRow, navOption,
    bottomStyle, addNewBtn, topBar, bankCardCont,
    accountCard, lowerCardPart, uperCardPartAcc,
    uperCardPartAccSelected, barCont, navMainTitle,
    menuAndTitleCont, menuStyle
  } = classes;
  const [accountNo, setAccountNo] = useState(0)




  const getMenuClick = () => {

    dispatch({
      type: 'changeToggleBar',
      payload: {
        toggleBarBool: true,
      },
    })

  }


  return (
    <div className={myNavBarCont} >
      <div className={topBar} >

        <div className={menuAndTitleCont} >
          {isMenu && <MenuIcon className={menuStyle} onClick={() => { getMenuClick() }} />}
          {title?.length > 0 ? (
            <h2>{title}</h2>
          ) : null}
        </div>

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
        {Component &&
          <Component
            walletId={walletId}
          />
        }
      </div>
      <div className={barCont} >
        <div className={navBar} >
          {options.map((option) => (
            <p key={option.value} className={show === option.value ? bottomStyle : navOption} onClick={() => setShow(option.value)} >{option.label}</p>
          ))}
        </div>
      </div>
      {options.map((option) => {
        const {
          Component, value
        } = option;
        return <div key={value}>{show === value ?
          (txAndAccountData ? (<Component data={txAndAccountData[accountNo]} />) : (Component))
          : null}</div>
      })}
    </div>
  );
}
