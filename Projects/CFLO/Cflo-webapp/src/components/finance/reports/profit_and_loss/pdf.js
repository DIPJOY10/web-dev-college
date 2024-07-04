import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CreateTreeViewOfChartAccounts from '../CreateTreeViewOfChartAccounts';
import { getTotalAmountChartAccounts } from '../RestructureChartArr';
import BarInReport from '../BarInReport';
import ReportPaperPdf from '../ReportPaperPdf';
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
}));

export default function ProfitAndLossPDF(props) {
  const { walletId, accts } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { divider, root } = classes;
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
    <ReportPaperPdf
      title={name}
      subTitle='Profit and Loss'
    >
      <List component="nav" className={root} aria-label="mailbox folders">
        <div className={divider} ></div>
        <ListItem button>
          <CreateTreeViewOfChartAccounts
            chartAccounts={chartAccountGroup && chartAccountGroup.Income}
            mainLabel="INCOME"
            forPrint={true}
          />
        </ListItem>
        <div className={divider} ></div>
        <ListItem button>
          <CreateTreeViewOfChartAccounts
            chartAccounts={chartAccountGroup && chartAccountGroup?.[oi]}
            mainLabel="OTHER INCOME"
            forPrint={true}
          />
        </ListItem>
        <div className={divider} ></div>
        <ListItem button>
          <CreateTreeViewOfChartAccounts
            chartAccounts={chartAccountGroup && chartAccountGroup?.[cog]}
            mainLabel="COST OF GOODS SOLD"
            forPrint={true}
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
            forPrint={true}
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
            forPrint={true}
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
    </ReportPaperPdf>
  );
}
