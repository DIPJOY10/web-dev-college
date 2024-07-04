import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import { AppBar, Chip, useMediaQuery } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import BankAccountSvg from '../finance/assets/bank-account.svg';
import StatementSvg from '../finance/assets/accounting.svg';
import NetworkSvg from '../finance/assets/network.svg';
import ServiceSvg from '../finance/assets/service.svg';
import InvoiceSvg from '../finance/assets/invoice.svg';
import BillSvg from '../finance/assets/bill.svg';
import TransactionSvg from '../finance/assets/transactions.svg';
import { useFindWallet, useGetWallet } from '../finance/hooks';
import LessText from '../styled/CommonComponents/LessText';


const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.down("md")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    }
  },

  menuButton: {
    width: "70px"
  },

  toolbar: theme.mixins.toolbar,

  drawerPaper: {
    width: "20%",
    [theme.breakpoints.down("md")]: {
      width: "30%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    }
  },

  content: {
    flexGrow: 1
  },

  closeMenuButton: {
    marginRight: "auto",
    marginLeft: 0
  },

  root: {
    display: 'flex',
    width: '100vw',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    },
  },

  left: {
    top: 0,
    left: 0,
    width: '100%',
    overflow: 'auto',
    [theme.breakpoints.down("md")]: {
      width: "100%",
    }
  },

  right: {
    top: 0,
    right: 0,
    width: '80vw',
    height: '100vh',
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      width: '100vw',
    },
  },

  top: {
    height: '5rem',
    paddingRight: '2rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoImg: {
    height: '2.4rem',
    width: '2.4rem',
    marginLeft: '2rem',
    marginRight: '0.8rem',
  },

  titleStyle: {
    fontSize: '1.15rem',
    fontWeight: '600',
    color: '#5abf9a',
  },

  textStyle: {
    fontSize: '0.9rem',
    fontWeight: '400',
    color: '#424242',
  },

  blockTextStyle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#616161',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  blockStyle: {
    height: '2rem',
    padding: '1.5rem 2.5rem',
    cursor: 'pointer'
  },

  navOptions: {
    width: '100%',
    paddingLeft: "25px"
  },

  listItemStyle: {
    height: '2.7rem',
  },

  size1IconStyle: {
    height: '1.55rem',
    width: '1.55rem',
    marginRight: '1rem',
    filter: 'grayscale(100%)',
  },

  size2IconStyle: {
    height: '1.43rem',
    width: '1.43rem',
    marginRight: '1rem',
    filter: 'grayscale(80%)',
  },
}));


export const ListItemText = (props) => {
  const classes = useStyles();
  const { primary } = props;
  const { textStyle } = classes;

  return <Typography className={textStyle}>{primary}</Typography>;
};

export const BlockItem = (props) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);

  const { wallet, onClickTitle } = props;
  const { blockTextStyle, blockStyle } = classes;

  console.log(wallet,' is the wallet')

  return (
    <>
      <Divider />
        {wallet?.parentModelName == 'User'?<ListItem onClick={onClickTitle} className={blockStyle}>
        <div className={blockTextStyle}>
          <Avatar src={user?.displayPicture?.thumbUrl||user?.displayPicture?.url} style={{ width: "28px", height: "28px", marginRight: "15px" }} />
          <LessText
            limit={12}
            string={user?.displayName}
          />
        </div>
      </ListItem>:<ListItem onClick={onClickTitle} className={blockStyle}>
        <div className={blockTextStyle}>
          <Avatar src={wallet?.parent?.parent?.displayPicture?.thumbUrl} style={{ width: "28px", height: "28px", marginRight: "15px" }} />
          <LessText
            limit={12}
            string={wallet?.parent?.parent?.displayName}
          />
        </div>
      </ListItem>}

      <Divider />
    </>
  );
};


