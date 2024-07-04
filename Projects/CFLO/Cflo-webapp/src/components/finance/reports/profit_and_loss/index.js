import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ReportPaper from '../ReportPaper';
import PDFDialog from '../pdfDialog';
import CreateTreeViewOfChartAccounts from '../CreateTreeViewOfChartAccounts';
import { getTotalAmountChartAccounts } from '../RestructureChartArr';
import BarInReport from '../BarInReport';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import ProfitAndLossPDF from './pdf';
const _ = require("lodash");


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  divider: {
    width: '100%',
    borderTop: "1px solid #E1E2E5",
  },

  downloadCont: {
    width: '100%',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px"
  },

}));

export default function ProfitAndLoss(props) {
  const { walletId, accts, setPage, setReportPage } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { root, divider, downloadCont } = classes;
  const walletReducer = useSelector((state) => state.wallet);
  const { walletDictionary } = walletReducer;
  const wallet = walletDictionary[walletId];

  let cog = "Cost of Goods Sold"
  let oe = 'Other Expense'
  let oi = 'Other Income'

  const [chartAccountGroup, setChartAccountGroup] = useState(null)

  const [grossProfit, setGrossProfit] = useState(0)
  const [netOperatingIncome, setNetOperatingIncome] = useState(0)
  const [netOtherIncome, setNetOtherIncome] = useState(0)
  const [netIncome, setNetIncome] = useState(0)

  useEffect(() => {
    const linesGroupById = _.groupBy(accts, 'classification')
    setChartAccountGroup(linesGroupById)

    let gross_profit = getTotalAmountChartAccounts(linesGroupById?.Income) + 
    getTotalAmountChartAccounts(linesGroupById?.[oi]) - getTotalAmountChartAccounts(linesGroupById?.[cog])
    setGrossProfit(gross_profit)

    let net_operating_income = gross_profit - getTotalAmountChartAccounts(linesGroupById?.Expense)
    setNetOperatingIncome(net_operating_income)

    let net_other_income = getTotalAmountChartAccounts(linesGroupById?.[oi])
    setNetOtherIncome(net_other_income)

    let net_income = net_operating_income - getTotalAmountChartAccounts(linesGroupById?.[oe])
    setNetIncome(net_income)

  }, [walletId, accts]);



  let name = '';

  switch (wallet?.parentModelName) {
    case 'User':
      name = wallet?.parent?.displayName || '';
      break;
    case 'Team':
      name = wallet?.parent?.parent?.displayName || '';
      break;
    default:
      break;
  }


  return (
    <div className={root}>
      <div className={downloadCont} >
        <div>
          <IconButton className={classes.iconButtonStyle} onClick={() => {
            setPage("OptionPage")
            setReportPage(null)
          }}>
            <KeyboardBackspaceIcon style={{ fontSize: 30, color: theme.palette.primary }} />
          </IconButton>
        </div>
        <div>
          <PDFDialog
            PDFReport={
              <ProfitAndLossPDF
                walletId={walletId}
                accts={accts}
              />
            }
            walletId={walletId}
          />
        </div>
      </div>
      <ReportPaper
        title={name}
        subTitle='Profit and Loss'
      >
        <List component="nav" className={classes.root} aria-label="mailbox folders">
          <div className={divider} ></div>
          <ListItem button>
            <CreateTreeViewOfChartAccounts
              chartAccounts={chartAccountGroup && chartAccountGroup.Income}
              mainLabel="INCOME"
              forPrint={false}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button>
            <CreateTreeViewOfChartAccounts
              chartAccounts={chartAccountGroup && chartAccountGroup?.[oi]}
              mainLabel="OTHER INCOME"
              forPrint={false}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button>
            <CreateTreeViewOfChartAccounts
              chartAccounts={chartAccountGroup && chartAccountGroup?.[cog]}
              mainLabel="COST OF GOODS SOLD"
              forPrint={false}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button>
            <BarInReport
              label="GROSS PROFIT"
              total={grossProfit?.toFixed(2)}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button>
            <CreateTreeViewOfChartAccounts
              chartAccounts={chartAccountGroup && chartAccountGroup?.Expense}
              mainLabel="EXPENSE"
              forPrint={false}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button>
            <BarInReport
              label="NET OPERATING INCOME"
              total={netOperatingIncome?.toFixed(2)}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button>
            <CreateTreeViewOfChartAccounts
              chartAccounts={chartAccountGroup && chartAccountGroup?.[oe]}
              mainLabel="OTHER EXPENSE"
              forPrint={false}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button >
            <BarInReport
              label="NET OTHER INCOME"
              total={netOtherIncome?.toFixed(2)}
            />
          </ListItem>
          <div className={divider} ></div>
          <ListItem button>
            <BarInReport
              label="NET INCOME"
              total={netIncome?.toFixed(2)}
            />
          </ListItem>
        </List>
      </ReportPaper>
    </div>
  );
}