export default function S(props) {
  const classes = useStyles();
  const walletId = useFindWallet();
  const theme = useTheme();
  const { wallet } = useGetWallet(walletId);
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    left, right, top, size1IconStyle, navOptions,
    size2IconStyle, listItemStyle, titleStyle
  } = classes;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("");

  const { wallet: walletReducerData } = useSelector((state) => state);

  useEffect(() => {
    setMobileOpen(walletReducerData.toggleBarBool)
  }, [walletReducerData.toggleBarBool])

  useEffect(() => {
    dispatch({
      type: 'changeToggleBar',
      payload: {
        toggleBarBool: false,
      },
    })
  }, [])


  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);

    dispatch({
      type: 'changeToggleBar',
      payload: {
        toggleBarBool: !mobileOpen,
      },
    })

  }

  const navTo = (location) => {
    setMobileOpen(false);

    dispatch({
      type: 'changeToggleBar',
      payload: {
        toggleBarBool: false,
      },
    })

    if (location) {
      const path = '/admin/' + walletId + '/' + location;
      history.push(path);
    }

    switch (location) {
      case "accounts":
        setHeaderTitle("Account")
        break;

      case "transactions":
        setHeaderTitle("Transactions")
        break;

      case "statements":
        setHeaderTitle("Statements")
        break;

      case "network/customer":
        setHeaderTitle("Network")
        break;

      case "offering":
        setHeaderTitle("Offering")
        break;

      case "salesAndInvoices":
        setHeaderTitle("Sales")
        break;

      case "expenseAndBills":
        setHeaderTitle("Expense")
        break;

    }


  };

  const onClickTitle = () => {

    let type = wallet?.parentModelName == "User"? "User":wallet?.parent?.parentModelName
    
    let path

    switch (type) {

      case "Project":
        path = '/projects/' + wallet?.parent?._id;
        history.push(path);
        break;

      case "Organization":
        path = '/organizations/' + wallet?.parent?._id;
        history.push(path);
        break;

      case "User":
        path = '/';
        history.push(path);
        break;

    }

  };



  const DrawerNav = (
    <div className={left}>
      <List component="nav">

        <div className={top} >
          <img
            alt="Logo"
            className={classes.logoImg}
            src={require('../../Assets/LogoV3.svg')}
            onClick={() => {
              const path = '/';
              history.push(path);
            }}
            style={{ cursor: 'pointer' }}
          />
          <Typography
            className={titleStyle}
            onClick={() => {
              const path = '/';
              history.push(path);
            }}
            style={{ cursor: 'pointer' }}
          >Financials <Chip
          size="small"
          label="TestMode"
          clickable
          color="primary"
        /></Typography>
        </div>

        <BlockItem
          wallet={wallet}
          onClickTitle={onClickTitle}
        />

        <div className={navOptions} >

          <ListItem button onClick={() => navTo('accounts')} className={listItemStyle}>
            <img className={size1IconStyle} src={BankAccountSvg} />
            <ListItemText primary="Accounts" />
          </ListItem>

          <ListItem button onClick={() => navTo('transactions')} className={listItemStyle}>
            <img className={size2IconStyle} src={TransactionSvg} />
            <ListItemText primary="Transactions" />
          </ListItem>

          <ListItem button onClick={() => navTo('statements')} className={listItemStyle}>
            <img className={size2IconStyle} src={StatementSvg} />
            <ListItemText primary="Financial Statements" />
          </ListItem>

          <ListItem button className={listItemStyle} onClick={() => navTo('network/customer')}>
            <img className={size1IconStyle} src={NetworkSvg} />
            <ListItemText primary="Business Network" />
          </ListItem>

          <ListItem button className={listItemStyle} onClick={() => navTo('offering')}>
            <img className={size1IconStyle} src={ServiceSvg} />
            <ListItemText primary="Product & Services" />
          </ListItem>

          <ListItem button className={listItemStyle} onClick={() => navTo('salesAndInvoices')}>
            <img className={size1IconStyle} src={InvoiceSvg} />
            <ListItemText primary="Sale & Invoices" />
          </ListItem>

          <ListItem button className={listItemStyle} onClick={() => navTo('expenseAndBills')}>
            <img className={size2IconStyle} src={BillSvg} />
            <ListItemText primary="Expense & Bills" />
          </ListItem>

        </div>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />

      <nav className={classes.drawer}>

        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >

            {DrawerNav}
          </Drawer>
        </Hidden>

        <Hidden mdDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {DrawerNav}
          </Drawer>
        </Hidden>

      </nav>

      <Paper square className={right}>
        {props.children}
      </Paper>
    </div>
  );
}


















